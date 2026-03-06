import React, { useRef, useState } from 'react';
import styles from './TaskDeck.module.css';
import { Typography } from '../../../common/components/typography/typography';

const CARD_STEP = 60;   // px visibles por carta (paso de la ola)
const CARD_WIDTH = 200; // ancho total de cada carta
const PADDING_LEFT = 16;

const TaskDeck = ({ tasks, onTaskSelect }) => {
    const wrapperRef = useRef(null);
    const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
    const [activeIndex, setActiveIndex] = useState(-1);
    const deckColor = '#2a2931';

    if (!tasks || tasks.length === 0) return null;

    const handleMouseMove = (e) => {
        if (!wrapperRef.current) return;
        const rect = wrapperRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setMousePos({ x, y });

        if (y > 60) {
            const xLocal = x - PADDING_LEFT;

            // El borde derecho real del último card
            const maxX = (tasks.length - 1) * CARD_STEP + CARD_WIDTH;

            if (xLocal < 0 || xLocal > maxX) {
                setActiveIndex(-1);
            } else {
                let index = Math.floor(xLocal / CARD_STEP);
                if (index >= tasks.length) index = tasks.length - 1;
                setActiveIndex(index);
            }
        } else {
            setActiveIndex(-1);
        }
    };

    const handleMouseLeave = () => {
        setMousePos({ x: -1000, y: -1000 });
        setActiveIndex(-1);
    };

    return (
        <div className={styles.deckContainer}>
            <div
                className={styles.cardsWrapper}
                ref={wrapperRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            >
                {/* tasks.map((task, index) => (
                    <ViewTask
                        key={task.id}
                        task={task}
                        index={index}
                        mousePos={mousePos}
                        deckColor={deckColor}
                        isActive={index === activeIndex}
                        onSelect={onTaskSelect}
                    />
                )) */}
            </div>
        </div>
    );
};

export default TaskDeck;
