import React from 'react';
import styles from './TaskDescriptionInput.module.css';

const TaskDescriptionInput = ({ value, onChange }) => {
    return (
        <div className={styles.fieldGroup}>
            <label className={styles.label}>
                Descripción
            </label>
            <textarea
                name="description"
                value={value}
                onChange={onChange}
                placeholder="Añade más detalles..."
                className={styles.textarea}
            />
        </div>
    );
};

export default TaskDescriptionInput;
