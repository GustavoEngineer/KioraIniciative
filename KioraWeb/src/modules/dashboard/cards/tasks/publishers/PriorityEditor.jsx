import React, { useState } from 'react';
import styles from './PriorityEditor.module.css';
import { Typography } from '../../../../../common/components/typography/typography';
import { Icon } from '@iconify/react';
import { DashRange } from '../../../../../common/components/inputs/dashboardinputs';

const PriorityEditor = ({ isVisible, currentPriority, onSelectPriority, onClose }) => {
    const [tempPriority, setTempPriority] = useState(currentPriority || 5);

    const getPriorityColor = (level) => {
        if (level >= 8) return '#ef4444'; // Critica
        if (level >= 5) return '#f59e0b'; // Media
        return '#10b981'; // Baja
    };

    const getPriorityLabel = (level) => {
        if (level >= 8) return 'Crítica';
        if (level >= 5) return 'Media';
        return 'Baja';
    };

    return (
        <div className={`${styles.container} ${isVisible ? styles.visible : ''}`}>
            <div className={styles.header}>
                <Typography variant="dashboard-title" className={styles.title}>Prioridad</Typography>
                <button className={styles.closeBtn} onClick={onClose}>
                    <Icon icon="solar:close-square-linear" />
                </button>
            </div>

            <div className={styles.content}>
                <div
                    className={styles.prioDisplay}
                    style={{ '--prio-color': getPriorityColor(tempPriority) }}
                >
                    <span className={styles.prioNumber}>{tempPriority}</span>
                    <span className={styles.prioLabel}>{getPriorityLabel(tempPriority)}</span>
                </div>

                <div className={styles.rangeWrapper}>
                    <DashRange
                        min="1"
                        max="10"
                        value={tempPriority}
                        onChange={(e) => setTempPriority(parseInt(e.target.value))}
                    />
                    <div className={styles.rangeLabels}>
                        <span>1</span>
                        <span>5</span>
                        <span>10</span>
                    </div>
                </div>

                <div className={styles.quickSelect}>
                    <Typography variant="dashboard-body" className={styles.subtitle}>Preajustes</Typography>
                    <div className={styles.prioButtons}>
                        <button
                            className={styles.prioBtn}
                            style={{ '--btn-color': '#10b981' }}
                            onClick={() => { setTempPriority(1); onSelectPriority(1); }}
                        >
                            Baja
                        </button>
                        <button
                            className={styles.prioBtn}
                            style={{ '--btn-color': '#f59e0b' }}
                            onClick={() => { setTempPriority(5); onSelectPriority(5); }}
                        >
                            Media
                        </button>
                        <button
                            className={styles.prioBtn}
                            style={{ '--btn-color': '#ef4444' }}
                            onClick={() => { setTempPriority(9); onSelectPriority(9); }}
                        >
                            Crítica
                        </button>
                    </div>
                </div>
            </div>

            <div className={styles.footer}>
                <button className={styles.saveBtn} onClick={() => onSelectPriority(tempPriority)}>
                    Guardar Prioridad
                </button>
            </div>
        </div>
    );
};

export default PriorityEditor;
