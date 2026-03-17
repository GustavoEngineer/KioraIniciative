import React from 'react';
import styles from './TaskTimeInput.module.css';

const TaskTimeInput = ({ hours, minutes, onChange }) => {
    return (
        <div className={styles.fieldGroup}>
            <label className={styles.label}>
                Tiempo estimado <span className={styles.requiredAsterisk}>*</span>
            </label>
            <div className={styles.timeControlUnified}>
                <div className={styles.timeSegment}>
                    <input
                        type="number"
                        name="hours"
                        value={hours}
                        onChange={onChange}
                        min="0"
                        className={styles.smallInput}
                    />
                    <span className={styles.unit}>h</span>
                </div>
                <div className={styles.separator} />
                <div className={styles.timeSegment}>
                    <input
                        type="number"
                        name="minutes"
                        value={minutes}
                        onChange={onChange}
                        min="0"
                        max="59"
                        className={styles.smallInput}
                    />
                    <span className={styles.unit}>m</span>
                </div>
            </div>
        </div>
    );
};

export default TaskTimeInput;
