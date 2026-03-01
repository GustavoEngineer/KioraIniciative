import React from 'react';
import Card from '../../../../../common/components/cards/Card';
import { Typography } from '../../../../../common/components/typography';
import styles from './ProfileInfoCard.module.css';

const ProfileInfoCard = () => {
    return (
        <Card title="Información de perfil" className={styles.profileInfoCard}>
            <div className={styles.content}>
                <Typography variant="body" className={styles.placeholder}>
                    Próximamente
                </Typography>
            </div>
        </Card>
    );
};

export default ProfileInfoCard;
