import React, { useState } from 'react';
import styles from './Card.module.css';

const Card = ({ children, className = '' }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className={`${styles.card} ${isHovered ? styles.hovered : ''} ${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {children}
        </div>
    );
};

export default Card;
