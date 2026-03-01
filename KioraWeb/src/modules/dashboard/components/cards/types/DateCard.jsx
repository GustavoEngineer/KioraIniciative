import React, { useState, useEffect } from 'react';
import Card from '../../../../../common/components/cards/Card';
import { Typography } from '../../../../../common/components/typography';
import styles from './DateCard.module.css';

const DateCard = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const dayName = time.toLocaleDateString('es-ES', { weekday: 'long' });
    const dayNumber = time.getDate();
    const monthName = time.toLocaleDateString('es-ES', { month: 'long' });
    const formattedTime = time.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });

    return (
        <Card title="Fecha y Hora" className={styles.dateCard}>
            <div className={styles.content}>
                <div className={styles.dateSection}>
                    <Typography variant="body" className={styles.dayName}>
                        {dayName}
                    </Typography>
                    <Typography variant="h1" className={styles.dayNumber}>
                        {dayNumber}
                    </Typography>
                    <Typography variant="body" className={styles.monthName}>
                        {monthName}
                    </Typography>
                </div>

                <div className={styles.divider}></div>

                <div className={styles.timeSection}>
                    <Typography variant="h2" className={styles.time}>
                        {formattedTime}
                    </Typography>
                </div>
            </div>
        </Card>
    );
};

export default DateCard;
