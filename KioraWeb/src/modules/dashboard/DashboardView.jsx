import React, { useState } from 'react';
import styles from './DashboardView.module.css';
import ListTasksCard from './cards/tasks/ListTasksCard';
import DateCard from './cards/elements/DateCard';
import CompletedTasksCard from './cards/elements/CompletedTasksCard';
import FocusCard from './cards/elements/FocusCard';
import CalendarCard from './cards/elements/CalendarCard';
import { useTasks } from './hooks/useTasks';

const DashboardView = () => {
    const { tasks, isLoading, error, refetchTasks } = useTasks();
    const [focusedTaskId, setFocusedTaskId] = useState(null);

    const handleTaskClick = (taskId) => {
        setFocusedTaskId(taskId === focusedTaskId ? null : taskId);
    };

    return (
        <div className={styles.dashboardContainer}>
            <div className={styles.scrollContent}>
                <div className={styles.widgetsColumn}>
                    <DateCard />
                    <CompletedTasksCard />
                    <FocusCard />
                </div>
                <div className={styles.calendarColumn}>
                    <CalendarCard />
                </div>

                <ListTasksCard
                    onTaskClick={handleTaskClick}
                    isFocused={focusedTaskId !== null}
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
