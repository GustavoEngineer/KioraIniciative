import React from 'react';
import DashboardBackground from '../../components/background/DashboardBackground';
import WelcomeCard from './WelcomeCard';
import styles from './Cover.module.css';

const Cover = () => {
    return (
        <DashboardBackground>
            <div className={styles.coverContent}>
                <WelcomeCard />
            </div>
        </DashboardBackground>
    );
};

export default Cover;
