import React from 'react';
import { useTasks } from '../../hooks/useTasks';
import DashboardCard from '../../../../common/components/cards/DashboardCard';
import styles from './CompletedTasksCard.module.css';
import { Icon } from '@iconify/react';

const CompletedTasksCard = () => {
    const { tasks, isLoading } = useTasks();

    // Total tasks vs completed
    const completedTasks = tasks.filter(task => task.is_completed);
    const completedCount = completedTasks.length;
    const totalCount = tasks.length;
    const percentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

    // Breakdown by Priority
    const priorityStats = completedTasks.reduce((acc, task) => {
        const level = task.priority || 5;
        if (level >= 8) acc['Crítica']++;
        else if (level >= 5) acc['Media']++;
        else acc['Baja']++;
        return acc;
    }, { 'Baja': 0, 'Media': 0, 'Crítica': 0 });

    const displayStats = [
        { name: 'Baja', count: priorityStats['Baja'], icon: "solar:arrow-down-bold-duotone", color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
        { name: 'Media', count: priorityStats['Media'], icon: "solar:minus-circle-bold-duotone", color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
        { name: 'Crítica', count: priorityStats['Crítica'], icon: "solar:fire-bold-duotone", color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' }
    ];

    // SVG Gauge constants (Standing Semi-circle Arch)
    const radius = 70;
    const strokeWidth = 14;
    const circumference = Math.PI * radius; // Half circle
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <DashboardCard title="Resumen de Tareas">
            <div className={styles.content}>
                <div className={styles.circularContainer}>
                    <svg width="200" height="120" viewBox="0 0 200 120" className={styles.svg}>
                        {/* Standing Arch: from left to right as a rainbow */}
                        <path
                            d="M 30,115 A 70,70 0 0,1 170,115"
                            className={styles.bgCircle}
                            strokeWidth={strokeWidth}
                            strokeLinecap="round"
                            fill="none"
                        />
                        <path
                            d="M 30,115 A 70,70 0 0,1 170,115"
                            className={styles.progressCircle}
                            strokeWidth={strokeWidth}
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            strokeDashoffset={offset}
                            fill="none"
                        />
                    </svg>
                    <div className={styles.centerText}>
                        <span className={styles.current}>{completedCount}</span>
                    </div>
                </div>

                <div className={styles.breakdown}>
                    {displayStats.map((stat, idx) => (
                        <div key={idx} className={styles.breakdownItem}>
                            <div className={styles.iconCircle} style={{ backgroundColor: stat.bg, color: stat.color }}>
                                <Icon icon={stat.icon} />
                            </div>
                            <span className={styles.categoryName}>{stat.name}</span>
                            <span className={styles.categoryValue}>{stat.count}</span>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardCard>
    );
};

export default CompletedTasksCard;
