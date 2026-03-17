import React, { useState, useEffect } from 'react';
import { FiPlus, FiList, FiCheck } from 'react-icons/fi';
import { useTags } from '../../../../hooks/useTag';
import { taskService } from '../../../../services/taskService';
import { tagService } from '../../../../services/tagService';
import styles from './AddTaskCard.module.css';

// Inputs
import TaskTitleInput from './inputs/TaskTitleInput';
import TaskDescriptionInput from './inputs/TaskDescriptionInput';
import TaskTagInput from './inputs/TaskTagInput';
import TaskTimeInput from './inputs/TaskTimeInput';
import TaskDateInput from './inputs/TaskDateInput';
import SubtasksSection from './inputs/SubtasksSection';

const AddTaskCard = ({ isFocused, initialDate, onTaskCreated, onCancel, onFormChange }) => {
    const { tags, isLoading: isLoadingTags, refetchTags } = useTags();
    const [isLoading, setIsLoading] = useState(false);
    const [tagSearch, setTagSearch] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isPlanning, setIsPlanning] = useState(false);
    const [subtasks, setSubtasks] = useState([]);
    const [newSubtask, setNewSubtask] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        tag_id: '',
        hours: 0,
        minutes: 0,
        due_date: initialDate || new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        if (onFormChange) {
            onFormChange({ ...formData, tag_name: tagSearch, subtasks });
        }
    }, [formData, tagSearch, subtasks, onFormChange]);

    useEffect(() => {
        if (initialDate) {
            setFormData(prev => ({ ...prev, due_date: initialDate }));
        }
    }, [initialDate]);

    const filteredTags = tags.filter(tag => 
        tag.name.toLowerCase().includes(tagSearch.toLowerCase())
    );

    const handleTagChange = (e) => {
        const value = e.target.value;
        setTagSearch(value);
        setShowSuggestions(true);
        // Reset tag_id if searching/typing
        setFormData(prev => ({ ...prev, tag_id: '' }));
    };

    const selectTag = (tag) => {
        setTagSearch(tag.name);
        setFormData(prev => ({ ...prev, tag_id: tag.id }));
        setShowSuggestions(false);
    };

    const handleAddSubtask = (e) => {
        if (e.key === 'Enter' || e.type === 'click') {
            if (newSubtask.trim()) {
                setSubtasks([...subtasks, { id: Date.now(), title: newSubtask.trim() }]);
                setNewSubtask('');
            }
        }
    };

    const removeSubtask = (id) => {
        setSubtasks(subtasks.filter(st => st.id !== id));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        if (!formData.title.trim()) return;

        setIsLoading(true);
        try {
            let currentTagId = formData.tag_id;

            // If we have a tag search string but no tag_id, it might be a new tag
            if (tagSearch.trim() && !currentTagId) {
                // Check if it exactly matches an existing tag first
                const existingTag = tags.find(t => t.name.toLowerCase() === tagSearch.toLowerCase());
                if (existingTag) {
                    currentTagId = existingTag.id;
                } else {
                    // Create new tag
                    const { data: newTag, error: tagError } = await tagService.createTag(tagSearch.trim());
                    if (tagError) throw tagError;
                    currentTagId = newTag.id;
                    await refetchTags(); // Actualizar la lista local de tags
                }
            }

            const taskData = {
                title: formData.title,
                description: formData.description,
                tag_id: currentTagId || null,
                priority: 2, // Default
                status: 'Por hacer',
                estimated_time: parseFloat(formData.hours) + (parseFloat(formData.minutes) / 60),
                due_date: formData.due_date
            };

            const { error } = await taskService.createTask(taskData);
            if (error) throw error;

            // Reset form
            setFormData({
                title: '',
                description: '',
                tag_id: '',
                hours: 0,
                minutes: 0,
                due_date: initialDate || new Date().toISOString().split('T')[0]
            });
            setTagSearch('');
            if (onTaskCreated) onTaskCreated();
        } catch (error) {
            console.error('Error creating task:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setIsPlanning(false);
        if (onCancel) onCancel();
    };

    const isFormValid = 
        formData.title.trim() !== '' && 
        tagSearch.trim() !== '' && 
        (parseInt(formData.hours) > 0 || parseInt(formData.minutes) > 0) &&
        formData.due_date !== '';

    return (
        <div className={`${styles.container} ${isFocused ? styles.focused : ''}`}>

            <div className={styles.formViewPort}>
                <div className={`${styles.slidingContainer} ${isPlanning ? styles.planningMode : ''}`}>
                    {/* Subtasks View (Left) */}
                    <div className={styles.contentSection}>
                        <SubtasksSection 
                            subtasks={subtasks}
                            newSubtask={newSubtask}
                            setNewSubtask={setNewSubtask}
                            onAddSubtask={handleAddSubtask}
                            onRemoveSubtask={removeSubtask}
                        />
                    </div>

                    {/* Main Form View (Right) */}
                    <div className={styles.contentSection}>
                        <form className={styles.form}>
                            <div className={styles.titleRow}>
                                <TaskTitleInput 
                                    value={formData.title} 
                                    onChange={handleChange} 
                                />
                            </div>

                            <div className={styles.detailsRow}>
                                <div className={styles.leftCol}>
                                    <TaskTagInput 
                                        tagSearch={tagSearch}
                                        onTagChange={handleTagChange}
                                        filteredTags={filteredTags}
                                        showSuggestions={showSuggestions}
                                        setShowSuggestions={setShowSuggestions}
                                        selectTag={selectTag}
                                        isLoadingTags={isLoadingTags}
                                    />

                                    <TaskTimeInput 
                                        hours={formData.hours}
                                        minutes={formData.minutes}
                                        onChange={handleChange}
                                    />

                                    <TaskDateInput 
                                        value={formData.due_date}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className={styles.rightCol}>
                                    <TaskDescriptionInput 
                                        value={formData.description} 
                                        onChange={handleChange} 
                                    />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <div className={styles.actions}>
            <button 
                type="button"
                onClick={handleCancel}
                className={styles.cancelButton}
            >
                Cancelar
            </button>
            {isPlanning ? (
                <button 
                    className={styles.secondaryButton}
                    onClick={() => setIsPlanning(false)}
                >
                    Volver a detalles
                </button>
            ) : (
                isFormValid && (
                    <button 
                        className={styles.secondaryButton}
                        onClick={() => setIsPlanning(true)}
                    >
                        Seguir planificando
                    </button>
                )
            )}
            <button 
                onClick={handleSubmit} 
                disabled={isLoading || !isFormValid}
                className={styles.saveButton}
            >
                {isLoading ? 'Guardando...' : 'Guardar Tarea'}
            </button>
        </div>
    </div>
);
};

export default AddTaskCard;
