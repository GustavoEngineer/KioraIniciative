import React from 'react';
import styles from './TaskTitleInput.module.css';

const TaskTitleInput = ({ value, onChange }) => {
    return (
        <div className={styles.fieldGroup}>
            <label className={styles.label}>
                Título de la tarea <span className={styles.requiredAsterisk}>*</span>
            </label>
            <input
                type="text"
                name="title"
                value={value}
                onChange={onChange}
                placeholder="¿Qué necesitas hacer?"
                className={styles.input}
                required
            />
        </div>
    );
};

export default TaskTitleInput;
