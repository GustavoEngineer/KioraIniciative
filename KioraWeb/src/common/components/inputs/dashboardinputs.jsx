import React from 'react';
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
