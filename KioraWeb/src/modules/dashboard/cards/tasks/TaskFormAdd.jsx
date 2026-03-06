import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { Typography } from '../../../../common/components/typography/typography';
import styles from './TaskFormAdd.module.css';
import { useTags } from '../../hooks/useTag';
import { taskService } from '../../services/taskService';
import { tagService } from '../../services/tagService';

import { DashInput, DashTextArea, DashSelect, DashRange } from '../../../../common/components/inputs/dashboardinputs';

const TaskFormAdd = ({ onCancel, onSuccess }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState(5);
    const [tagId, setTagId] = useState('');
    const [tagInput, setTagInput] = useState('');
    const [showTagDropdown, setShowTagDropdown] = useState(false);
    const [dueDate, setDueDate] = useState('');
    const [subtaskInputs, setSubtaskInputs] = useState(['']);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState('default');

    const { tags, refetchTags } = useTags();

    const handleAddSubtask = () => {
        setSubtaskInputs([...subtaskInputs, '']);
    };

    const handleSubtaskChange = (index, value) => {
        const newInputs = [...subtaskInputs];
        newInputs[index] = value;
        setSubtaskInputs(newInputs);
    };

    const handleRemoveSubtask = (index) => {
        const newInputs = subtaskInputs.filter((_, i) => i !== index);
        setSubtaskInputs(newInputs.length ? newInputs : ['']);
    };

    const handleTagSelect = (tag) => {
        setTagId(tag.id);
        setTagInput(tag.name);
        setShowTagDropdown(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        setIsSubmitting(true);

        try {
            let finalTagId = tagId;

            // Si el usuario escribió algo pero no seleccionó de la lista, o seleccionó pero cambió el texto
            const existingTag = tags.find(t => t.name.toLowerCase() === tagInput.trim().toLowerCase());

            if (tagInput.trim() && !finalTagId) {
                if (existingTag) {
                    finalTagId = existingTag.id;
                } else {
                    // Crear nuevo tag
                    const { data: newTag, error: tagError } = await tagService.createTag(tagInput.trim());
                    if (tagError) throw tagError;
                    finalTagId = newTag.id;
                    await refetchTags();
                }
            } else if (tagInput.trim() && finalTagId) {
                // Verificar que el tagId coincida con lo escrito (por si el usuario seleccionó uno y luego escribió encima)
                if (existingTag && existingTag.id !== finalTagId) {
                    finalTagId = existingTag.id;
                } else if (!existingTag) {
                    // El usuario escribió algo nuevo sobre un tag seleccionado
                    const { data: newTag, error: tagError } = await tagService.createTag(tagInput.trim());
                    if (tagError) throw tagError;
                    finalTagId = newTag.id;
                    await refetchTags();
                }
            }

            // 1. Crear la tarea principal
            const { data: task, error: taskError } = await taskService.createTask({
                title: title.trim(),
                description: description.trim(),
                priority: parseInt(priority),
                tag_id: finalTagId || null,
                due_date: dueDate || null
            });

            if (taskError) throw taskError;

            // 2. Crear las subtareas si existen
            const validSubtasks = subtaskInputs.filter(s => s.trim() !== '');
            if (validSubtasks.length > 0) {
                await Promise.all(
                    validSubtasks.map(desc =>
                        taskService.createSubtask(task.id, { description: desc.trim() })
                    )
                );
            }

            if (onSuccess) onSuccess();
        } catch (error) {
            console.error('Error creating task:', error);
            alert('Hubo un error al crear la tarea. Por favor intente de nuevo.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.formWrapper}>
            <div className={styles.tabsContainer}>
                <div className={styles.segmentedControl}>
                    <button
                        type="button"
                        className={`${styles.tabBtn} ${activeTab === 'default' ? styles.tabActive : ''}`}
                        onClick={() => setActiveTab('default')}
                    >
                        <Icon icon="solar:notes-minimalistic-linear" className={styles.tabIcon} />
                        <span>General</span>
                    </button>
                    <button
                        type="button"
                        className={`${styles.tabBtn} ${activeTab === 'advanced' ? styles.tabActive : ''}`}
                        onClick={() => setActiveTab('advanced')}
                    >
                        <Icon icon="solar:checklist-minimalistic-linear" className={styles.tabIcon} />
                        <span>Subtareas</span>
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className={styles.formBody}>
                {activeTab === 'default' ? (
                    <div className={styles.tabContent}>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Título de la tarea</label>
                            <DashInput
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Ej: Comprar café"
                                required
                                autoFocus
                            />
                        </div>

                        <div className={styles.row}>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Tag</label>
                                <div className={styles.tagInputWrapper}>
                                    <DashInput
                                        value={tagInput}
                                        onChange={(e) => {
                                            setTagInput(e.target.value);
                                            setTagId(''); // Reset id when typing
                                            setShowTagDropdown(true);
                                        }}
                                        onFocus={() => setShowTagDropdown(true)}
                                        placeholder="Tag personalizado..."
                                    />
                                    <button
                                        type="button"
                                        className={styles.dropdownBtn}
                                        onClick={() => setShowTagDropdown(!showTagDropdown)}
                                    >
                                        <Icon icon="solar:alt-arrow-down-linear" />
                                    </button>

                                    {showTagDropdown && (
                                        <div className={styles.tagDropdown}>
                                            {tags
                                                .filter(t => t.name.toLowerCase().includes(tagInput.toLowerCase()))
                                                .map(tag => (
                                                    <div
                                                        key={tag.id}
                                                        className={styles.tagOption}
                                                        onClick={() => handleTagSelect(tag)}
                                                    >
                                                        {tag.name}
                                                    </div>
                                                ))
                                            }
                                            {tagInput.trim() && !tags.some(t => t.name.toLowerCase() === tagInput.toLowerCase()) && (
                                                <div className={styles.tagOptionHint}>
                                                    Crear nueva: "{tagInput}"
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Prioridad: {priority}</label>
                                <DashRange
                                    min="1"
                                    max="10"
                                    value={priority}
                                    onChange={(e) => setPriority(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Descripción</label>
                            <DashTextArea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="¿Algo más que debas recordar?"
                                rows="4"
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Fecha de Entrega</label>
                            <DashInput
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                            />
                        </div>
                    </div>
                ) : (
                    <div className={styles.tabContent}>
                        <div className={styles.subtasksSection}>
                            <div className={styles.sectionHeader}>
                                <label className={styles.label}>Listado de Subtareas</label>
                                <button type="button" onClick={handleAddSubtask} className={styles.addSmallBtn}>
                                    <Icon icon="solar:add-circle-linear" />
                                </button>
                            </div>
                            <div className={styles.subtaskInputs}>
                                {subtaskInputs.map((sub, index) => (
                                    <div key={index} className={styles.subtaskRow}>
                                        <DashInput
                                            value={sub}
                                            onChange={(e) => handleSubtaskChange(index, e.target.value)}
                                            placeholder={`Nueva subtarea ${index + 1}`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveSubtask(index)}
                                            className={styles.removeBtn}
                                        >
                                            <Icon icon="solar:trash-bin-minimalistic-linear" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                <div className={styles.formFooter}>
                    <button
                        type="button"
                        onClick={onCancel}
                        className={styles.cancelBtn}
                        disabled={isSubmitting}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className={styles.submitBtn}
                        disabled={isSubmitting || !title.trim()}
                    >
                        {isSubmitting ? 'Guardando...' : 'Crear Tarea'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TaskFormAdd;
