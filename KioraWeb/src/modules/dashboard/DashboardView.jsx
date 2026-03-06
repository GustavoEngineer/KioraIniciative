import React, { useState } from 'react';
import styles from './DashboardView.module.css';
import ListTasksCard from './cards/tasks/ListTasksCard';
import DateCard from './cards/DateCard';
import CompletedTasksCard from './cards/CompletedTasksCard';
import FocusCard from './cards/FocusCard';
import CalendarCard from './cards/CalendarCard';
import TaskInfoCard from './cards/tasks/TaskInfoCard';
import DateEditor from './cards/tasks/publishers/DateEditor';
import TagEditor from './cards/tasks/publishers/TagEditor';
import PriorityEditor from './cards/tasks/publishers/PriorityEditor';
import DescriptionEditor from './cards/tasks/publishers/DescriptionEditor';
import SubtasksEditor from './cards/tasks/publishers/SubtasksEditor';
import { useTasks } from './hooks/useTasks';
import { useTags } from './hooks/useTag';
import { useSubtasks } from './hooks/useSubtasks';
import { taskService } from './services/taskService';
import { tagService } from './services/tagService';

const DashboardView = () => {
    const { tasks, isLoading, error, refetchTasks } = useTasks();
    const { tags, refetchTags } = useTags();
    const [focusedTaskId, setFocusedTaskId] = useState(null);
    const { subtasks, isLoading: subtasksLoading, refetchSubtasks } = useSubtasks(focusedTaskId);
    const [isEditingDate, setIsEditingDate] = useState(false);
    const [isEditingTag, setIsEditingTag] = useState(false);
    const [isEditingPriority, setIsEditingPriority] = useState(false);
    const [isEditingDescription, setIsEditingDescription] = useState(false);
    const [isEditingSubtasks, setIsEditingSubtasks] = useState(false);

    const handleTaskClick = (taskId) => {
        setFocusedTaskId(taskId === focusedTaskId ? null : taskId);
        setIsEditingDate(false);
        setIsEditingTag(false);
        setIsEditingPriority(false);
        setIsEditingDescription(false);
        setIsEditingSubtasks(false);
    };

    const handleEditDate = () => {
        setIsEditingDate(!isEditingDate);
        setIsEditingTag(false);
        setIsEditingPriority(false);
        setIsEditingDescription(false);
        setIsEditingSubtasks(false);
    };

    const handleEditTag = () => {
        setIsEditingTag(!isEditingTag);
        setIsEditingDate(false);
        setIsEditingPriority(false);
        setIsEditingDescription(false);
        setIsEditingSubtasks(false);
    };

    const handleEditPriority = () => {
        setIsEditingPriority(!isEditingPriority);
        setIsEditingDate(false);
        setIsEditingTag(false);
        setIsEditingDescription(false);
        setIsEditingSubtasks(false);
    };

    const handleEditDescription = () => {
        setIsEditingDescription(!isEditingDescription);
        setIsEditingDate(false);
        setIsEditingTag(false);
        setIsEditingPriority(false);
        setIsEditingSubtasks(false);
    };

    const handleEditSubtasks = () => {
        setIsEditingSubtasks(!isEditingSubtasks);
        setIsEditingDate(false);
        setIsEditingTag(false);
        setIsEditingPriority(false);
        setIsEditingDescription(false);
    };

    const handleSelectDate = async (newDate) => {
        if (!focusedTaskId) return;
        try {
            const { error } = await taskService.updateTask(focusedTaskId, { due_date: newDate });
            if (error) throw error;
            await refetchTasks();
            setIsEditingDate(false);
        } catch (err) {
            console.error('Error updating task date:', err);
            alert('Error al actualizar la fecha');
        }
    };

    const handleUpdateTaskTag = async (tagId) => {
        if (!focusedTaskId) return;
        try {
            const { error } = await taskService.updateTask(focusedTaskId, { tag_id: tagId });
            if (error) throw error;
            await refetchTasks();
            setIsEditingTag(false);
        } catch (err) {
            console.error('Error updating task tag:', err);
            alert('Error al actualizar la etiqueta');
        }
    };

    const handleUpdateTaskPriority = async (priority) => {
        if (!focusedTaskId) return;
        try {
            const { error } = await taskService.updateTask(focusedTaskId, { priority });
            if (error) throw error;
            await refetchTasks();
            setIsEditingPriority(false);
        } catch (err) {
            console.error('Error updating task priority:', err);
            alert('Error al actualizar la prioridad');
        }
    };

    const handleUpdateTaskDescription = async (description) => {
        if (!focusedTaskId) return;
        try {
            const { error } = await taskService.updateTask(focusedTaskId, { description });
            if (error) throw error;
            await refetchTasks();
            setIsEditingDescription(false);
        } catch (err) {
            console.error('Error updating task description:', err);
            alert('Error al actualizar la descripción');
        }
    };

    const handleAddSubtask = async (description) => {
        if (!focusedTaskId) return;
        try {
            const { error } = await taskService.createSubtask(focusedTaskId, { description });
            if (error) throw error;
            await refetchSubtasks();
            await refetchTasks(); // También refrescamos tareas por si el contador cambia
        } catch (err) {
            console.error('Error adding subtask:', err);
            alert('Error al añadir la sub-tarea');
        }
    };

    const handleToggleSubtask = async (subtaskId, isCompleted) => {
        try {
            const { error } = await taskService.updateSubtask(subtaskId, { is_completed: isCompleted });
            if (error) throw error;
            await refetchSubtasks();
            await refetchTasks();
        } catch (err) {
            console.error('Error toggling subtask:', err);
            alert('Error al actualizar la sub-tarea');
        }
    };

    const handleDeleteSubtask = async (subtaskId) => {
        try {
            const { error } = await taskService.deleteSubtask(subtaskId);
            if (error) throw error;
            await refetchSubtasks();
            await refetchTasks();
        } catch (err) {
            console.error('Error deleting subtask:', err);
            alert('Error al eliminar la sub-tarea');
        }
    };

    const handleCreateTag = async (tagName) => {
        try {
            const { data: newTag, error } = await tagService.createTag(tagName);
            if (error) throw error;
            await refetchTags();
            await handleUpdateTaskTag(newTag.id);
        } catch (err) {
            console.error('Error creating tag:', err);
            alert('Error al crear la etiqueta');
        }
    };


    const isFocused = focusedTaskId !== null;

    return (
        <div className={styles.dashboardContainer}>
            <div className={styles.scrollContent}>
                <div className={`${styles.widgetsColumn} ${isFocused ? styles.hidden : ''}`}>
                    <DateCard />
                    <CompletedTasksCard />
                    <FocusCard />
                </div>
                <div className={`${styles.calendarColumn} ${isFocused ? styles.hidden : ''}`}>
                    <CalendarCard />
                </div>

                <DateEditor
                    isVisible={isFocused && isEditingDate}
                    currentDate={tasks?.find(t => t.id === focusedTaskId)?.due_date}
                    onSelectDate={handleSelectDate}
                    onClose={() => setIsEditingDate(false)}
                />

                <TagEditor
                    isVisible={isFocused && isEditingTag}
                    currentTagId={tasks?.find(t => t.id === focusedTaskId)?.tag_id}
                    tags={tags}
                    onSelectTag={(tag) => handleUpdateTaskTag(tag?.id || null)}
                    onCreateTag={handleCreateTag}
                    onClose={() => setIsEditingTag(false)}
                />

                <PriorityEditor
                    isVisible={isFocused && isEditingPriority}
                    currentPriority={tasks?.find(t => t.id === focusedTaskId)?.priority}
                    onSelectPriority={handleUpdateTaskPriority}
                    onClose={() => setIsEditingPriority(false)}
                />

                <DescriptionEditor
                    isVisible={isFocused && isEditingDescription}
                    currentDescription={tasks?.find(t => t.id === focusedTaskId)?.description}
                    onSave={handleUpdateTaskDescription}
                    onClose={() => setIsEditingDescription(false)}
                />

                <SubtasksEditor
                    isVisible={isFocused && isEditingSubtasks}
                    subtasks={subtasks}
                    onAddSubtask={handleAddSubtask}
                    onToggleSubtask={handleToggleSubtask}
                    onDeleteSubtask={handleDeleteSubtask}
                    onClose={() => setIsEditingSubtasks(false)}
                />

                <TaskInfoCard
                    taskId={focusedTaskId}
                    isVisible={isFocused}
                    tasks={tasks}
                    subtasks={subtasks}
                    subtasksLoading={subtasksLoading}
                    refetchTasks={refetchTasks}
                    onEditDate={handleEditDate}
                    isEditingDate={isEditingDate}
                    onEditTag={handleEditTag}
                    isEditingTag={isEditingTag}
                    onEditPriority={handleEditPriority}
                    isEditingPriority={isEditingPriority}
                    onEditDescription={handleEditDescription}
                    isEditingDescription={isEditingDescription}
                    onEditSubtasks={handleEditSubtasks}
                    isEditingSubtasks={isEditingSubtasks}
                />
                <ListTasksCard
                    onTaskClick={handleTaskClick}
                    isFocused={isFocused}
                    tasks={tasks}
                    isLoading={isLoading}
                    error={error}
                    refetchTasks={refetchTasks}
                />
            </div>
        </div>
    );
};

export default DashboardView;
