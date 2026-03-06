import React, { useState } from 'react';
import styles from './DateEditor.module.css';
import { Typography } from '../../../../../common/components/typography/typography';
import { Icon } from '@iconify/react';

const DateEditor = ({ isVisible, currentDate, onSelectDate, onClose }) => {
    const [viewDate, setViewDate] = useState(currentDate ? new Date(currentDate) : new Date());

    // Month navigation
    const handlePrevMonth = () => {
        const d = new Date(viewDate);
        d.setMonth(d.getMonth() - 1);
        setViewDate(d);
    };

    const handleNextMonth = () => {
        const d = new Date(viewDate);
        d.setMonth(d.getMonth() + 1);
        setViewDate(d);
    };

    // Calendar logic
    const today = new Date();
    const month = viewDate.getMonth();
    const year = viewDate.getFullYear();
    const monthName = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(viewDate);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; // start on Monday
    const dayNames = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

    const isSameDay = (d1, d2) => {
        if (!d1 || !d2) return false;
        return d1.toDateString() === d2.toDateString();
    };

    return (
        <div className={`${styles.container} ${isVisible ? styles.visible : ''}`}>
            <div className={styles.header}>
                <Typography variant="dashboard-title" className={styles.title}>Fecha</Typography>
                <button className={styles.closeBtn} onClick={onClose}>
                    <Icon icon="solar:close-square-linear" />
                </button>
            </div>

            <div className={styles.monthNav}>
                <button className={styles.navBtn} onClick={handlePrevMonth}>
                    <Icon icon="solar:alt-arrow-left-linear" />
                </button>
                <Typography variant="dashboard-body" className={styles.monthLabel}>
                    {monthName} {year}
                </Typography>
                <button className={styles.navBtn} onClick={handleNextMonth}>
                    <Icon icon="solar:alt-arrow-right-linear" />
                </button>
            </div>

            <div className={styles.calendarGrid}>
                {dayNames.map((day, idx) => (
                    <div key={`${day}-${idx}`} className={styles.dayName}>{day}</div>
                ))}
                {Array.from({ length: adjustedFirstDay }).map((_, i) => (
                    <div key={`empty-${i}`} className={styles.emptyDay} />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                    const dayNum = i + 1;
                    const date = new Date(year, month, dayNum);
                    const isSelected = currentDate && isSameDay(date, new Date(currentDate));
                    const isToday = isSameDay(date, today);

                    return (
                        <div
                            key={dayNum}
                            className={`${styles.day} ${isSelected ? styles.selected : ''} ${isToday ? styles.today : ''}`}
                            onClick={() => {
                                const y = date.getFullYear();
                                const m = String(date.getMonth() + 1).padStart(2, '0');
                                const d = String(date.getDate()).padStart(2, '0');
                                onSelectDate(`${y}-${m}-${d}`);
                            }}
                        >
                            {dayNum}
                        </div>
                    );
                })}
            </div>

            <div className={styles.footer}>
                <button className={styles.clearBtn} onClick={() => onSelectDate(null)}>
                    Borrar fecha
                </button>
            </div>
        </div>
    );
};

export default DateEditor;
