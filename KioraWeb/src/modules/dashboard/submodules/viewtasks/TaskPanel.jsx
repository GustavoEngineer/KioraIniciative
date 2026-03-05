import React from 'react';
import { Icon } from '@iconify/react';
import styles from './TaskPanel.module.css';

const formatDate = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    const day = date.toLocaleDateString('es-ES', { weekday: 'short' });
    const num = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleDateString('es-ES', { month: 'short' });
    const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
    return `${cap(day)} ${num} ${cap(month)}`;
};

const TaskPanel = ({ task, onClose }) => {
    if (!task) return null;

    return (
        <div className={styles.panelOverlay} onClick={onClose}>
            <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
                {/* Header: nombre de la tarea + ícono lechuza */}
                <div className={styles.panelHeader}>
                    <div className={styles.titleRow}>
                        <Icon
                            icon="material-symbols-light:owl-rounded"
                            className={styles.owlIcon}
                        />
                        <h2 className={styles.taskName}>{task.title}</h2>
                    </div>
                    <button className={styles.closeBtn} onClick={onClose} aria-label="Cerrar">
                        <Icon icon="solar:close-circle-linear" />
                    </button>
                </div>

                {/* Body: descripción + fecha de vencimiento */}
                <div className={styles.panelBody}>
                    <div className={styles.bodyLeft}>
                        {task.description
                            ? <p className={styles.description}>{task.description}</p>
                            : <p className={styles.emptyDescription}>Sin descripción.</p>
                        }
                    </div>

                    {task.due_date && (
                        <div className={styles.bodyRight}>
                            <div className={styles.dueDateCard}>
                                <Icon icon="solar:calendar-minimalistic-linear" className={styles.calendarIcon} />
                                <span className={styles.dueDateLabel}>Vencimiento</span>
                                <span className={styles.dueDateValue}>{formatDate(task.due_date)}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TaskPanel;
