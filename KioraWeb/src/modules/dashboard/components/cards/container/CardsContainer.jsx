import React from 'react';
import styles from './CardsContainer.module.css';
import FocusHoursCard from '../types/FocusHoursCard';
import CompletedTasksCard from '../types/CompletedTasksCard';
import DateCard from '../types/DateCard';
import SharedTasksCard from '../types/SharedTasksCard';
import TasksCard from '../types/TasksCard';
import TimelineCard from '../types/TimelineCard';
import ProfileInfoCard from '../types/ProfileInfoCard';

const CardsContainer = ({ children }) => {
    return (
        <div className={styles.container}>
            {children || (
                <>
                    <ProfileInfoCard />
                    <FocusHoursCard />
                    <CompletedTasksCard />
                    <DateCard />
                    <SharedTasksCard />
                    <TasksCard />
                    <TimelineCard />
                </>
            )}
        </div>
    );
};

export default CardsContainer;
export {
    FocusHoursCard,
    CompletedTasksCard,
    DateCard,
    SharedTasksCard,
    TasksCard,
    TimelineCard,
    ProfileInfoCard
};
