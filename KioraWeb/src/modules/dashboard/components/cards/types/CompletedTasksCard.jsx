import React from 'react';
import Card from '../../../../../common/components/cards/Card';
import { Typography } from '../../../../../common/components/typography';
import styles from './CompletedTasksCard.module.css';

const CompletedTasksCard = () => {
    return (
        <Card title="Tareas completadas" className={styles.completedTasksCard}>
            {/* Contenido iría aquí */}
        </Card>
    );
};

export default CompletedTasksCard;
