import React from 'react';
import { Icon } from '@iconify/react';
import styles from './TaskCard.module.css';
import { useTag } from '../../../modules/dashboard/hooks/useTag';

/**
 * Rediseño del TaskCard:
 * - Título con Tag a un lado
 * - Urgencia y Estado debajo del título con iconos
 * - Sin descripción, sin barra de progreso, sin avatares
 * - Borde y sombra personalizados
 */

export const getPriorityInfo = (level) => {
    const priorityMap = {
        2: { label: 'Baja', icon: 'solar:flag-bold', color: '#10b981' },
        5: { label: 'Media', icon: 'solar:flag-bold', color: '#f59e0b' },
        8: { label: 'Alta', icon: 'solar:flag-bold', color: '#ef4444' },
        10: { label: 'Crítica', icon: 'solar:flag-bold', color: '#9333ea' }
    };
    return priorityMap[level] || priorityMap[5];
};

export const TagPill = ({ tag, hideIcon }) => {
    const needsFetch = !tag.name;
    const { tag: fetched } = useTag(needsFetch ? tag.id : null);
    const name = tag.name || fetched?.name;
    if (!name) return null;

    return (
        <div className={styles.tagPill}>
            {!hideIcon && <Icon icon="solar:hashtag-bold" width={12} />}
            <span>{name}</span>
        </div>
    );
};

const TaskCard = ({ task, onClick, variant }) => {
    const isCompact = variant === 'compact';
    const raw = task.tags;
    const tags = raw
        ? Array.isArray(raw) ? raw : [raw]
        : task.tag_id ? [{ id: task.tag_id }] : [];

    const priority = getPriorityInfo(task.priority || 5);
    const subtasks = task.subtasks || [];
    const hasSubtasks = subtasks.length > 0;
    const completedSubtasks = subtasks.filter(s => s.completed).length;

    // Formatear fecha: 12 Jan 2024
    const formatDate = (dateStr) => {
        if (!dateStr) return 'Sin fecha';
        // Usar '-' por '/' para evitar desfases de zona horaria al parsear strings de solo fecha
        const date = new Date(dateStr.includes('T') ? dateStr : dateStr.replace(/-/g, '/'));
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div className={`${styles.taskCard} ${isCompact ? styles.compact : ''}`} onClick={onClick}>
            {tags.length > 0 && (
                <div className={styles.tagsRow}>
                    {tags.map((tag, idx) => (
                        <TagPill key={idx} tag={tag} hideIcon />
                    ))}
                </div>
            )}

            <div className={styles.bodyContent}>
                <h4 className={styles.title}>{task.title}</h4>
                {!isCompact && task.description && (
                    <p className={styles.description}>{task.description}</p>
                )}
            </div>

            <div className={styles.footerRow}>
                <div className={styles.leftFooter}>
                    <div className={styles.dateInfo}>
                        <Icon icon="solar:calendar-minimalistic-bold" width={14} />
                        <span>{formatDate(task.due_date)}</span>
                    </div>
                    {hasSubtasks && (
                        <div className={styles.subtasksInfo}>
                            <Icon icon="solar:checklist-minimalistic-bold" width={14} />
                            <span>{completedSubtasks}/{subtasks.length}</span>
                        </div>
                    )}
                </div>
                
                <div className={styles.priorityPill} style={{ backgroundColor: `${priority.color}15`, color: priority.color }}>
                    <Icon icon={priority.icon} width={12} />
                    <span>{priority.label}</span>
                </div>
            </div>
        </div>
    );
};

export default TaskCard;
