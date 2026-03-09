import React from 'react';
import DashboardCard from '../../../../common/components/cards/DashboardCard';
import styles from './DateCard.module.css';

const DateCard = () => {
    const today = new Date();

    const getDayNumber = (date) => {
        const day = date.getDate();
        return day < 10 ? `0${day}` : day;
    };

    const getWeekday = (date) => {
        return new Intl.DateTimeFormat('es-ES', {
            weekday: 'long'
        }).format(date);
    };

    const getMonth = (date) => {
        return new Intl.DateTimeFormat('es-ES', {
            month: 'long'
        }).format(date);
    };

    return (
        <DashboardCard title="Hoy">
            <div className={styles.content}>
                <span className={styles.month}>{getMonth(today)}</span>
                <span className={styles.dayNumber}>{getDayNumber(today)}</span>
                <span className={styles.weekday}>{getWeekday(today)}</span>
            </div>
        </DashboardCard>
    );
};

export default DateCard;
