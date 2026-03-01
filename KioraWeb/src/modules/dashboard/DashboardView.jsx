import React from 'react';
import DashboardBackground from './components/background/DashboardBackground';
import CardsContainer from './components/cards/container/CardsContainer';
import styles from './DashboardView.module.css';

const DashboardView = () => {
    return (
        <DashboardBackground>
            <CardsContainer />
        </DashboardBackground>
    );
};

export default DashboardView;
