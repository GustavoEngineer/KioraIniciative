import React from 'react';
import { Typography } from '../../../../../../common/components/typography/typography';
import DashboardCard from '../../../../../../common/components/cards/DashboardCard';
import styles from './ListTasksCard.module.css';
import TaskCard from '../../../../../../common/components/cards/TaskCard';
import { Icon } from '@iconify/react';
import '../../../transitions/dashboard_AddTask.css';
import '../../../transitions/Dashboard_taskinfo.css';

const ListTasksCard = ({ onTaskClick, isFocused, isTaskFocused, tasks, isLoading, error }) => {
    return (
        <div className={`${styles.container} listtasks-container-transition ${isFocused ? 'listtasks-focused-transition' : ''} ${isTaskFocused ? 'listtasks-taskfocused-transition' : ''}`}>
            <div className={styles.categoryHeader}>
                <div className={styles.categoryLeft}>
                    <Icon icon="solar:add-bold" width={16} className={styles.addIcon} />
                    <Typography variant="dashboard-title" className={styles.categoryTitle}>
                        Por hacer
                    </Typography>
                </div>
                <div className={styles.statusPill}>
                    <Icon icon="solar:pen-new-square-bold" width={14} className={styles.pillIcon} />
                    <span className={styles.pillCount}>{tasks.length}</span>
                </div>
            </div>

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
                            onClick={() => onTaskClick(task)}
                            variant={isFocused ? 'compact' : 'default'}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ListTasksCard;