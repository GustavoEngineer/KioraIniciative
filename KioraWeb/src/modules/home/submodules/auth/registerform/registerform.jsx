import React from 'react';
import styles from './registerform.module.css';
import { Input } from '../../../../../common/components/inputs/homeinputs';
import { SimpleButton } from '../../../../../common/components/buttons/simplebotons';
import { useRegister } from '../hooks/useRegister';

const RegisterForm = () => {
    const { formData, loading, error, success, handleChange, handleSubmit } = useRegister();

    return (
        <form className={styles.formContainer} onSubmit={handleSubmit}>
            {error && <div className={styles.errorMsg}>{error}</div>}
            {success && <div className={styles.successMsg}>¡Registro exitoso! Verifica tu correo.</div>}
            <Input
                type="text"
                name="fullName"
                placeholder="Nombre completo"
                icon="solar:user-outline"
                value={formData.fullName}
                onChange={handleChange}
                onFocus={(e) => e.target.removeAttribute('readonly')}
                readOnly
            />
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
            <Input
                type="password"
                name="confirmPassword"
                placeholder="Confirmar contraseña"
                icon="solar:lock-outline"
                value={formData.confirmPassword}
                onChange={handleChange}
                onFocus={(e) => e.target.removeAttribute('readonly')}
                readOnly
            />
            <SimpleButton
                type="submit"
                text={loading ? "Creando..." : "Crear espacio"}
                variant="classic"
                style={{ marginTop: '1rem', alignSelf: 'center', opacity: loading ? 0.7 : 1 }}
                disabled={loading}
            />
        </form>
    );
};

export default RegisterForm;
