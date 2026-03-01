import React from 'react';
import Card from '../../../../../common/components/cards/Card';
import { Typography } from '../../../../../common/components/typography';
import styles from './FocusHoursCard.module.css';

const FocusHoursCard = () => {
    return (
        <Card title="Enfoque de hoy">
            <div className={styles.content}>
                <div className={styles.valueContainer}>
                    <Typography variant="h2" className={styles.value}>
                        4
                    </Typography>
                    <Typography variant="body" className={styles.unit}>
                        horas
                    </Typography>
                </div>
            </div>
        </Card>
    );
};

export default FocusHoursCard;
