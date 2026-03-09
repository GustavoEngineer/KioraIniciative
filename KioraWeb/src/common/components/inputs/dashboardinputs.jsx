import React from 'react';
import { Icon } from '@iconify/react';
import styles from './dashboardinputs.module.css';

export const DashInput = ({ className = "", ...props }) => (
    <input className={`${styles.input} ${className}`} {...props} />
);

export const DashTextArea = ({ className = "", ...props }) => (
    <textarea className={`${styles.textarea} ${className}`} {...props} />
);

export const DashSelect = ({ children, className = "", ...props }) => (
    <select className={`${styles.select} ${className}`} {...props}>
        {children}
    </select>
);

export const DashRange = ({ className = "", ...props }) => (
    <input type="range" className={`${styles.range} ${className}`} {...props} />
);

export const DashToggle = ({ active, label, onToggle, className = "" }) => (
    <div
        className={`${styles.toggleWrapper} ${active ? styles.toggleActive : ''} ${className}`}
        onClick={onToggle}
    >
        <span className={styles.toggleLabel}>{label || (active ? 'Active' : 'Inactive')}</span>
        <div className={styles.toggleTrack}>
            <div className={styles.toggleThumb}></div>
        </div>
    </div>
);

export const DashDaySelector = ({ selectedDays = [], onSelect, className = "" }) => {
    const days = [
        { id: 'mon', label: 'Mon' },
        { id: 'tue', label: 'Tue' },
        { id: 'wed', label: 'Wed' },
        { id: 'thu', label: 'Thu' },
        { id: 'fri', label: 'Fri' },
        { id: 'sat', label: 'Sat' },
        { id: 'sun', label: 'Sun' },
    ];

    const toggleDay = (dayId) => {
        const newSelected = selectedDays.includes(dayId)
            ? selectedDays.filter(d => d !== dayId)
            : [...selectedDays, dayId];
        onSelect(newSelected);
    };

    return (
        <div className={`${styles.daySelector} ${className}`}>
            {days.map(day => (
                <button
                    key={day.id}
                    type="button"
                    className={`${styles.dayBtn} ${selectedDays.includes(day.id) ? styles.dayBtnActive : ''}`}
                    onClick={() => toggleDay(day.id)}
                >
                    {day.label}
                </button>
            ))}
        </div>
    );
};

export const DashOptionCard = ({
    title,
    description,
    icon,
    badge,
    selected,
    dark,
    onClick,
    className = ""
}) => (
    <div
        className={`
            ${styles.optionCard} 
            ${selected ? styles.optionCardSelected : ''} 
            ${dark ? styles.optionCardDark : ''} 
            ${className}
        `}
        onClick={onClick}
    >
        {icon && (
            <div className={styles.optionIcon}>
                <Icon icon={icon} width={24} />
            </div>
        )}
        <div className={styles.optionContent}>
            <div className={styles.optionHeader}>
                <h4>{title}</h4>
                {badge && <span className={styles.optionBadge}>{badge}</span>}
            </div>
            {description && <p>{description}</p>}
        </div>
        <div className={styles.optionCheck}>
            {selected && <Icon icon={dark ? "solar:check-read-linear" : "solar:check-circle-bold"} width={16} />}
        </div>
    </div>
);
