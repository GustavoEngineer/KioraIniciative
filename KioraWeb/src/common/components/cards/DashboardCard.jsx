import React, { useState } from 'react';
import styles from './DashboardCard.module.css';

const DashboardCard = ({ children, className = '' }) => {
    return (
        <div className={`${styles.card} ${className}`}>
            {children}
        </div>
    );
};

export default DashboardCard;
