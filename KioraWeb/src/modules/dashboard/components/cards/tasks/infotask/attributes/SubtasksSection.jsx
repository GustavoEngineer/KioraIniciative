import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import styles from './SubtasksSection.module.css';
import { Typography } from '../../../../../../../common/components/typography/typography';

const SubtasksSection = ({ subtasks = [], isLoading }) => {
    const [activeTab, setActiveTab] = useState('subtasks');

    const completedCount = subtasks.filter(s => s.is_completed).length;
    const totalCount = subtasks.length;
    const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

    return (
        <div className={styles.container}>
            {/* Tabs */}
            <div className={styles.tabs}>
                <button
                    className={`${styles.tab} ${activeTab === 'subtasks' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('subtasks')}
                >
                    <div className={styles.tabContent}>
                        <Typography variant="dashboard-body" className={styles.tabText}>Subtasks</Typography>
                        {totalCount > 0 && (
                            <span className={styles.badge}>
                                {completedCount}/{totalCount}
                            </span>
                        )}
                    </div>
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'notes' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('notes')}
                >
                    <Typography variant="dashboard-body" className={styles.tabText}>Notas</Typography>
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'files' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('files')}
                >
                    <Typography variant="dashboard-body" className={styles.tabText}>Archivos</Typography>
                </button>
            </div>

            {activeTab === 'subtasks' ? (
                <>
                    {/* List */}
                    <div className={styles.list}>
                        {isLoading ? (
                            <div className={styles.loading}>Cargando...</div>
                        ) : subtasks.length > 0 ? (
                            subtasks.map((sub) => (
                                <div key={sub.id} className={styles.item}>
                                    <div className={styles.itemMain}>
                                        <div className={`${styles.checkbox} ${sub.is_completed ? styles.checked : ''}`}>
                                            {sub.is_completed && <Icon icon="solar:check-read-bold" width={12} />}
                                        </div>
                                        <div className={styles.itemContent}>
                                            <Typography variant="dashboard-body" className={`${styles.text} ${sub.is_completed ? styles.completedText : ''}`}>
                                                {sub.description}
                                            </Typography>

                                            {/* Mocking notes/blockers if they were in the data structure,
                                                using description parsing or placeholder for now */}
                                            {sub.description.toLowerCase().includes('client') && (
                                                <div className={styles.note}>
                                                    <span className={styles.noteLabel}>Blocker :</span>
                                                    The brief from client was not clear so it took time to understand it 🥺
                                                </div>
                                            )}
                                        </div>

                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className={styles.empty}>No hay subtareas</div>
                        )}
                    </div>
                </>
            ) : (
                <div className={styles.comingSoon}>
                    <Icon icon="solar:rocket-bold-duotone" width={48} className={styles.comingSoonIcon} />
                    <Typography variant="dashboard-title" className={styles.comingSoonText}>
                        Proximamente en la version 2 de Kiora
                    </Typography>
                </div>
            )}
        </div>
    );
};

export default SubtasksSection;
