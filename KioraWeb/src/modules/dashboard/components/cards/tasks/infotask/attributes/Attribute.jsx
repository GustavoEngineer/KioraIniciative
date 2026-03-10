import React from 'react';
import { Icon } from '@iconify/react';
import styles from './Attribute.module.css';

const Attribute = ({ icon, label, value, color, isMultiline, variant }) => {
    if (!value) return null;

    return (
        <div className={`${styles.attribute} ${isMultiline ? styles.multiline : ''} ${variant ? styles[variant] : ''}`}>
            <div className={styles.labelArea}>
                <Icon icon={icon} width={16} className={styles.icon} />
                <span className={styles.label}>{label}</span>
            </div>
            <div className={`${styles.valueWrapper} ${variant ? styles[`${variant}Value`] : ''}`}>
                <span className={styles.value} style={color ? { color } : {}}>
                    {value}
                </span>
            </div>
        </div>
    );
};

export default Attribute;
