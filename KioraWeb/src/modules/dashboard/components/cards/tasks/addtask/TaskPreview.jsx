import React from 'react';
import TaskCard from '../../../../../../common/components/cards/TaskCard';
import styles from './TaskPreview.module.css';
import { Typography } from '../../../../../../common/components/typography/typography';

const TaskPreview = ({ taskData, isVisible }) => {
    if (!isVisible) return null;

    const previewTask = {
        title: taskData.title || 'Título de la tarea',
        description: taskData.description || 'Descripción de la tarea...',
        due_date: taskData.due_date,
        priority: 5,
        tag_id: taskData.tag_id,
        tags: taskData.tag_name ? [{ name: taskData.tag_name }] : []
    };

    return (
        <div className={styles.container}>
            <div className={styles.topSection}>
                <Typography variant="dashboard-body" className={styles.previewLabel}>
                    VISTA PREVIA
                </Typography>
                <div className={styles.cardWrapper}>
                    <TaskCard task={previewTask} variant="default" />
                </div>
            </div>
        </div>
    );
};

export default TaskPreview;
