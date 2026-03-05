import React, { useState, useEffect } from 'react';
import { Typography } from '../../../common/components/typography/typography';
import styles from './DateCard.module.css';

const DateCard = () => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const getDayNumber = (date) => {
        return date.getDate();
    };

    const getMonthAndYear = (date) => {
        return new Intl.DateTimeFormat('es-ES', {
            month: 'long',
            year: 'numeric'
        }).format(date);
    };

    const getWeekday = (date) => {
        return new Intl.DateTimeFormat('es-ES', {
            weekday: 'long'
        }).format(date);
    };

    const formatTime = (date) => {
        return new Intl.DateTimeFormat('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        }).format(date);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Typography variant="dashboard-title">Hoy</Typography>
            </div>
            <div className={styles.content}>
                <div className={styles.daySection}>
                    <span className={styles.dayNumber}>{getDayNumber(currentTime)}</span>
                    <div className={styles.dateText}>
                        <span className={styles.weekday}>{getWeekday(currentTime)}</span>
                        <span className={styles.monthYear}>{getMonthAndYear(currentTime)}</span>
                    </div>
                </div>
                <div className={styles.timeSection}>
                    <span className={styles.timeLabel}>HH:MM:SS</span>
                    <span className={styles.timeValue}>{formatTime(currentTime)}</span>
                </div>
            </div>
        </div>
    );
};

export default DateCard;
