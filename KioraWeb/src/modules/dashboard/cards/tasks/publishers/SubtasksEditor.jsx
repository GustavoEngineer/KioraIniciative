import React, { useState } from 'react';
import styles from './SubtasksEditor.module.css';
import { Typography } from '../../../../../common/components/typography/typography';
import { Icon } from '@iconify/react';
import { DashInput } from '../../../../../common/components/inputs/dashboardinputs';

const SubtasksEditor = ({ isVisible, subtasks, onAddSubtask, onToggleSubtask, onDeleteSubtask, onClose }) => {
    const [newSubtask, setNewSubtask] = useState('');

    const handleAdd = (e) => {
        if (e.key === 'Enter' && newSubtask.trim()) {
            onAddSubtask(newSubtask.trim());
            setNewSubtask('');
        }
    };

    const handleAddClick = () => {
        if (newSubtask.trim()) {
            onAddSubtask(newSubtask.trim());
            setNewSubtask('');
        }
    };

    return (
        <div className={`${styles.container} ${isVisible ? styles.visible : ''}`}>
            <div className={styles.header}>
                <Typography variant="dashboard-title" className={styles.title}>Sub-tareas</Typography>
                <button className={styles.closeBtn} onClick={onClose} aria-label="Cerrar">
                    <Icon icon="solar:close-square-linear" />
                </button>
            </div>

            <div className={styles.content}>
                <div className={styles.addSection}>
                    <DashInput
                        placeholder="Nueva sub-tarea..."
                        value={newSubtask}
                        onChange={(e) => setNewSubtask(e.target.value)}
                        onKeyDown={handleAdd}
                        icon="solar:add-circle-linear"
                    />
                    <button className={styles.addBtn} onClick={handleAddClick}>Añadir</button>
                </div>

                <div className={styles.listSection}>
                    <Typography variant="dashboard-body" className={styles.subtitle}>Lista de tareas</Typography>
                    <ul className={styles.subtaskList}>
                        {subtasks && subtasks.length > 0 ? (
                            subtasks.map(st => (
                                <li key={st.id} className={styles.subtaskItem}>
                                    <button
                                        className={`${styles.checkBtn} ${st.is_completed ? styles.checked : ''}`}
                                        onClick={() => onToggleSubtask(st.id, !st.is_completed)}
                                    >
                                        <Icon icon={st.is_completed ? "solar:check-circle-bold" : "solar:check-circle-linear"} />
                                    </button>
                                    <span className={`${styles.subtaskTitle} ${st.is_completed ? styles.done : ''}`}>
                                        {st.description}
                                    </span>
                                    <button className={styles.deleteBtn} onClick={() => onDeleteSubtask(st.id)}>
                                        <Icon icon="solar:trash-bin-trash-linear" />
                                    </button>
                                </li>
                            ))
                        ) : (
                            <p className={styles.emptyText}>No hay sub-tareas aún.</p>
                        )}
                    </ul>
                </div>
            </div>

            <div className={styles.footer}>
                <button className={styles.saveBtn} onClick={onClose}>
                    Listo
                </button>
            </div>
        </div>
    );
};

export default SubtasksEditor;
