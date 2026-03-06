import React, { useState } from 'react';
import styles from './TagEditor.module.css';
import { Typography } from '../../../../../common/components/typography/typography';
import { Icon } from '@iconify/react';
import { DashInput } from '../../../../../common/components/inputs/dashboardinputs';

const TagEditor = ({ isVisible, currentTagId, tags, onSelectTag, onCreateTag, onClose }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredTags = tags?.filter(tag =>
        tag.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    const handleCreateClick = () => {
        if (searchTerm.trim()) {
            onCreateTag(searchTerm.trim());
            setSearchTerm('');
        }
    };

    return (
        <div className={`${styles.container} ${isVisible ? styles.visible : ''}`}>
            <div className={styles.header}>
                <Typography variant="dashboard-title" className={styles.title}>Etiquetas</Typography>
                <button className={styles.closeBtn} onClick={onClose}>
                    <Icon icon="solar:close-square-linear" />
                </button>
            </div>

            <div className={styles.searchBox}>
                <DashInput
                    placeholder="Buscar o crear etiqueta..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    icon="solar:magnifer-linear"
                    autoFocus={isVisible}
                />
            </div>

            <div className={styles.tagList}>
                {filteredTags.length > 0 ? (
                    filteredTags.map(tag => (
                        <div
                            key={tag.id}
                            className={`${styles.tagItem} ${currentTagId === tag.id ? styles.selected : ''}`}
                            onClick={() => onSelectTag(tag)}
                        >
                            <Icon icon="solar:tag-linear" className={styles.tagIcon} />
                            <span className={styles.tagName}>{tag.name}</span>
                            {currentTagId === tag.id && (
                                <Icon icon="solar:check-read-linear" className={styles.checkIcon} />
                            )}
                        </div>
                    ))
                ) : (
                    searchTerm.trim() ? (
                        <div className={styles.createAction} onClick={handleCreateClick}>
                            <Icon icon="solar:add-circle-linear" />
                            <span>Crear etiqueta "{searchTerm}"</span>
                        </div>
                    ) : (
                        <div className={styles.emptyState}>
                            <Icon icon="solar:tag-broken" />
                            <p>No hay etiquetas disponibles</p>
                        </div>
                    )
                )}
            </div>

            <div className={styles.footer}>
                <button className={styles.clearBtn} onClick={() => onSelectTag(null)}>
                    Quitar etiqueta
                </button>
            </div>
        </div>
    );
};

export default TagEditor;
