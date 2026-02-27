import React from 'react';
import styles from './typography.module.css';

const variants = {
    h1: styles.title,
    h2: styles.title,
    h3: styles.title,
    body: styles.body,
    caption: styles.body
};

export const Typography = ({ variant = 'body', children, className = "" }) => {
    // Elegimos el tag HTML según la variante para mantener el SEO/Accesibilidad
    const Tag = variant.startsWith('h') ? variant : 'p';

    return (
        <Tag className={`${variants[variant] || styles.body} ${className}`}>
            {children}
        </Tag>
    );
};
