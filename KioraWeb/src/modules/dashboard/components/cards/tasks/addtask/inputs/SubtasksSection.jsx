import React from 'react';
import { Icon } from '@iconify/react';
import styles from './SubtasksSection.module.css';

const SubtasksSection = ({ subtasks, newSubtask, setNewSubtask, onAddSubtask, onRemoveSubtask }) => {
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            onAddSubtask(e);
        }
    };

    return (
        <div className={styles.fieldGroup}>
            <label className={styles.label}>
                Subtareas
            </label>
            
            <div className={styles.inputWrapper}>
                <input
                    type="text"
                    placeholder="¿Qué pasos requiere esta tarea?"
                    value={newSubtask}
                    onChange={(e) => setNewSubtask(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className={styles.input}
                />
                <button 
                    type="button" 
                    onClick={onAddSubtask}
                    className={styles.addButton}
                    title="Añadir subtarea"
                >
                    <Icon icon="solar:add-circle-bold-duotone" />
                </button>
            </div>

            <div className={styles.subtaskList}>
                {subtasks.map(st => (
                    <div key={st.id} className={styles.subtaskItem}>
                        <Icon icon="solar:check-circle-bold-duotone" className={styles.checkIcon} />
                        <span className={styles.subtaskText}>{st.title}</span>
                        <button 
                            type="button"
                            onClick={() => onRemoveSubtask(st.id)}
                            className={styles.removeSubtask}
                            title="Eliminar subtarea"
                        >
                            <Icon icon="solar:trash-bin-trash-bold-duotone" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SubtasksSection;
