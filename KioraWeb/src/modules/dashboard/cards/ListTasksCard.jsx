import React from 'react';
import { Icon } from '@iconify/react';
import { useTasks } from '../hooks/useTasks';
import TaskCard from '../../../common/components/cards/TaskCard';
import { Typography } from '../../../common/components/typography/typography';
import styles from './ListTasksCard.module.css';
import TaskDeck from '../components/TaskDeck';

const formatDate = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    const day = date.toLocaleDateString('es-ES', { weekday: 'short' });
    const num = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleDateString('es-ES', { month: 'short' });
    const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
    return `${cap(day)} ${num} ${cap(month)}`;
};

const ListTasksCard = ({ onTaskClick, isFocused, focusedTaskId }) => {
    const { tasks, isLoading, error } = useTasks();

    // Tareas a mostrar en la lista principal
    const displayTasks = isFocused
        ? tasks.filter(t => t.id === focusedTaskId)
        : tasks;

    // Tareas para el deck (todas menos la actual si está en foco)
    const deckTasks = isFocused
        ? tasks.filter(t => t.id !== focusedTaskId)
        : [];

    // Nombre de la tarea en foco para el header
    const focusedTask = tasks.find(t => t.id === focusedTaskId);
    const headerTitle = isFocused && focusedTask ? focusedTask.title : 'Tareas';

    return (
        <div className={`${styles.container} ${isFocused ? styles.expanded : ''}`}>
            <div className={styles.header}>
                <div className={styles.titleRow}>
                    {isFocused && (
                        <button
                            className={styles.owlBtn}
                            onClick={() => onTaskClick(focusedTaskId)}
                            aria-label="Volver al dashboard"
                        >
                            <Icon
                                icon="material-symbols-light:owl-rounded"
                                className={styles.owlIcon}
                            />
                        </button>
                    )}
                    <Typography variant="dashboard-title">
                        {headerTitle}
                    </Typography>
                </div>
                {isFocused && focusedTask?.due_date && (
                    <div className={styles.dueDateInline}>
                        <Icon icon="solar:calendar-minimalistic-linear" className={styles.calendarIcon} />
                        <span className={styles.dueDateValue}>{formatDate(focusedTask.due_date)}</span>
                    </div>
                )}
            </div>

            {!isFocused && (
                <div className={styles.content}>
                    {isLoading && (
                        <div className={styles.status}>Cargando tareas...</div>
                    )}

                    {error && (
                        <div className={`${styles.status} ${styles.error}`}>
                            {error}
                        </div>
                    )}

                    {!isLoading && !error && tasks.length === 0 && (
                        <div className={styles.status}>No hay tareas pendientes</div>
                    )}

                    <div className={styles.tasksScroll}>
                        {tasks.map(task => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                onClick={() => onTaskClick(task.id)}
                                isFocused={focusedTaskId === task.id}
                            />
                        ))}
                    </div>
                </div>
            )}

            {isFocused && (
                <div className={styles.focusedContent}>
                    {focusedTask?.description
                        ? <p className={styles.focusedDescription}>{focusedTask.description}</p>
                        : <p className={styles.focusedEmpty}>Sin descripción.</p>
                    }
                </div>
            )}

            {isFocused && (
                <TaskDeck tasks={deckTasks} onTaskSelect={(task) => onTaskClick(task.id)} />
            )}
        </div>
    );
};

export default ListTasksCard;
