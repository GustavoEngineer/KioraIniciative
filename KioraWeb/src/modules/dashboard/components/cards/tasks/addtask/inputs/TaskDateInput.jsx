import React from 'react';
import styles from './TaskDateInput.module.css';

const TaskDateInput = ({ value, onChange }) => {
    return (
        <div className={styles.fieldGroup}>
            <label className={styles.label}>
                Fecha de entrega <span className={styles.requiredAsterisk}>*</span>
            </label>
            <input
                type="date"
                name="due_date"
                value={value}
                onChange={onChange}
                className={styles.dateInput}
            />
        </div>
    );
};

export default TaskDateInput;
