import React, { useState } from 'react';
import styles from './DashboardView.module.css';
import ListTasksCard from './cards/ListTasksCard';
import DateCard from './cards/DateCard';
import CompletedTasksCard from './cards/CompletedTasksCard';
import FocusCard from './cards/FocusCard';
import CalendarCard from './cards/CalendarCard';

const DashboardView = () => {
    const [focusedTaskId, setFocusedTaskId] = useState(null);

    const handleTaskClick = (taskId) => {
        setFocusedTaskId(taskId === focusedTaskId ? null : taskId);
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
                <ListTasksCard
                    onTaskClick={handleTaskClick}
                    isFocused={isFocused}
                    focusedTaskId={focusedTaskId}
                />
            </div>
        </div>
    );
};

export default DashboardView;
