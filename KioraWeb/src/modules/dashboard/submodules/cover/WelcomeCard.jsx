import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { supabase } from '../../../../services/supabase.config';
import { Typography } from '../../../../common/components/typography';
import DateMiniCard from './dateminicard';
import styles from './WelcomeCard.module.css';

const WelcomeCard = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFading, setIsFading] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // 1. Obtener el usuario actual
                const { data: { user }, error: authError } = await supabase.auth.getUser();
                if (authError || !user) throw authError || new Error('No user found');

                // 2. Consultar el perfil del usuario
                const { data: profileData, error: profileError } = await supabase
                    .from('profiles')
                    .select('full_name')
                    .eq('id', user.id)
                    .single();

                if (profileError) throw profileError;
                setProfile(profileData);
            } catch (error) {
                console.error('Error fetching profile:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleExit = () => {
        navigate('/');
    };

    const handleStart = () => {
        setIsFading(true);
    };

    return (
        <div className={`${styles.cardContainer} ${isFading ? styles.cardFaded : ''}`}>
            {/* Esquina superior izquierda: Widget de Calendario extracted */}
            <DateMiniCard className={styles.calendarPosition} />

            {/* Esquina superior derecha: Botón Cerrar/Salir */}
            <button className={styles.exitButton} onClick={handleExit} title="Salir">
                <Icon icon="solar:logout-3-linear" width="32" height="32" />
            </button>

            {/* Contenido central */}
            <div className={styles.contentContainer}>
                <Typography variant="h1" className={styles.mainTitle}>
                    El mundo nunca dejará de ser caos.<br />
                    Pero este rincón siempre será tuyo, <span className={styles.userName}>{loading ? '...' : (profile?.full_name?.split(' ')[0] || 'explorador')}</span>
                </Typography>
            </div>

            {/* Icono de búho en la esquina inferior derecha */}
            <Icon
                icon="material-symbols-light:owl-rounded"
                className={`${styles.owlIcon} ${isFading ? styles.owlCentered : ''}`}
            />

            {/* Botón en la esquina inferior derecha con flechas */}
            <button className={styles.welcomeButton} onClick={handleStart} title="Ver que me espera">
                <Icon icon="solar:double-alt-arrow-down-linear" width="28" height="28" />
            </button>
        </div>
    );
};

export default WelcomeCard;
