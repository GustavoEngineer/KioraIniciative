import React, { useState } from 'react';
import styles from './CardsContainer.module.css';
import WelcomeCard from '../../../submodules/cover/WelcomeCard';
import FocusHoursCard from '../types/FocusHoursCard';
import CompletedTasksCard from '../types/CompletedTasksCard';
import TasksCard from '../types/TasksCard';

const CardsContainer = () => {
    const [showDashboard, setShowDashboard] = useState(false);

    const handleWelcomeComplete = () => {
        setShowDashboard(true);
    };

    return (
        <div className={`${styles.container} ${showDashboard ? styles.dashboardActive : ''}`}>
            {/* El WelcomeCard siempre está presente */}
            <WelcomeCard onAnimationComplete={handleWelcomeComplete} />

            {/* El resto de las tarjetas SOLO se renderizan tras la animación */}
            {showDashboard && (
                <div className={`${styles.cardsGrid} ${styles.visible}`}>
                    <FocusHoursCard />
                    <CompletedTasksCard />
                    <TasksCard />
                </div>
            )}
        </div>
    );
};

export default CardsContainer;
export {
    FocusHoursCard,
    CompletedTasksCard,
    TasksCard
};
