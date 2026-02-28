import React from 'react';
import { Typography } from '../../../../../common/components/typography';
import styles from './registerview.module.css';

const RegisterView = ({ isRegistering, isExiting }) => {
    return (
        <div className={`${styles.heroTextContainer} ${isExiting ? styles.exitDownHero : ''} ${isRegistering ? styles.moveUpHero : ''}`}>
            <Typography variant="h1" className={styles.mainTitle}>
                {isRegistering ? (
                    <>Cada gran cosa<br /> comenzó con un primer paso.</>
                ) : (
                    <>El orden también <br /> es una forma de libertad.</>
                )}
            </Typography>
            <Typography variant="body" className={styles.subTitle}>
                {isRegistering ? null : (
                    <>Kiora te ayuda a tener el control de todo lo que importa,<br />para que puedas enfocarte en lo que realmente vale.</>
                )}
            </Typography>
        </div>
    );
};

export default RegisterView;
