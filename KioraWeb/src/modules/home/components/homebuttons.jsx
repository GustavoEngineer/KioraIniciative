import React from 'react';
import { SimpleButton } from '../../../common/components/buttons/simplebotons';
import styles from './homebuttons.module.css';

const HomeButtons = ({ onBack, onAction, isExiting, isRegistering }) => {
    return (
        <div className={`${styles.buttonsContainer} ${isExiting ? styles.exitUp : ''}`}>
            <SimpleButton
                text="Volver al origen"
                variant="secondary"
                icon="solar:arrow-left-outline"
                className={styles.navButton}
                onClick={onBack}
            />
            <SimpleButton
                text={isRegistering ? "Ya tengo mi espacio" : "Quiero mi espacio"}
                variant="primary"
                icon="material-symbols-light:owl-rounded"
                className={styles.navButton}
                onClick={onAction}
            />
        </div>
    );
};

export default HomeButtons;
