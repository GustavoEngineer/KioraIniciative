import React from 'react';
import { Input } from '../../common/components/inputs/homeinputs';
import { SimpleButton } from '../../common/components/buttons/simplebotons';
import { useLogin } from './hooks/useLogin';
import styles from './authview.module.css';
import imageBg from '../../assets/main.jpg';

const AuthView = () => {
    const { formData, loading, handleChange, handleSubmit } = useLogin();

    return (
        <div className={styles.authContainer}>
            <div className={styles.backgroundWrapper}>
                <img src={imageBg} alt="Background" className={styles.imageBackground} />
            </div>

            <form className={styles.formContainer} onSubmit={handleSubmit}>
                <div className={styles.formHeader}>
                    <h1 className={styles.formTitle}>Kiora</h1>
                    <p className={styles.formSubtitle}>Inicia sesión para continuar</p>
                </div>

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
                    style={{ marginTop: '0.5rem', alignSelf: 'stretch', opacity: loading ? 0.7 : 1 }}
                />
            </form>
        </div>
    );
};

export default AuthView;


