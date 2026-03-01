import React from 'react';
import Card from '../../../../../common/components/cards/Card';
import { Typography } from '../../../../../common/components/typography';
import styles from './SharedTasksCard.module.css';

const SharedTasksCard = () => {
    return (
        <Card title="Tareas compartidas" className={styles.sharedTasksCard}>
            <div className={styles.content}>
                <Typography variant="body" className={styles.placeholder}>
                    Próximamente
                </Typography>
            </div>
        </Card>
    );
};

export default SharedTasksCard;
