import React, { useRef, useState, useEffect } from 'react';
import styles from './TaskDeck.module.css';

const BASE_HEIGHT = 45;
const MAX_HEIGHT = 110;
const RANGE = 120; // Rango de influencia en píxeles

const TaskDeck = ({ tasks }) => {
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
            const PADDING_LEFT = 16;
            const CARD_STEP = 60;  // px visibles por carta (paso de la ola)
            const CARD_WIDTH = 200; // ancho total de cada carta
            const xLocal = x - PADDING_LEFT;

            // El borde derecho real del último card
            const maxX = (tasks.length - 1) * CARD_STEP + CARD_WIDTH;

            if (xLocal < 0 || xLocal > maxX) {
                // Fuera del área real de las cartas (padding o espacio vacío a la derecha)
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
            <div className={styles.deckTitle}>Otras Tareas</div>
            <div
                className={styles.cardsWrapper}
                ref={wrapperRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            >
                {tasks.map((task, index) => {
                    return (
                        <DeckCard
                            key={task.id}
                            task={task}
                            index={index}
                            mousePos={mousePos}
                            deckColor={deckColor}
                            isActive={index === activeIndex}
                        />
                    );
                })}
            </div>
        </div>
    );
};

const DeckCard = ({ task, index, mousePos, deckColor, isActive }) => {
    const [height, setHeight] = useState(BASE_HEIGHT);

    useEffect(() => {
        // Cálculo matemático estable basado en el índice
        // Cada carta aporta 60px de ancho visible (200px - 140px de solapamiento)
        // El centro de la carta i es relativo al inicio del wrapper
        const cardCenterX = (index * 60) + 100;

        // Distancia horizontal al mouse
        const distX = Math.abs(mousePos.x - cardCenterX);

        // Solo activamos si el mouse está físicamente "dentro" del área de las cartas
        // El wrapper mide 140px, las cartas base miden 45px y están al fondo (y=95 a 140)
        // Permitimos un margen de tolerancia para que la transición sea fluida
        const isMouseOverCardArea = mousePos.y > (140 - MAX_HEIGHT - 20);

        if (distX < RANGE && isMouseOverCardArea) {
            // Suavizamos el crecimiento con una curva de coseno
            const normalizedDist = distX / RANGE;
            const cosWeight = (Math.cos(normalizedDist * Math.PI) + 1) / 2;

            // CurveWeight más suave para mayor fluidez entre cartas
            const curveWeight = isActive ? 1 : Math.pow(cosWeight, 1.5);

            // Factor de intensidad vertical
            const verticalProgress = Math.min(1, (mousePos.y - (140 - MAX_HEIGHT)) / (MAX_HEIGHT));
            const verticalWeight = Math.max(0, verticalProgress);

            const targetHeight = BASE_HEIGHT + (MAX_HEIGHT - BASE_HEIGHT) * curveWeight * verticalWeight;
            setHeight(targetHeight);
        } else {
            setHeight(BASE_HEIGHT);
        }
    }, [mousePos.x, mousePos.y, index]);

    const intensity = (height - BASE_HEIGHT) / (MAX_HEIGHT - BASE_HEIGHT);

    return (
        <div
            className={styles.deckCard}
            style={{
                backgroundColor: deckColor,
                // Mantener el orden natural: las cartas de la derecha siempre encima de las de la izquierda
                zIndex: index,
                height: `${height}px`,
                borderColor: `rgba(255, 255, 255, ${isActive ? 0.4 : 0.15})`
            }}
        >
            <span
                className={styles.taskTitle}
                style={{
                    // Mostramos el título inmediatamente cuando la carta es activa
                    opacity: isActive ? 1 : 0,
                    visibility: isActive ? 'visible' : 'hidden',
                    WebkitLineClamp: Math.floor((height - 30) / 20) || 1,
                    lineClamp: Math.floor((height - 30) / 20) || 1,
                    // Aseguramos que el texto no se extienda demasiado para no ser tapado por la siguiente carta
                    maxWidth: '120px'
                }}
            >
                {task.title}
            </span>
        </div>
    );
};

export default TaskDeck;
