import React, { useState, useMemo, useEffect } from 'react';
import styles from './AgendaCard.module.css';
import { FiSun, FiCalendar, FiSquare, FiCheckSquare } from 'react-icons/fi';
import { Typography } from '../../../../../common/components/typography/typography';
import { taskService } from '../../../../dashboard/services/taskService';
import '../../transitions/dashboard_AddTask.css';
import '../../transitions/Dashboard_taskinfo.css';

const AgendaCard = ({ isCalendarVisible, isFocused, isTaskFocused, onToggleCalendar, selectedDate, onDateChange, onTaskClick }) => {
    // Helper to parse date string or object
    const getSafeDate = (date) => {
        if (!date) return new Date();
        const d = new Date(date);
        // Correct for timezone if it's a string YYYY-MM-DD
        if (typeof date === 'string' && date.includes('-')) {
            const [y, m, dayPart] = date.split('-').map(Number);
            return new Date(y, m - 1, dayPart);
        }
        return d;
    };

    const currentSelectedDate = useMemo(() => getSafeDate(selectedDate), [selectedDate]);
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Calculate week days (Monday to Sunday) based on currentSelectedDate
    const weekDays = useMemo(() => {
        const current = new Date(currentSelectedDate);
        const day = current.getDay();
        const diff = current.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
        const monday = new Date(current.setDate(diff));
        
        return Array.from({ length: 7 }, (_, i) => {
            const date = new Date(monday);
            date.setDate(monday.getDate() + i);
            return {
                num: date.getDate(),
                label: date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
                dateObj: date,
                id: date.getTime()
            };
        });
    }, [currentSelectedDate]);

    // Helper to check if two dates are the same day
    const isSameDay = (d1, d2) => {
        return d1.getDate() === d2.getDate() &&
               d1.getMonth() === d2.getMonth() &&
               d1.getFullYear() === d2.getFullYear();
    };

    // Fetch tasks when selectedDate changes
    useEffect(() => {
        const fetchTasks = async () => {
            setIsLoading(true);
            const dateStr = typeof selectedDate === 'string' ? selectedDate : 
                `${currentSelectedDate.getFullYear()}-${String(currentSelectedDate.getMonth() + 1).padStart(2, '0')}-${String(currentSelectedDate.getDate()).padStart(2, '0')}`;

            const { data, error } = await taskService.getTasksByDate(dateStr);
            if (data && !error) {
                setTasks(data);
            } else {
                setTasks([]);
            }
            setIsLoading(false);
        };

        fetchTasks();
    }, [selectedDate, currentSelectedDate]);

    const formattedMonth = currentSelectedDate.toLocaleDateString('en-US', { month: 'long' });
    const formattedYear = currentSelectedDate.getFullYear();

    const getTaskIcon = (task) => {
        if (task.status === 'Completada') return <FiCheckSquare className={styles.taskIconSuccess} />;
        return <FiSquare />;
    };

    const handleDayClick = (date) => {
        if (onDateChange) {
            onDateChange(date);
        }
    };

    return (
        <div className={`
            ${styles.container} agenda-mini-container-transition
            ${isCalendarVisible ? styles.splitMode : ''} 
            ${isFocused ? 'agenda-mini-focused-transition' : ''}
            ${isTaskFocused ? 'agenda-taskfocused-transition' : ''}
        `}>
            <header className={styles.header}>
                <div className={styles.headerTitleGroup}>
                    <Typography variant="dashboard-title" className={styles.monthTitle}>
                        {formattedMonth}
                    </Typography>
                    <Typography variant="dashboard-body" className={styles.yearSubtitle}>
                        {formattedYear}
                    </Typography>
                </div>
                <div className={styles.headerIcon} onClick={onToggleCalendar}>
                    <FiCalendar className={`${styles.calendarToggleIcon} ${isCalendarVisible ? styles.activeIcon : ''}`} />
                </div>
            </header>

            <div className={styles.weeklyStrip}>
                {weekDays.map((day) => (
                    <div 
                        key={day.id} 
                        className={`${styles.dayItem} ${isSameDay(currentSelectedDate, day.dateObj) ? styles.activeDay : ''}`}
                        onClick={() => handleDayClick(day.dateObj)}
                    >
                        <Typography variant="dashboard-title" className={styles.dayNum}>
                            {day.num}
                        </Typography>
                        <Typography variant="dashboard-body" className={styles.dayLabel}>
                            {day.label}
                        </Typography>
                    </div>
                ))}
            </div>

            <div className={styles.taskList}>
                {isLoading ? (
                    <div className={styles.loadingState}>
                        <Typography variant="dashboard-body">Cargando tareas...</Typography>
                    </div>
                ) : tasks.length > 0 ? (
                    tasks.map((task) => (
                        <div 
                            key={task.id} 
                            className={`${styles.taskItem} ${task.status === 'Completada' ? styles.past : ''}`}
                            onClick={() => onTaskClick && onTaskClick(task)}
                        >
                            <div className={styles.taskContent}>
                                <span className={styles.taskIconWrapper}>
                                    {getTaskIcon(task)}
                                </span>
                                <Typography variant="dashboard-body" className={styles.taskTitle}>
                                    {task.title}
                                </Typography>
                            </div>
                            {task.estimated_time && (
                                <Typography variant="dashboard-body" className={styles.taskTime}>
                                    {task.estimated_time}
                                </Typography>
                            )}
                        </div>
                    ))
                ) : (
                    <div className={styles.emptyState}>
                        <Typography variant="dashboard-body" className={styles.emptyText}>
                            No hay tareas pendientes
                        </Typography>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AgendaCard;
