import React from 'react';
import { Typography } from '../../../../../../common/components/typography/typography';
import DashboardCard from '../../../../../../common/components/cards/DashboardCard';
import styles from './ListTasksCard.module.css';
import TaskCard from '../../../../../../common/components/cards/TaskCard';

const ListTasksCard = ({ onTaskClick, isFocused, tasks, isLoading, error }) => {
    return (
        <div className={`${styles.container} ${isFocused ? styles.focused : ''}`}>
            <Typography variant="dashboard-title" className={styles.mainTitle}>
                Tareas
            </Typography>

            <div className={styles.content}>
                {error && (
                    <div className={`${styles.status} ${styles.error}`}>
                        <Typography variant="dashboard-body">
                            {error}
                        </Typography>
                    </div>
                )}

                {!isLoading && !error && tasks.length === 0 && (
                    <div className={styles.status}>
                        <Typography variant="dashboard-body" className={styles.emptyText}>
                            No hay tareas pendientes
                        </Typography>
                    </div>
                )}

                <div className={`
                    ${styles.tasksScroll} 
                    ${isFocused ? styles.focusedTasksScroll : ''} 
                `}>
                    {tasks.map(task => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onClick={() => onTaskClick(task.id)}
                            variant={isFocused ? 'compact' : 'default'}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ListTasksCard;