import React from 'react';
import styles from './TaskInfoCard.module.css';
import { Typography } from '../../../../common/components/typography/typography';
import { useSubtasks } from '../../hooks/useSubtasks';
import { Icon } from '@iconify/react';

const formatDate = (dateStr) => {
    if (!dateStr) return null;
    try {
        // Tomar solo la parte de la fecha YYYY-MM-DD ignorando la hora si existe
        const pureDate = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;
        const [year, month, day] = pureDate.split('-').map(Number);

        if (isNaN(year) || isNaN(month) || isNaN(day)) return "Fecha inválida";

        const date = new Date(year, month - 1, day);
        const dayNum = date.getDate();
        const monthName = date.toLocaleDateString('es-ES', { month: 'long' });
        const yearNum = date.getFullYear();
        const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

        return `${dayNum} ${cap(monthName)}, ${yearNum}`;
    } catch (e) {
        return "Fecha inválida";
    }
};

const TaskInfoCard = ({
    taskId,
    isVisible,
    tasks,
    subtasks,
    subtasksLoading,
    refetchTasks,
    onEditDate,
    isEditingDate,
    onEditTag,
    isEditingTag,
    onEditPriority,
    isEditingPriority,
    onEditDescription,
    isEditingDescription,
    onEditSubtasks,
    isEditingSubtasks
}) => {
    const [lastTask, setLastTask] = React.useState(null);

    const currentTask = tasks?.find(t => t.id === taskId);

    React.useEffect(() => {
        if (currentTask) {
            setLastTask(currentTask);
        }
    }, [currentTask]);

    const task = currentTask || lastTask;

    const isAnyEditing = isEditingDate || isEditingTag || isEditingPriority || isEditingDescription || isEditingSubtasks;

    return (
        <div className={`${styles.container} ${isVisible ? styles.visible : ''} ${isAnyEditing ? styles.shifted : ''}`}>
            {task && (
                <>
                    <Typography variant="dashboard-title" className={styles.mainTitle}>
                        {task.title}
                    </Typography>

                    <div className={styles.taskMetaRow}>
                        {/* Fecha */}
                        <div className={styles.metaItem}>
                            <div className={styles.metaLabelSide} onClick={onEditDate}>
                                <Icon
                                    icon="solar:calendar-minimalistic-linear"
                                    className={`${styles.metaIcon} ${styles.editableIcon} ${isEditingDate ? styles.activeIcon : ''}`}
                                />
                                <span className={styles.metaLabel}>Fecha de Entrega:</span>
                            </div>
                            <div className={styles.valueWrapper}>
                                <span className={styles.metaValue}>
                                    {formatDate(task.due_date) || "Sin fecha"}
                                </span>
                            </div>
                        </div>

                        {/* Tag */}
                        <div className={styles.metaItem}>
                            <div className={styles.metaLabelSide} onClick={onEditTag}>
                                <Icon
                                    icon="solar:tag-linear"
                                    className={`${styles.metaIcon} ${styles.editableIcon} ${isEditingTag ? styles.activeIcon : ''}`}
                                />
                                <span className={styles.metaLabel}>Etiqueta:</span>
                            </div>
                            <div className={styles.valueWrapper}>
                                <span className={styles.metaValue}>
                                    {task.tags?.name || "Sin etiqueta"}
                                </span>
                            </div>
                        </div>

                        {/* Prioridad */}
                        <div className={styles.metaItem}>
                            <div className={styles.metaLabelSide} onClick={onEditPriority}>
                                <Icon
                                    icon="solar:danger-triangle-linear"
                                    className={`${styles.metaIcon} ${styles.editableIcon} ${isEditingPriority ? styles.activeIcon : ''}`}
                                    style={{ color: task.priority >= 8 ? '#ef4444' : task.priority >= 5 ? '#f59e0b' : '#10b981' }}
                                />
                                <span className={styles.metaLabel}>Prioridad:</span>
                            </div>
                            <div className={styles.valueWrapper}>
                                <span className={styles.metaValue}>
                                    {task.priority}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <Typography variant="dashboard-body">Descripción</Typography>
                            <button
                                className={`${styles.editBtn} ${isEditingDescription ? styles.activeEditBtn : ''}`}
                                aria-label="Editar descripción"
                                onClick={onEditDescription}
                            >
                                <Icon icon="solar:document-add-linear" className={styles.editIcon} />
                            </button>
                        </div>
                        <p className={styles.description}>
                            {task.description || "No hay descripción disponible para esta tarea."}
                        </p>
                    </div>

                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <Typography variant="dashboard-body">Sub-tareas</Typography>
                        </div>
                        {subtasksLoading ? (
                            <p className={styles.description}>Cargando sub-tareas...</p>
                        ) : subtasks && subtasks.length > 0 ? (
                            <ul className={styles.subtaskList}>
                                {subtasks.map(st => (
                                    <li key={st.id} className={`${styles.subtaskItem} ${st.is_completed ? styles.done : ''}`}>
                                        <span className={`${styles.subtaskTitle} ${st.is_completed ? styles.titleDone : ''}`}>
                                            {st.description}
                                        </span>
                                        <span className={styles.subtaskSubtitle}>
                                            {st.is_completed ? 'Completada' : 'Pendiente'}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className={styles.description}>No hay sub-tareas.</p>
                        )}
                    </div>

                    <div className={styles.footer}>
                        <button
                            className={`${styles.addSubtaskBtn} ${isEditingSubtasks ? styles.activeAddSubtaskBtn : ''}`}
                            onClick={onEditSubtasks}
                        >
                            <Icon icon="solar:add-circle-linear" />
                            Añadir sub-tareas
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default TaskInfoCard;
