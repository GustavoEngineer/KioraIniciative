import React from 'react';
import styles from './loginform.module.css';
import { Input } from '../../../../../common/components/inputs/inputsmodel';

const LoginForm = ({ isExiting, isRegisteringMode }) => {
    return (
        <div className={`${styles.formContainer} ${isExiting && !isRegisteringMode ? styles.exitDown : ''} ${isRegisteringMode ? styles.exitRegisterMode : ''}`}>
            <Input
                type="email"
                placeholder="Correo electrónico"
                icon="solar:letter-outline"
            />
            <Input
                type="password"
                placeholder="Contraseña"
                icon="solar:lock-outline"
            />
        </div>
    );
};

export default LoginForm;
