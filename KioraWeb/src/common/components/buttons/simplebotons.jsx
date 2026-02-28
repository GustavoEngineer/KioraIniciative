import React from 'react';
import { Icon } from '@iconify/react';
import styles from './simplebotons.module.css';

export const SimpleButton = ({
    text,
    icon,
    onClick,
    type = "button",
    variant = "primary",
    className = "",
    ...props
}) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`${styles.button} ${styles[variant]} ${className}`}
            {...props}
        >
            {icon && <Icon icon={icon} className={styles.icon} />}
            <span className={styles.text}>{text}</span>
        </button>
    );
};
