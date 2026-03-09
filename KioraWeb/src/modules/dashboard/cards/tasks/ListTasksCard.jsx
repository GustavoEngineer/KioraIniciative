import React from 'react';
import { Icon } from '@iconify/react';
import { useTasks } from '../../hooks/useTasks';
import DashboardCard from '../../../../common/components/cards/DashboardCard';
import styles from './ListTasksCard.module.css';
import TaskCard, { TagPill } from '../../../../common/components/cards/TaskCard';
import TaskFormAdd from './newtask/TaskFormAdd';


const ListTasksCard = ({ onTaskClick, isFocused, tasks, isLoading, error, refetchTasks }) => {
    const [isAdding, setIsAdding] = React.useState(false);

    const toggleAdding = () => setIsAdding(!isAdding);

    const handleSuccess = () => {
        setIsAdding(false);
        refetchTasks(); // Refrescar la lista tras crear tarea
    };

    return (
        <DashboardCard
            title={isAdding ? 'Nueva Tarea' : 'Tareas'}
            className={`${styles.container} ${isFocused ? styles.focusedContainer : ''}`}
        >
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

            <div className={`${styles.content} ${isAdding ? styles.hideOverflow : ''}`}>
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
        </DashboardCard>
    );
};

export default ListTasksCard;