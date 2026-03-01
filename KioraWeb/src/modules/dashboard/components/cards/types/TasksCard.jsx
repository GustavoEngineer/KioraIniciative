import React from 'react';
import Card from '../../../../../common/components/cards/Card';
import styles from './TasksCard.module.css';

const TasksCard = () => {
    return (
        <Card title="Tareas" className={styles.tasksCard}>
            <div className={styles.content}>
                {/* Contenido de tareas iría aquí */}
            </div>
        </Card>
    );
};

export default TasksCard;
