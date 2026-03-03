import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Cover from './submodules/cover/Cover';
import CardsContainer from './components/cards/container/CardsContainer';
import DashboardBackground from './components/background/DashboardBackground';
import styles from './DashboardView.module.css';

const DashboardView = () => {
    return (
        <Routes>
            <Route path="cover" element={<Cover />} />
            <Route path="cards" element={
                <DashboardBackground>
                    <CardsContainer />
                </DashboardBackground>
            } />
            {/* Redirigir por defecto a cover si entramos a /dashboard */}
            <Route path="/" element={<Navigate to="cover" replace />} />
        </Routes>
    );
};

export default DashboardView;
