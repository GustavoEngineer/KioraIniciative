import React from 'react';
import { Typography } from '../../../../common/components/typography';
import styles from './dateminicard.module.css';

const DateMiniCard = ({ className = "" }) => {
    // Partes de la fecha actual
    const today = new Date();
    const month = today.toLocaleDateString('es-ES', { month: 'short' }).toUpperCase().replace('.', '');
    const dayNumber = today.getDate();
    const dayName = today.toLocaleDateString('es-ES', { weekday: 'short' }).replace('.', '');

    return (
        <div className={`${styles.calendarWidget} ${className}`}>
            <div className={styles.monthHeader}>
                <Typography variant="caption" className={styles.monthText}>
                    {month}
                </Typography>
            </div>
            <div className={styles.dayBody}>
                <Typography variant="h2" className={styles.dayNumber}>
                    {dayNumber}
                </Typography>
                <Typography variant="body" className={styles.dayName}>
                    {dayName}
                </Typography>
            </div>
        </div>
    );
};

export default DateMiniCard;
