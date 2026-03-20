import React, { useState, useCallback } from 'react';
import styles from './DashboardView.module.css';
import DateCard from './components/cards/elements/DateCard';
import HourCard from './components/cards/elements/HourCard';
import AgendaCard from './components/cards/elements/AgendaCard';
import MiniCalendar from './components/cards/elements/MiniCalendar';
import StopwatchCard from './components/cards/elements/StopwatchCard';
import ListTasksCard from './components/cards/tasks/listtask/ListTasksCard';
import AddTaskCard from './components/cards/tasks/addtask/AddTaskCard';
import TaskGeneralInfoCard from './components/cards/tasks/listtask/TaskGeneralInfoCard';
import { useTasks } from './hooks/useTasks';

const DashboardView = () => {
    const [isCalendarVisible, setIsCalendarVisible] = useState(false);
    const [isDayFocused, setIsDayFocused] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const { tasks, isLoading, error, refetchTasks } = useTasks();
    const [selectedTaskDetail, setSelectedTaskDetail] = useState(null);
    const [activeTimerTask, setActiveTimerTask] = useState(null);


    const toggleCalendar = () => {
        setIsCalendarVisible(!isCalendarVisible);
    };

    const formatDate = (date) => {
        if (!date) return '';
        // If it's already a YYYY-MM-DD string, return as is to avoid TZ shift
        if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
            return date;
        }
        
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleDaySelect = (date) => {
        const formatted = formatDate(date);
        setSelectedDate(formatted);
        setIsDayFocused(true);
    };

    const handleDateUpdate = useCallback((newDate) => {
        const formatted = formatDate(newDate);
        setSelectedDate(prev => {
            if (formatted !== prev) return formatted;
            return prev;
        });
    }, []);

    const handleTaskCreated = () => {
        refetchTasks();
        // Optional: Reset focus if you want to go back to list
        // setIsDayFocused(false);
    };

    const handleStartTask = (task) => {
        setActiveTimerTask(task);
    };

    const handleStopTimer = () => {
        setActiveTimerTask(null);
    };

    return (
        <div className={styles.dashboardContainer}>

            <div className={styles.scrollContent}>
                <DateCard isHidden={isDayFocused} isTaskFocused={!!selectedTaskDetail} />
                <HourCard isHidden={isDayFocused} isTaskFocused={!!selectedTaskDetail} />
                
                <MiniCalendar 
                    isVisible={isCalendarVisible} 
                    isFocused={isDayFocused}
                    onDaySelect={handleDaySelect}
                    selectedDate={selectedDate}
                />
                
                <AgendaCard 
                    isCalendarVisible={isCalendarVisible} 
                    isFocused={isDayFocused}
                    isTaskFocused={!!selectedTaskDetail}
                    onToggleCalendar={toggleCalendar}
                    selectedDate={selectedDate}
                    onDateChange={handleDateUpdate}
                    onTaskClick={(task) => {
                        setSelectedTaskDetail(task);
                        setIsCalendarVisible(false);
                        setActiveTimerTask(null);
                    }}
                />
                
                <ListTasksCard 
                    tasks={tasks}
                    isLoading={isLoading}
                    error={error}
                    isFocused={isDayFocused}
                    isTaskFocused={!!selectedTaskDetail}
                    onTaskClick={(task) => {
                        setSelectedTaskDetail(task);
                        setIsCalendarVisible(false);
                        setActiveTimerTask(null);
                    }}
                />

                <TaskGeneralInfoCard 
                    task={selectedTaskDetail} 
                    isFocused={!!selectedTaskDetail}
                    isShrunk={isDayFocused}
                    isTimerActive={!!activeTimerTask}
                    onClose={() => {
                        setSelectedTaskDetail(null);
                        setActiveTimerTask(null);
                    }} 
                    onStartTask={handleStartTask}
                />

                <StopwatchCard 
                    task={activeTimerTask}
                    isVisible={!!activeTimerTask}
                    onClose={handleStopTimer}
                />

                <AddTaskCard 
                    isFocused={isDayFocused}
                    initialDate={selectedDate}
                    onTaskCreated={handleTaskCreated}
                    onCancel={() => {
                        setIsDayFocused(false);
                        setSelectedDate(new Date().toISOString().split('T')[0]);
                    }}
                    onDateUpdate={handleDateUpdate}
                />
            </div>
        </div>
    );
};

export default DashboardView;
