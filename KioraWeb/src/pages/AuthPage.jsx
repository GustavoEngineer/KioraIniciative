import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../modules/home/components/Layout';
import AuthView from '../modules/home/submodules/auth/authview';

const AuthPage = () => {
    const navigate = useNavigate();
    const [isExiting, setIsExiting] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);

    const handleBack = () => {
        setIsExiting(true);
        setTimeout(() => {
            navigate('/');
        }, 600); // Duración de la animación de las líneas verticales
    };

    const handleAction = () => {
        setIsRegistering(prev => !prev);
    };

    return (
        <MainLayout>
            <AuthView onBack={handleBack} onAction={handleAction} isExiting={isExiting} isRegistering={isRegistering} />
        </MainLayout>
    );
};

export default AuthPage;
