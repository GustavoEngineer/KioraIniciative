import React, { useState, useEffect } from 'react';
import styles from './HourCard.module.css';
import '../../transitions/dashboard_AddTask.css';

const HourCard = ({ isHidden, isTaskFocused }) => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const hours = currentTime.getHours().toString().padStart(2, '0');
    const minutes = currentTime.getMinutes().toString().padStart(2, '0');

    return (
        <div className={`${styles.container} datehour-container-transition ${isHidden ? 'datehour-hidden-transition' : ''} ${isTaskFocused ? 'datehour-taskfocused-transition' : ''}`}>
            <div className={styles.timeSection}>
                <span className={styles.hours}>{hours}</span>
                <span className={styles.minutes}>{minutes}</span>
            </div>
        </div>
    );
};

export default HourCard;
