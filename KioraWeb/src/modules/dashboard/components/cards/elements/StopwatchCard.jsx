import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { Typography } from '../../../../../common/components/typography/typography';
import styles from './StopwatchCard.module.css';
import borderStyles from '../cardBorders.module.css';

const StopwatchCard = ({ task, isVisible, onClose }) => {
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        if (task && task.estimated_time) {
            setSeconds(Math.floor(task.estimated_time * 3600));
        }
    }, [task]);

    useEffect(() => {
        let interval = null;
        if (isActive && seconds > 0) {
            interval = setInterval(() => {
                setSeconds((prev) => prev - 1);
            }, 1000);
        } else if (seconds === 0) {
            setIsActive(false);
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isActive, seconds]);

    const formatTime = (totalSeconds) => {
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    const toggleTimer = () => setIsActive(!isActive);
    const resetTimer = () => {
        setIsActive(false);
        if (task && task.estimated_time) {
            setSeconds(Math.floor(task.estimated_time * 3600));
        }
    };

    if (!isVisible) return null;

    return (
        <div className={`${styles.container} ${borderStyles.sideBorders} ${isVisible ? styles.visible : ''}`}>
            <header className={styles.header}>
                <Typography variant="dashboard-title" className={styles.title}>
                    Task Progress
                </Typography>
                <button className={styles.closeButton} onClick={onClose}>
                    <Icon icon="solar:close-circle-bold" />
                </button>
            </header>

            <div className={styles.timerDisplay}>
                <Typography className={styles.timeText}>
                    {formatTime(seconds)}
                </Typography>
                <Typography className={styles.taskLabel}>
                    {task?.title || 'No task selected'}
                </Typography>
            </div>

            <div className={styles.controls}>
                <button className={styles.resetButton} onClick={resetTimer}>
                    <Icon icon="solar:restart-bold-duotone" />
                </button>
                <button 
                    className={`${styles.playButton} ${isActive ? styles.active : ''}`} 
                    onClick={toggleTimer}
                >
                    <Icon icon={isActive ? "solar:pause-bold" : "solar:play-bold"} />
                </button>
            </div>
            
            <div className={styles.footer}>
                 <Typography variant="dashboard-body" className={styles.status}>
                    {isActive ? 'Cronómetro en marcha' : 'Pausado'}
                </Typography>
            </div>
        </div>
    );
};

export default StopwatchCard;
