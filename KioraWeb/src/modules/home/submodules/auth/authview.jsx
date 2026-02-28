import React from 'react';
import { Typography } from '../../../../common/components/typography';
import styles from './authview.module.css';
import LoginForm from './loginform/loginform';
import RegisterView from './registerform/registerview';
import RegisterForm from './registerform/registerform';
import HomeButtons from '../../components/homebuttons';

const AuthView = ({ onBack, onAction, isExiting, isRegistering }) => {
    return (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>

            {/* Línea Blanca Vertical en la izquierda */}
            <div className={`${styles.verticalLine} ${isExiting ? styles.exitUp : ''}`}></div>

            {/* Línea Blanca Vertical en la derecha */}
            <div className={`${styles.verticalLineRight} ${isExiting ? styles.exitUp : ''}`}></div>

            {/* Línea Blanca Horizontal en la parte superior */}
            <div className={`${styles.horizontalLineTop} ${isExiting ? styles.exitLeft : ''}`}></div>

            {/* Botones de Navegación Superior */}
            <HomeButtons onBack={onBack} onAction={onAction} isExiting={isExiting} isRegistering={isRegistering} />

            {/* Textos Hero y Contenido de Registro (Extraídos a RegisterView) */}
            <RegisterView isRegistering={isRegistering} isExiting={isExiting} />

            {/* Panel Glassmorphism Inferior (Fondo) */}
            <div className={`${styles.authBackground} ${isExiting ? styles.exitDownBg : ''} ${isRegistering ? styles.expandUpBg : ''}`}></div>

            {/* Contenedor del contenido (Sin máscara para que inputs no sean transparentes) */}
            <div className={`${styles.authContentContainer} ${isExiting ? styles.exitDownBg : ''} ${isRegistering ? styles.moveUpForm : ''}`}>
                {/* Mostramos siempre LoginForm para que se anime hacia afuera si isRegistering es true, 
                    a menos que realmente ya no lo queramos */}
                {!isRegistering ? (
                    <LoginForm isExiting={isExiting} />
                ) : (
                    <>
                        {/* Podemos mantener LoginForm en el DOM temporalmente aplicándole una clase CSS si quisiéramos, 
                            pero aquí el request es "que los inputs suban y luego salgan los restantes".
                            Si isRegistering es true, el contenedor sube. Y dentro renderizamos LoginForm animándose hacia afuera, 
                            y luego RegisterForm animándose. */}
                        <LoginForm isExiting={true} isRegisteringMode={isRegistering} />
                        <RegisterForm />
                    </>
                )}
            </div>

        </div>
    );
};

export default AuthView;
