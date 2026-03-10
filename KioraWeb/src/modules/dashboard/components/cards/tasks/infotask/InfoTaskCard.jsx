import React from 'react';
import { Icon } from '@iconify/react';
import DashboardCard from '../../../../../../common/components/cards/DashboardCard';
import styles from './InfoTaskCard.module.css';
import Attribute from './attributes/Attribute';
import { TagPill } from '../../../../../../common/components/cards/TaskCard';
import { useSubtasks } from '../../../../hooks/useSubtasks';
import SubtasksSection from './attributes/SubtasksSection';

const InfoTaskCard = ({ task, onClose }) => {
    const { subtasks, isLoading: loadingSubtasks } = useSubtasks(task?.id);

    if (!task) return null;

    const raw = task.tags;
    const tags = raw
        ? Array.isArray(raw) ? raw : [raw]
        : task.tag_id ? [{ id: task.tag_id }] : [];

    return (
        <DashboardCard title="Detalle de Tarea" className={styles.container}>
            <button className={styles.closeBtn} onClick={onClose} aria-label="Cerrar">
                <Icon icon="solar:close-square-broken" width={22} />
            </button>

            <div className={styles.content}>
                <div className={styles.header}>
                    <h2 className={styles.title}>{task.title}</h2>
                </div>

                <div className={styles.attributesColumn}>
                    <Attribute
                        icon="solar:hourglass-bold"
                        label="Estatus"
                        value={task.is_completed ? 'Terminada' : 'En Progreso'}
                        variant="status"
                    />

                    <Attribute
                        icon="solar:shield-check-bold"
                        label="Prioridad"
                        value={task.priority || 'Baja'}
                        variant="priority"
                    />

                    {task.due_date && (
                        <Attribute
                            icon="solar:calendar-date-bold"
                            label="Fecha"
                            value={new Date(task.due_date).toLocaleDateString('es-ES', {
                                timeZone: 'UTC',
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            }) + (task.end_date ? ` - ${new Date(task.end_date).toLocaleDateString('es-ES', {
                                timeZone: 'UTC',
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            })}` : '')}
                        />
                    )}

                    {tags.length > 0 && (
                        <div className={styles.tagsAttribute}>
                            <div className={styles.labelArea}>
                                <Icon icon="solar:tag-bold" width={16} />
                                <span className={styles.label}>Etiquetas</span>
                            </div>
                            <div className={styles.tagsList}>
                                {tags.map((tag, idx) => (
                                    <TagPill key={idx} tag={tag} hideIcon />
                                ))}
                            </div>
                        </div>
                    )}

                    {task.description && (
                        <Attribute
                            icon="solar:notes-bold"
                            label="Descripción"
                            value={task.description}
                            isMultiline
                        />
                    )}

                    <SubtasksSection subtasks={subtasks} isLoading={loadingSubtasks} />
                </div>
            </div>
        </DashboardCard>
    );
};

export default InfoTaskCard;
