import React, { useState, useMemo } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Typography } from '../../../../../common/components/typography/typography';
import styles from './MiniCalendar.module.css';

const MiniCalendar = ({ isVisible, isFocused, onDaySelect, selectedDate }) => {
    const today = useMemo(() => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        return d;
    }, []);

    const targetDate = useMemo(() => {
        if (!selectedDate) return null;
        const d = new Date(selectedDate);
        // Correct for potential timezone shift if it's a string YYYY-MM-DD
        if (typeof selectedDate === 'string' && selectedDate.includes('-')) {
            const [y, m, d_part] = selectedDate.split('-').map(Number);
            return new Date(y, m - 1, d_part);
        }
        d.setHours(0, 0, 0, 0);
        return d;
    }, [selectedDate]);

    const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

    const monthName = viewDate.toLocaleString('en-US', { month: 'long' });
    const year = viewDate.getFullYear();

    const days = useMemo(() => {
        const firstDayOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
        const lastDayOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0);
        
        const daysArray = [];
        
        // Start on Monday (0: Sun, 1: Mon)
        let startDay = firstDayOfMonth.getDay();
        const daysFromPrevMonth = startDay === 0 ? 6 : startDay - 1;

        const prevMonthLastDay = new Date(viewDate.getFullYear(), viewDate.getMonth(), 0);
        for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
            const d = new Date(prevMonthLastDay);
            d.setDate(prevMonthLastDay.getDate() - i);
            d.setHours(0, 0, 0, 0);
            daysArray.push({ date: d, isCurrentMonth: false });
        }

        for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
            const d = new Date(viewDate.getFullYear(), viewDate.getMonth(), i);
            d.setHours(0, 0, 0, 0);
            daysArray.push({ date: d, isCurrentMonth: true });
        }

        const remainingCells = 42 - daysArray.length;
        for (let i = 1; i <= remainingCells; i++) {
            const d = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, i);
            d.setHours(0, 0, 0, 0);
            daysArray.push({ date: d, isCurrentMonth: false });
        }

        return daysArray;
    }, [viewDate]);

    const changeMonth = (offset) => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1));
    };

    const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

    return (
        <div className={`
            ${styles.container} 
            ${isVisible ? styles.visible : styles.hidden}
            ${isFocused ? styles.focused : ''}
        `}>
            <div className={styles.header}>
                <div className={styles.monthGroup}>
                    <Typography variant="dashboard-title" className={styles.monthTitle}>
                        {monthName}
                    </Typography>
                    <Typography variant="dashboard-body" className={styles.yearText}>
                        {year}
                    </Typography>
                </div>
                
                <div className={styles.navGroup}>
                    <button onClick={() => changeMonth(-1)} className={styles.navBtn}>
                        <FiChevronLeft />
                    </button>
                    <button onClick={() => changeMonth(1)} className={styles.navBtn}>
                        <FiChevronRight />
                    </button>
                </div>
            </div>

            <div className={styles.calendarBody}>
                <div className={styles.dayLabelsGrid}>
                    {dayLabels.map((label, idx) => (
                        <span key={idx} className={styles.dayLabel}>{label}</span>
                    ))}
                </div>
                <div className={styles.daysGrid}>
                    {days.map((dayObj, i) => {
                        const time = dayObj.date.getTime();
                        const todayTime = today.getTime();
                        const targetTime = targetDate ? targetDate.getTime() : null;
                        
                        const isToday = time === todayTime;
                        const isTarget = isFocused && targetTime && time === targetTime;
                        const isInRange = isFocused && targetTime && 
                                        ((time > todayTime && time < targetTime) || 
                                         (time < todayTime && time > targetTime));
                        
                        return (
                            <div 
                                key={i} 
                                className={`
                                    ${styles.dayCell} 
                                    ${!dayObj.isCurrentMonth ? styles.otherMonth : ''}
                                    ${isToday ? styles.today : ''}
                                    ${isTarget && !isToday ? styles.targetDate : ''}
                                    ${isInRange ? styles.inRange : ''}
                                `}
                                onClick={() => onDaySelect && onDaySelect(dayObj.date)}
                            >
                                <span className={styles.dayNumber}>{dayObj.date.getDate()}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default MiniCalendar;
