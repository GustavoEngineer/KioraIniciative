import React from 'react';
import styles from './typography.module.css';

const variants = {
    // Nuevas clases definidas en CSS
    'home-title': styles.homeTitle,
    'home-body': styles.homeBody,
    'dashboard-title': styles.dashboardTitle,
    'dashboard-body': styles.dashboardBody,

    // Fallbacks para compatibilidad temporal
    h1: styles.homeTitle,
    h2: styles.dashboardTitle,
    h3: styles.dashboardTitle,
    body: styles.homeBody,
    caption: styles.homeBody
};

export const Typography = ({ variant = 'home-body', children, className = "" }) => {
    // Determinamos un Tag razonable si es de texto grande (title o header)
    let Tag = 'p';
    if (variant.includes('title') || variant.startsWith('h')) {
        Tag = variant.startsWith('h') ? variant : 'h1';
    }

    return (
        <Tag className={`${variants[variant] || styles.homeBody} ${className}`}>
            {children}
        </Tag>
    );
};
