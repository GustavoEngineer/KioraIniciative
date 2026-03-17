import React from 'react';
import { FiPlus, FiCheck, FiTrash2 } from 'react-icons/fi';
import { Typography } from '../../../../../../../common/components/typography/typography';
import styles from './SubtasksSection.module.css';

const SubtasksSection = ({ subtasks, newSubtask, setNewSubtask, onAddSubtask, onRemoveSubtask }) => {
    return (
        <div className={styles.subtasksContainer}>
            <Typography variant="dashboard-title" className={styles.sectionTitle}>
                Planificación de Subtareas
            </Typography>
            
            <div className={styles.subtaskForm}>
                <input
                    type="text"
                    placeholder="¿Qué pasos requiere esta tarea?"
                    value={newSubtask}
                    onChange={(e) => setNewSubtask(e.target.value)}
                    onKeyPress={onAddSubtask}
                    className={styles.input}
                />
                <button 
                    type="button" 
                    onClick={onAddSubtask}
                    className={styles.addButton}
                >
                    <FiPlus />
                </button>
            </div>

            <div className={styles.subtaskList}>
                {subtasks.length > 0 ? (
                    subtasks.map(st => (
                        <div key={st.id} className={styles.subtaskItem}>
                            <FiCheck className={styles.checkIcon} />
                            <span className={styles.subtaskText}>{st.title}</span>
                            <button 
                                onClick={() => onRemoveSubtask(st.id)}
                                className={styles.removeSubtask}
                            >
                                <FiTrash2 />
                            </button>
                        </div>
                    ))
                ) : (
                    <div className={styles.emptySubtasks}>
                        No hay subtareas añadidas aún.
                    </div>
                )}
            </div>
        </div>
    );
};

export default SubtasksSection;
