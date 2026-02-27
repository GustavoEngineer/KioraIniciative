import React from 'react';
import { Typography } from '../../../../common/components/typography';
import styles from './authview.module.css';

const AuthView = () => {
    return (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>

            {/* Línea Blanca Vertical en la izquierda */}
            <div className={styles.verticalLine}></div>

            {/* Línea Blanca Vertical en la derecha */}
            <div className={styles.verticalLineRight}></div>

            {/* Línea Blanca Horizontal en la parte superior */}
            <div className={styles.horizontalLineTop}></div>

            {/* Textos Hero Integrados en Auth */}
            <div className={styles.heroTextContainer}>
                <Typography variant="h1" className={styles.mainTitle}>
                    El orden también <br /> es una forma de libertad.
                </Typography>
                <Typography variant="body" className={styles.subTitle}>
                    Kiora te ayuda a tener el control de todo lo que importa,<br />
                    para que puedas enfocarte en lo que realmente vale.
                </Typography>
            </div>

            {/* Panel Glassmorphism Inferior */}
            <div className={styles.authContainer}>
                {/* Aquí luego puedes construir el formulario de Login/Registro real */}
            </div>

        </div>
    );
};

export default AuthView;
