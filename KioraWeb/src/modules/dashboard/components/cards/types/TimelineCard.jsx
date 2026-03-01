import React from 'react';
import Card from '../../../../../common/components/cards/Card';
import { Typography } from '../../../../../common/components/typography';
import styles from './TimelineCard.module.css';

const TimelineCard = () => {
    return (
        <Card title="Timeline" className={styles.timelineCard}>
            <div className={styles.content}>
                <Typography variant="body" className={styles.placeholder}>
                    Próximamente
                </Typography>
            </div>
        </Card>
    );
};

export default TimelineCard;
