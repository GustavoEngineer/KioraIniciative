import React from 'react';
import { useTasks } from '../hooks/useTasks';
import TaskCard from '../../../common/components/cards/TaskCard';
import { Typography } from '../../../common/components/typography/typography';
import styles from './ListTasksCard.module.css';
import TaskDeck from '../components/TaskDeck';

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

    return (
        <div className={`${styles.container} ${isFocused ? styles.expanded : ''}`}>
            <div className={styles.header}>
                <Typography variant="dashboard-title">
                    {isFocused ? 'Enfoque de Tarea' : 'Tareas'}
                </Typography>
            </div>

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

                {/* Lista principal (Filtrada si hay foco?)
                    El usuario pidió "al expandirse quiero generar esto debajo de las tareas"
                    Interpretamos que las tareas siguen arriba o debajo.
                */}
                <div className={styles.tasksScroll}>
                    {displayTasks.map(task => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onClick={() => onTaskClick(task.id)}
                            isFocused={focusedTaskId === task.id}
                        />
                    ))}
                </div>
            </div>

            {isFocused && (
                <TaskDeck tasks={deckTasks} />
            )}
        </div>
    );
};

export default ListTasksCard;
