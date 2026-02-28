import React from 'react';
import { Icon } from '@iconify/react';
import styles from './inputsmodel.module.css';

export const Input = ({ type = "text", placeholder = "", icon, value, onChange, className = "", ...props }) => {
    return (
        <div className={`${styles.inputWrapper} ${className}`}>
            {icon && <Icon icon={icon} className={styles.inputIcon} />}
            <input
                type={type}
                placeholder={placeholder}
                className={`${styles.inputField} ${icon ? styles.withIcon : ''}`}
                value={value}
                onChange={onChange}
                {...props}
            />
        </div>
    );
};
