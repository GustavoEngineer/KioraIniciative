import React from 'react';
import { Icon } from '@iconify/react';
import { Typography } from '../../../../../../common/components/typography/typography';
import styles from './TaskGeneralInfoCard.module.css';
import { getPriorityInfo, TagPill } from '../../../../../../common/components/cards/TaskCard';
import '../../../transitions/Dashboard_taskinfo.css';

const TaskGeneralInfoCard = ({ task, isFocused, isShrunk, isTimerActive, onClose, onStartTask }) => {
    const [activeTab, setActiveTab] = React.useState('subtasks');
    const [displayTask, setDisplayTask] = React.useState(task);

    // Mantener la tarea visible mientras se anima hacia afuera
    React.useEffect(() => {
        if (task) {
            setDisplayTask(task);
        }
    }, [task]);

    // Ya no retornamos null para permitir la transición de salida
    // pero evitamos renderizar contenido si no hay tarea previa o actual
    const currentTask = task || displayTask;
    if (!currentTask) return null;

    const priority = getPriorityInfo(currentTask.priority || 5);
    const raw = currentTask.tags;
    const tags = raw
        ? Array.isArray(raw) ? raw : [raw]
        : task.tag_id ? [{ id: task.tag_id }] : [];

    const formatDate = (dateStr) => {
        if (!dateStr) return 'Sin fecha';
        const date = new Date(dateStr.includes('T') ? dateStr : dateStr.replace(/-/g, '/'));
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };

    const activeContent = activeTab === 'subtasks' ? (currentTask.subtasks || []) : (currentTask.attachments || []) ;
    const isEmpty = activeContent.length === 0;

    return (
        <div className={`
            ${styles.overlay} 
            taskinfo-overlay-transition 
            ${isFocused ? 'taskinfo-overlay-visible' : ''}
            ${isTimerActive ? styles.timerActive : ''}
        `}>
            <div className={`${styles.card} taskinfo-card-transition ${isFocused ? 'taskinfo-card-visible' : ''} ${isShrunk ? 'taskinfo-shrunk-transition' : ''}`}>
                <div className={styles.header}>
                    <div className={styles.headerLeft}>
                        <div className={styles.iconContainer} style={{ backgroundColor: '#eef2ff', color: '#3b82f6' }}>
                            <Icon icon="solar:notebook-bold-duotone" width="32" />
                        </div>
                        <Typography variant="dashboard-title" className={styles.title}>
                            {currentTask.title}
                        </Typography>
                    </div>
                    
                    <div className={styles.headerActions}>
                        <div className={styles.actionsBar}>
                            <button 
                                className={`${styles.actionButton} ${styles.startAction}`} 
                                title="Iniciar tarea"
                                onClick={() => onStartTask && onStartTask(currentTask)}
                            >
                                <Icon icon="solar:play-circle-bold-duotone" />
                            </button>
                            <button className={`${styles.actionButton} ${styles.editAction}`} title="Editar tarea">
                                <Icon icon="solar:pen-new-square-bold-duotone" />
                            </button>
                            <button className={`${styles.actionButton} ${styles.deleteAction}`} title="Eliminar tarea">
                                <Icon icon="solar:trash-bin-trash-bold-duotone" />
                            </button>
                            <button className={`${styles.actionButton} ${styles.completeAction}`} title="Completar tarea">
                                <Icon icon="solar:check-circle-bold-duotone" />
                            </button>
                        </div>
                        <button className={styles.closeButton} onClick={onClose} title="Cerrar detalle">
                            <Icon icon="solar:close-circle-bold" width="24" height="24" />
                        </button>
                    </div>
                </div>

                <div className={styles.content}>
                    <div className={styles.metadataGrid}>
                        <div className={styles.metaItem}>
                            <span className={styles.metaLabel}>Prioridad</span>
                            <div className={styles.metaValue} style={{ color: priority.color }}>
                                <Icon icon={priority.icon} width={14} />
                                <span>{priority.label}</span>
                            </div>
                        </div>

                        <div className={styles.metaItem}>
                            <span className={styles.metaLabel}>Fecha de entrega</span>
                            <div className={styles.metaValue}>
                                <Icon icon="solar:calendar-minimalistic-bold" width={14} />
                                <span>{formatDate(currentTask.due_date)}</span>
                            </div>
                        </div>

                        <div className={styles.metaItem}>
                            <span className={styles.metaLabel}>Estado</span>
                            <div className={styles.metaValue}>
                                <Icon icon="solar:info-circle-bold" width={14} />
                                <span>{currentTask.status || 'Pendiente'}</span>
                            </div>
                        </div>

                        <div className={styles.metaItem}>
                            <span className={styles.metaLabel}>Etiquetas</span>
                            <div className={styles.tagsContainer}>
                                {tags.length > 0 ? (
                                    tags.map((tag, idx) => (
                                        <span key={idx} className={styles.tagItem}>
                                            #{tag.name || tag.label || 'sin-nombre'}
                                        </span>
                                    ))
                                ) : (
                                    <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>Sin etiquetas</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className={`${styles.descriptionSection} ${!currentTask.description ? styles.isEmpty : ''}`}>
                        <span className={styles.metaLabel}>Descripción</span>
                        {currentTask.description ? (
                            <p className={styles.taskDescription}>{currentTask.description}</p>
                        ) : (
                            <div className={styles.placeholderContainer}>
                                <p className={styles.placeholderText}>Agregar descripción</p>
                            </div>
                        )}
                    </div>

                    <div className={styles.tabsContainer}>
                        <div className={styles.tabBar}>
                            <button 
                                className={`${styles.tabItem} ${activeTab === 'subtasks' ? styles.active : ''}`}
                                onClick={() => setActiveTab('subtasks')}
                            >
                                Subtareas
                                {currentTask.subtasks?.length > 0 && <span className={styles.tabBadge}>{currentTask.subtasks.length}</span>}
                            </button>
                            <button 
                                className={`${styles.tabItem} ${activeTab === 'attachments' ? styles.active : ''}`}
                                onClick={() => setActiveTab('attachments')}
                            >
                                Archivos
                                {currentTask.attachments?.length > 0 && <span className={styles.tabBadge}>{currentTask.attachments.length}</span>}
                            </button>
                        </div>

                        <div className={`${styles.tabContent} ${isEmpty ? styles.isEmpty : ''}`}>
                            {activeTab === 'subtasks' ? (
                                currentTask.subtasks?.length > 0 ? (
                                    <div className={styles.list}>
                                        {/* List implementation */}
                                    </div>
                                ) : (
                                    <div className={styles.placeholderContainer}>
                                        <p className={styles.placeholderText}>Sin subtareas</p>
                                    </div>
                                )
                            ) : (
                                currentTask.attachments?.length > 0 ? (
                                    <div className={styles.list}>
                                        {/* Attachments implementation */}
                                    </div>
                                ) : (
                                    <div className={styles.placeholderContainer}>
                                        <p className={styles.placeholderText}>Sin archivos</p>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskGeneralInfoCard;
