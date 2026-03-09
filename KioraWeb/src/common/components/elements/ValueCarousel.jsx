import React, { useRef, useEffect } from 'react';
import styles from './ValueCarousel.module.css';

const ValueCarousel = ({ values, selectedValue, onChange, unit, className = "" }) => {
    const scrollRef = useRef(null);

    const handleScroll = () => {
        if (!scrollRef.current) return;
        const container = scrollRef.current;

        // Get dynamic height from CSS variable if available, else default to 60
        const style = getComputedStyle(container);
        const itemHeight = parseInt(style.getPropertyValue('--item-height')) || 60;

        const scrollIndex = Math.round(container.scrollTop / itemHeight);

        if (values[scrollIndex] !== undefined && values[scrollIndex] !== selectedValue) {
            onChange(values[scrollIndex]);
        }
    };

    // Auto-scroll to current value on mount or external change
    useEffect(() => {
        if (scrollRef.current) {
            const index = values.indexOf(selectedValue);
            if (index !== -1) {
                const style = getComputedStyle(scrollRef.current);
                const itemHeight = parseInt(style.getPropertyValue('--item-height')) || 60;

                const targetScroll = index * itemHeight;
                if (Math.abs(scrollRef.current.scrollTop - targetScroll) > 1) {
                    scrollRef.current.scrollTop = targetScroll;
                }
            }
        }
    }, [selectedValue, values]);

    return (
        <div className={`${styles.drumContainer} ${className}`}>
            <div
                className={styles.drum}
                ref={scrollRef}
                onScroll={handleScroll}
            >
                {/* Spacers allow the first and last items to be centered */}
                <div className={styles.spacer}></div>

                {values.map((v) => {
                    const isSelected = Number(selectedValue) === Number(v);
                    return (
                        <div
                            key={v}
                            className={`${styles.drumItem} ${isSelected ? styles.selected : ''}`}
                            data-selected={isSelected}
                        >
                            {v}
                        </div>
                    );
                })}

                <div className={styles.spacer}></div>
            </div>

            {unit && (
                <div className={styles.unitWrapper}>
                    <span className={styles.unit}>{unit}</span>
                </div>
            )}
        </div>
    );
};

export default ValueCarousel;
