import React, { useState, useMemo, useEffect } from 'react';
import styles from './DashboardView.module.css';
import ListTasksCard from './components/cards/tasks/ListTasksCard';
import DateCard from './components/cards/elements/DateCard';
import CompletedTasksCard from './components/cards/elements/CompletedTasksCard';
import FocusCard from './components/cards/elements/FocusCard';
import CalendarCard from './components/cards/elements/CalendarCard';
import TimeCard from './components/cards/elements/TimeCard';
import QuickCalendarCard from './components/cards/elements/QuickCalendarCard';
import InfoTaskCard from './components/cards/tasks/infotask/InfoTaskCard';
import { useTasks } from './hooks/useTasks';

const DashboardView = () => {
    const { tasks, isLoading, error, refetchTasks } = useTasks();
    const [focusedTaskId, setFocusedTaskId] = useState(null);
    const [lastFocusedTask, setLastFocusedTask] = useState(null);

    const focusedTask = useMemo(() => {
        return tasks.find(t => t.id === focusedTaskId) || null;
    }, [tasks, focusedTaskId]);

    // Update lastFocusedTask when focusedTask exists, keep it otherwise for animation
    useEffect(() => {
        if (focusedTask) {
            setLastFocusedTask(focusedTask);
        }
    }, [focusedTask]);

    const handleTaskClick = (taskId) => {
        setFocusedTaskId(taskId === focusedTaskId ? null : taskId);
    };

    return (
        <div className={styles.dashboardContainer}>
            <div className={styles.scrollContent}>
                <div className={styles.widgetsColumn}>
                    <div className={styles.topCardWrapper}>
                        <div className={`${styles.dateCardWrapper} ${focusedTaskId ? styles.slideDateOut : ''}`}>
                            <DateCard />
                        </div>
                        {(focusedTaskId || lastFocusedTask) && (
                            <>
                                <div className={`${styles.timeCardWrapper} ${focusedTaskId ? styles.slideIn : ''}`}>
                                    <TimeCard task={focusedTask || lastFocusedTask} />
                                </div>
                                <div className={`${styles.quickCalendarWrapper} ${focusedTaskId ? styles.slideInDelayed : ''}`}>
                                    <QuickCalendarCard tasks={tasks} focusedTask={focusedTask || lastFocusedTask} />
                                </div>
                            </>
                        )}
                    </div>
                    <div className={styles.bottomWidgets}>
                        <div className={`${styles.completedTasksWrapper} ${focusedTaskId ? styles.slideCompletedOut : ''}`}>
                            <CompletedTasksCard />
                        </div>
                        <div className={`${styles.focusCardWrapper} ${focusedTaskId ? styles.slideFocusOut : ''}`}>
                            <FocusCard />
                        </div>
                    </div>
                </div>
                <div className={styles.calendarColumn}>
                    <div className={`${styles.cardTransitionContainer} ${focusedTask ? styles.showInfo : ''}`}>
                        <div className={styles.infoCardWrapper}>
                            <InfoTaskCard
                                task={focusedTask || lastFocusedTask}
                                onClose={() => setFocusedTaskId(null)}
                            />
                        </div>
                        <div className={styles.calendarCardWrapper}>
                            <CalendarCard />
                        </div>
                    </div>
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
