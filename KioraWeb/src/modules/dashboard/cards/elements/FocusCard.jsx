import React, { useState } from 'react';
import DashboardCard from '../../../../common/components/cards/DashboardCard';
import ValueCarousel from '../../../../common/components/elements/ValueCarousel';
import styles from './FocusCard.module.css';

const FocusCard = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const [selectedHour, setSelectedHour] = useState(4);

    return (
        <DashboardCard title="Enfoque">
            <div className={styles.content}>
                <ValueCarousel
                    values={hours}
                    selectedValue={selectedHour}
                    onChange={setSelectedHour}
                    unit="HRS"
                />
            </div>
        </DashboardCard>
    );
};

export default FocusCard;
