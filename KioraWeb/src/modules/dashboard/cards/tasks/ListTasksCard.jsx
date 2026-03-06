import React from 'react';
import { Icon } from '@iconify/react';
import { useTasks } from '../../hooks/useTasks';
import { useSubtasks } from '../../hooks/useSubtasks';
import TaskCard, { TagPill } from '../../../../common/components/cards/TaskCard';
import { Typography } from '../../../../common/components/typography/typography';
import styles from './ListTasksCard.module.css';
import TaskDeck from '../../components/TaskDeck';
import TaskFormAdd from './TaskFormAdd';


const ListTasksCard = ({ onTaskClick, isFocused, tasks, isLoading, error, refetchTasks }) => {
    const [isAdding, setIsAdding] = React.useState(false);

    const toggleAdding = () => setIsAdding(!isAdding);

    const handleSuccess = () => {
        setIsAdding(false);
        refetchTasks(); // Refrescar la lista tras crear tarea
    };

    return (
        <div className={`${styles.container} ${isFocused ? styles.focusedContainer : ''}`}>
            <div className={styles.header}>
                <div className={styles.titleRow}>
                    <Typography variant="dashboard-title">
                        {isAdding ? 'Nueva Tarea' : 'Tareas'}
                    </Typography>
                </div>
                <button
                    className={`${styles.addBtn} ${isAdding ? styles.activeAddBtn : ''}`}
                    aria-label={isAdding ? "Cancelar" : "Agregar tarea"}
                    onClick={toggleAdding}
                >
                    <Icon
                        icon={isAdding ? "solar:close-square-broken" : "solar:add-square-broken"}
                        className={styles.addIcon}
                    />
                </button>
            </div>

            <div className={styles.content}>
                {isAdding ? (
                    <TaskFormAdd
                        onCancel={() => setIsAdding(false)}
                        onSuccess={handleSuccess}
                    />
                ) : (
                    <>
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
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ListTasksCard;