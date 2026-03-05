import React from 'react';
import { useTasks } from '../hooks/useTasks';
import { Typography } from '../../../common/components/typography/typography';
import styles from './CompletedTasksCard.module.css';

const CompletedTasksCard = () => {
    const { tasks, isLoading } = useTasks();
    const completedCount = tasks.filter(task => task.is_completed).length;
    const totalCount = tasks.length;
    const percentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

    // SVG Circle constants
    const radius = 60;
    const strokeWidth = 8;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Typography variant="dashboard-title">Progreso</Typography>
            </div>
            <div className={styles.content}>
                <div className={styles.circularContainer}>
                    <svg width="150" height="150" viewBox="0 0 150 150" className={styles.svg}>
                        {/* Background Circle */}
                        <circle
                            cx="75"
                            cy="75"
                            r={radius}
                            className={styles.bgCircle}
                            strokeWidth={strokeWidth}
                        />
                        {/* Progress Circle */}
                        <circle
                            cx="75"
                            cy="75"
                            r={radius}
                            className={styles.progressCircle}
                            strokeWidth={strokeWidth}
                            strokeDasharray={circumference}
                            strokeDashoffset={offset}
                            strokeLinecap="square"
                        />
                    </svg>
                    <div className={styles.centerText}>
                        <span className={styles.current}>{completedCount}</span>
                        <span className={styles.separator}>/</span>
                        <span className={styles.total}>{totalCount}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompletedTasksCard;
