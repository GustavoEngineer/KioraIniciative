import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Cover from './submodules/cover/Cover';
import CardsContainer from './components/cards/container/CardsContainer';
import DashboardBackground from './components/background/DashboardBackground';
import styles from './DashboardView.module.css';

const DashboardView = () => {
    return (
        <DashboardBackground>
            <CardsContainer />
        </DashboardBackground>
    );
};

export default DashboardView;
