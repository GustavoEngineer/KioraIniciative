import React, { useState } from 'react';
import { Typography } from '../typography';
import styles from './Card.module.css';

const Card = ({ children, title, className = '' }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className={`${styles.card} ${isHovered ? styles.hovered : ''} ${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {title && (
                <Typography variant="body" className={styles.title}>
                    {title}
                </Typography>
            )}
            {children}
        </div>
    );
};

export default Card;
