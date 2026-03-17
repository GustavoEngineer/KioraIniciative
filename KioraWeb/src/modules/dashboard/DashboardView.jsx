import React, { useState, useCallback } from 'react';
import styles from './DashboardView.module.css';
import DateCard from './components/cards/elements/DateCard';
import HourCard from './components/cards/elements/HourCard';
import AgendaCard from './components/cards/elements/AgendaCard';
import MiniCalendar from './components/cards/elements/MiniCalendar';
import ListTasksCard from './components/cards/tasks/listtask/ListTasksCard';
import AddTaskCard from './components/cards/tasks/addtask/AddTaskCard';
import TaskPreview from './components/cards/tasks/addtask/TaskPreview';
import { useTasks } from './hooks/useTasks';

const DashboardView = () => {
    const [isCalendarVisible, setIsCalendarVisible] = useState(false);
    const [isDayFocused, setIsDayFocused] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [previewData, setPreviewData] = useState(null);
    const { tasks, isLoading, error, refetchTasks } = useTasks();

    const handleFormChange = useCallback((data) => {
        setPreviewData(data);
    }, []);

    const toggleCalendar = () => {
        setIsCalendarVisible(!isCalendarVisible);
    };

    const formatDate = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleDaySelect = (date) => {
        setSelectedDate(formatDate(date));
        setIsDayFocused(true);
    };

    const handleTaskCreated = () => {
        refetchTasks();
        // Optional: Reset focus if you want to go back to list
        // setIsDayFocused(false);
    };

    return (
        <div className={styles.dashboardContainer}>
            <div className={styles.scrollContent}>
                <DateCard isHidden={isDayFocused} />
                <HourCard isHidden={isDayFocused} />
                
                <MiniCalendar 
                    isVisible={isCalendarVisible} 
                    isFocused={isDayFocused}
                    onDaySelect={handleDaySelect}
                    selectedDate={selectedDate}
                />
                
                <AgendaCard 
                    isCalendarVisible={isCalendarVisible} 
                    isFocused={isDayFocused}
                    onToggleCalendar={toggleCalendar} 
                />
                
                <ListTasksCard 
                    tasks={tasks}
                    isLoading={isLoading}
                    error={error}
                    isFocused={isDayFocused}
                    onTaskClick={(id) => console.log('Task clicked:', id)}
                />

                <AddTaskCard 
                    isFocused={isDayFocused}
                    initialDate={selectedDate}
                    onTaskCreated={handleTaskCreated}
                    onCancel={() => setIsDayFocused(false)}
                    onFormChange={handleFormChange}
                />

                <TaskPreview 
                    taskData={previewData || {}} 
                    isVisible={isDayFocused}
                />
            </div>
        </div>
    );
};

export default DashboardView;
