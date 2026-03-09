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

const getPriorityInfo = (level) => {
    if (level >= 8) return { label: 'Urgente', icon: 'solar:flag-bold', color: '#ef4444' };
    if (level >= 5) return { label: 'Media', icon: 'solar:flag-bold', color: '#f59e0b' };
    return { label: 'Baja', icon: 'solar:flag-bold', color: '#10b981' };
};

export const TagPill = ({ tag }) => {
    const needsFetch = !tag.name;
    const { tag: fetched } = useTag(needsFetch ? tag.id : null);
    const name = tag.name || fetched?.name;
    if (!name) return null;

    return (
        <div className={styles.tagPill}>
            <Icon icon="solar:hashtag-bold" width={12} />
            <span>{name}</span>
        </div>
    );
};

const TaskCard = ({ task, onClick }) => {
    const raw = task.tags;
    const tags = raw
        ? Array.isArray(raw) ? raw : [raw]
        : task.tag_id ? [{ id: task.tag_id }] : [];

    const priority = getPriorityInfo(task.priority || 5);

    return (
        <div className={styles.taskCard} onClick={onClick}>
            <div className={styles.topRow}>
                <div className={styles.titleArea}>
                    <h4 className={styles.title}>{task.title}</h4>
                    {tags.length > 0 && (
                        <TagPill tag={tags[0]} />
                    )}
                </div>
            </div>

            <div className={styles.bottomRow}>
                <div className={styles.metaInfo}>
                    <div className={styles.metaItem} style={{ color: priority.color }}>
                        <Icon icon={priority.icon} width={14} />
                        <span>{priority.label}</span>
                    </div>
                    <div className={styles.metaItem}>
                        <Icon icon="solar:hourglass-bold" width={14} />
                        <span>{task.is_completed ? 'Terminada' : 'En Progreso'}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskCard;
