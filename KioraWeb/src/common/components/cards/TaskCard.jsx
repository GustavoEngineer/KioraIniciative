import React from 'react';
import { Icon } from '@iconify/react';
import styles from './TaskCard.module.css';
import { useTag } from '../../../modules/dashboard/hooks/useTag';

// Formatea una fecha como "Mié 04 Mar"
const formatDate = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    const day = date.toLocaleDateString('es-ES', { weekday: 'short' });
    const num = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleDateString('es-ES', { month: 'short' });
    return `${day.charAt(0).toUpperCase() + day.slice(1)} ${num} ${month.charAt(0).toUpperCase() + month.slice(1)}`;
};

// Sub-componente que resuelve un tag por ID si no viene el nombre
const TagPill = ({ tag }) => {
    const needsFetch = !tag.name;
    const { tag: fetched } = useTag(needsFetch ? tag.id : null);
    const name = tag.name || fetched?.name;
    if (!name) return null;
    return <span className={styles.tag}>{name}</span>;
};

const TaskCard = ({ task, onClick }) => {
    const raw = task.tags;
    const tags = raw
        ? Array.isArray(raw) ? raw : [raw]
        : task.tag_id ? [{ id: task.tag_id }] : [];

    const dateLabel = formatDate(task.due_date || task.created_at);

    return (
        <div className={styles.taskCard} onClick={onClick}>
            {/* Cabecera: título + fecha */}
            <div className={styles.header}>
                <h4 className={styles.title}>{task.title}</h4>
                {dateLabel && (
                    <div className={styles.dateChip}>
                        <Icon icon="solar:calendar-minimalistic-linear" width={13} height={13} />
                        <span>{dateLabel}</span>
                    </div>
                )}
            </div>

            {task.description && (
                <p className={styles.description}>{task.description}</p>
            )}

            {tags.length > 0 && (
                <div className={styles.tags}>
                    {tags.map((tag) => (
                        <TagPill key={tag.id} tag={tag} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default TaskCard;
