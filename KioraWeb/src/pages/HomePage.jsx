import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../modules/home/components/Layout';
import Home from '../modules/home/home';

const HomePage = () => {
    const navigate = useNavigate();

    const handleStart = () => {
        navigate('/auth');
    };

    return (
        <MainLayout>
            <Home onStart={handleStart} />
        </MainLayout>
    );
};

export default HomePage;
