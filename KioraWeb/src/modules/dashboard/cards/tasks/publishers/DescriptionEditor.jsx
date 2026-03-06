import React, { useState, useEffect } from 'react';
import styles from './DescriptionEditor.module.css';
import { Typography } from '../../../../../common/components/typography/typography';
import { Icon } from '@iconify/react';

const DescriptionEditor = ({ isVisible, currentDescription, onSave, onClose }) => {
    const [description, setDescription] = useState(currentDescription || '');

    useEffect(() => {
        if (isVisible) {
            setDescription(currentDescription || '');
        }
    }, [isVisible, currentDescription]);

    const handleSave = () => {
        onSave(description);
    };

    return (
        <div className={`${styles.container} ${isVisible ? styles.visible : ''}`}>
            <div className={styles.header}>
                <Typography variant="dashboard-title" className={styles.title}>Descripción</Typography>
                <button className={styles.closeBtn} onClick={onClose} aria-label="Cerrar">
                    <Icon icon="solar:close-square-linear" />
                </button>
            </div>

            <div className={styles.content}>
                <Typography variant="dashboard-body" className={styles.subtitle}>Editar contenido</Typography>
                <textarea
                    className={styles.textarea}
                    placeholder="Escribe una descripción detallada..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    autoFocus={isVisible}
                />
            </div>

            <div className={styles.footer}>
                <button className={styles.saveBtn} onClick={handleSave}>
                    Guardar Descripción
                </button>
            </div>
        </div>
    );
};

export default DescriptionEditor;
