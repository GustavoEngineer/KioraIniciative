import React, { useState, useEffect } from 'react';
import styles from './HourCard.module.css';

const HourCard = ({ isHidden }) => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const timeString = currentTime.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });

    return (
        <div className={`${styles.container} ${isHidden ? styles.hidden : ''}`}>
            <div className={styles.timeSection}>
                <span className={styles.time}>{timeString}</span>
            </div>
        </div>
    );
};

export default HourCard;
