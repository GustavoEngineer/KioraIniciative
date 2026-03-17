import React from 'react';
import styles from './DateCard.module.css';

const DateCard = ({ isHidden }) => {
    const today = new Date();
    const day = today.getDate();
    const month = today.toLocaleDateString('es-ES', { month: 'short' }).toUpperCase();

    return (
        <div className={`${styles.container} ${isHidden ? styles.hidden : ''}`}>
            <div className={styles.dateSection}>
                <span className={styles.day}>{day}</span>
                <span className={styles.month}>{month}</span>
            </div>
        </div>
    );
};

export default DateCard;
