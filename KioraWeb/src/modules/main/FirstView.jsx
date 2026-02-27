import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography } from '../../common/components/typography';
import styles from './FirstView.module.css';

const FirstView = () => {
    const navigate = useNavigate();
    const [isExiting, setIsExiting] = useState(false);

    const handleStart = () => {
        setIsExiting(true);
        // Espera a que termine la animación css (200ms) antes de saltar de página
        setTimeout(() => {
            navigate('/auth');
        }, 200);
    };

    return (
        <div className={`${styles['hero-container']} ${isExiting ? styles.exiting : ''}`}>
            {/* Hero Section */}
            <div className={styles.heroSection}>
                <Typography variant="h1" className={styles.title}>Kiora</Typography>
                <Typography variant="body" className={styles.tagline}>
                    Organiza tu vida. Un solo lugar.
                </Typography>
                <button
                    className={styles.ctaButton}
                    onClick={handleStart}
                >
                    Empezar
                </button>
            </div>

            {/* Bottom Indicator */}
            <div className={styles.bottomIndicator}>
                <Typography variant="body" className={styles.categoriesText}>
                    Personal <span className={styles.dot}>·</span> Académico <span className={styles.dot}>·</span> Profesional
                </Typography>
            </div>
        </div>
    );
};

export default FirstView;
