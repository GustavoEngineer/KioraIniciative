import React from 'react';
import { Typography } from '../../../common/components/typography/typography';
import styles from './FocusCard.module.css';

const FocusCard = () => {
    // Valor estático por ahora
    const focusHours = 4;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Typography variant="dashboard-title">Enfoque</Typography>
            </div>
            <div className={styles.content}>
                <div className={styles.focusContainer}>
                    <span className={styles.number}>{focusHours}</span>
                    <span className={styles.unit}>hrs</span>
                </div>
            </div>
        </div>
    );
};

export default FocusCard;
