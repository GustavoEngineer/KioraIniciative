import React from 'react';
import styles from './DateCard.module.css';
import '../../transitions/dashboard_AddTask.css';

const DateCard = ({ isHidden, isTaskFocused }) => {
    const today = new Date();
    const day = today.getDate();
    const month = today.toLocaleDateString('es-ES', { month: 'short' }).toUpperCase();

    return (
        <div className={`${styles.container} datehour-container-transition ${isHidden ? 'datehour-hidden-transition' : ''} ${isTaskFocused ? 'datehour-taskfocused-transition' : ''}`}>
            <div className={styles.dateSection}>
                <span className={styles.day}>{day}</span>
                <span className={styles.month}>{month}</span>
            </div>
        </div>
    );
};

export default DateCard;
