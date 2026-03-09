import React, { useState } from 'react';
import styles from './DashboardCard.module.css';

const DashboardCard = ({ children, title = '', className = '' }) => {
    return (
        <div className={`${styles.card} ${className}`}>
            {title && <span className={styles.cardTitle}>{title}</span>}
            {children}
        </div>
    );
};

export default DashboardCard;
