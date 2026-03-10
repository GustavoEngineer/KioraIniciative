import React, { useState, useEffect } from 'react';
import DashboardCard from '../../../../../common/components/cards/DashboardCard';
import styles from './TimeCard.module.css';
import { Icon } from '@iconify/react';

const TimeCard = ({ task }) => {
    const [isActive, setIsActive] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0); // in seconds

    // Initialize timeLeft when task or estimated_time changes
    useEffect(() => {
        if (task?.estimated_time) {
            setTimeLeft(Math.round(task.estimated_time * 3600));
        } else {
            setTimeLeft(3600); // 1 hour default
        }
        setIsActive(false);
    }, [task?.id, task?.estimated_time]);

    // Timer interval
    useEffect(() => {
        let interval = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => Math.max(0, prev - 1));
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            if (interval) clearInterval(interval);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive, timeLeft]);

    const formatTime = (totalSeconds) => {
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    const handleToggle = () => {
        if (timeLeft > 0) {
            setIsActive(!isActive);
        }
    };

    const handleReset = () => {
        if (task?.estimated_time) {
            setTimeLeft(Math.round(task.estimated_time * 3600));
        } else {
            setTimeLeft(3600); // 1 hour default
        }
        setIsActive(false);
    };

    const targetMinutes = Math.round((task?.estimated_time || 1) * 60);

    return (
        <DashboardCard title="Cronómetro" className={styles.container}>
            <div className={styles.content}>
                {/* Time Display Section */}
                <div className={styles.displaySection}>
                    <div className={styles.timeBox}>
                        <span className={styles.largeTime}>
                            {timeLeft > 3600 ? formatTime(timeLeft) : formatTime(timeLeft).split(':').slice(1).join(':')}
                        </span>
                    </div>
                    <span className={styles.targetLabel}>{targetMinutes} min</span>
                </div>

                {/* Controls Section */}
                <div className={styles.controlsRow}>
                    <button
                        className={`${styles.circleBtn} ${isActive ? styles.activeBtn : ''} ${styles.mainBtn}`}
                        onClick={handleToggle}
                        title={isActive ? 'Pausar' : 'Reanudar'}
                    >
                        <Icon icon={isActive ? "solar:pause-bold" : "solar:play-bold"} width={24} />
                    </button>

                    <button className={styles.circleBtn} onClick={handleReset} title="Detener">
                        <Icon icon="solar:stop-bold" width={24} />
                    </button>
                </div>
            </div>
        </DashboardCard>
    );
};

export default TimeCard;
