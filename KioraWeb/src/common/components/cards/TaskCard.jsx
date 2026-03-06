import React from 'react';
import { Icon } from '@iconify/react';
import styles from './TaskCard.module.css';
import { useTag } from '../../../modules/dashboard/hooks/useTag';

// Formatea una fecha como "Mié 04 Mar"
const formatDate = (dateStr) => {
    if (!dateStr) return null;
    try {
        const pureDate = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;
        const [year, month, day] = pureDate.split('-').map(Number);

        if (isNaN(year) || isNaN(month) || isNaN(day)) return null;

        const date = new Date(year, month - 1, day);
        const dayName = date.toLocaleDateString('es-ES', { weekday: 'short' });
        const num = date.getDate().toString().padStart(2, '0');
        const monthShort = date.toLocaleDateString('es-ES', { month: 'short' });

        const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
        return `${cap(dayName)} ${num} ${cap(monthShort)}`;
    } catch (e) {
        return null;
    }
};

// Sub-componente que resuelve un tag por ID si no viene el nombre
export const TagPill = ({ tag }) => {
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
