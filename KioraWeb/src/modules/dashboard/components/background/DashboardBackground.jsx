import React from 'react';
import styles from './DashboardBackground.module.css';

const DashboardBackground = ({ children }) => {
    return (
        <div className={styles.dashboardContainer}>
            <div className={styles.overlay}></div>

            {/* Decorative Lines */}


            <div className={styles.scrollContent}>
                {children}
            </div>
        </div>
    );
};

export default DashboardBackground;
