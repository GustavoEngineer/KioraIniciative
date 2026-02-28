import React from 'react';
import styles from './registerform.module.css';
import { Input } from '../../../../../common/components/inputs/inputsmodel';

const RegisterForm = () => {
    return (
        <div className={styles.formContainer}>
            <Input
                type="text"
                placeholder="Nombre completo"
                icon="solar:user-outline"
            />
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
            <Input
                type="password"
                placeholder="Confirmar contraseña"
                icon="solar:lock-outline"
            />
        </div>
    );
};

export default RegisterForm;
