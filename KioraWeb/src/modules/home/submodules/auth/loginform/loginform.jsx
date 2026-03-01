import React, { useState } from 'react';
import styles from './loginform.module.css';
import { Input } from '../../../../../common/components/inputs/inputsmodel';
import { SimpleButton } from '../../../../../common/components/buttons/simplebotons';
import { useLogin } from '../hooks/useLogin';

const LoginForm = ({ isExiting, isRegisteringMode }) => {
    const { formData, loading, handleChange, handleSubmit } = useLogin();

    return (
        <form
            className={`${styles.formContainer} ${isExiting && !isRegisteringMode ? styles.exitDown : ''} ${isRegisteringMode ? styles.exitRegisterMode : ''}`}
            onSubmit={handleSubmit}
        >
            <Input
                type="email"
                name="email"
                placeholder="Correo electrónico"
                icon="solar:letter-outline"
                value={formData.email}
                onChange={handleChange}
                onFocus={(e) => e.target.removeAttribute('readonly')}
                readOnly
            />
            <Input
                type="password"
                name="password"
                placeholder="Contraseña"
                icon="solar:lock-outline"
                value={formData.password}
                onChange={handleChange}
                onFocus={(e) => e.target.removeAttribute('readonly')}
                readOnly
            />
            <SimpleButton
                text={loading ? "Verificando..." : "Iniciar sesión"}
                variant="classic"
                type="submit"
                disabled={loading}
                style={{ marginTop: '1rem', alignSelf: 'center', opacity: loading ? 0.7 : 1 }}
            />
        </form>
    );
};

export default LoginForm;
