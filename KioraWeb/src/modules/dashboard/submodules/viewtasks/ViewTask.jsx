import React, { useState, useEffect } from 'react';
import styles from './ViewTask.module.css';

const BASE_HEIGHT = 45;
const MAX_HEIGHT = 110;
const RANGE = 120;

const ViewTask = ({ task, index, mousePos, deckColor, isActive, onSelect }) => {
    const [height, setHeight] = useState(BASE_HEIGHT);

    useEffect(() => {
        const cardCenterX = (index * 60) + 100;
        const distX = Math.abs(mousePos.x - cardCenterX);
        const isMouseOverCardArea = mousePos.y > (140 - MAX_HEIGHT - 20);

        if (distX < RANGE && isMouseOverCardArea) {
            const normalizedDist = distX / RANGE;
            const cosWeight = (Math.cos(normalizedDist * Math.PI) + 1) / 2;
            const curveWeight = isActive ? 1 : Math.pow(cosWeight, 1.5);
            const verticalProgress = Math.min(1, (mousePos.y - (140 - MAX_HEIGHT)) / (MAX_HEIGHT));
            const verticalWeight = Math.max(0, verticalProgress);
            const targetHeight = BASE_HEIGHT + (MAX_HEIGHT - BASE_HEIGHT) * curveWeight * verticalWeight;
            setHeight(targetHeight);
        } else {
            setHeight(BASE_HEIGHT);
        }
    }, [mousePos.x, mousePos.y, index, isActive]);

    return (
        <div
            className={styles.deckCard}
            style={{
                backgroundColor: deckColor,
                zIndex: index,
                height: `${height}px`,
                borderColor: `rgba(255, 255, 255, ${isActive ? 0.4 : 0.15})`
            }}
            onClick={() => onSelect && onSelect(task)}
        >
            <span
                className={styles.taskTitle}
                style={{
                    opacity: isActive ? 1 : 0,
                    visibility: isActive ? 'visible' : 'hidden',
                    WebkitLineClamp: Math.floor((height - 30) / 20) || 1,
                    lineClamp: Math.floor((height - 30) / 20) || 1,
                    maxWidth: '120px'
                }}
            >
                {task.title}
            </span>
        </div>
    );
};

export { BASE_HEIGHT, MAX_HEIGHT, RANGE };
export default ViewTask;
