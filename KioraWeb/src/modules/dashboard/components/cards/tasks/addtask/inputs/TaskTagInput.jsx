import React from 'react';
import styles from './TaskTagInput.module.css';

const TaskTagInput = ({ 
    tagSearch, 
    onTagChange, 
    filteredTags, 
    showSuggestions, 
    setShowSuggestions, 
    selectTag, 
    isLoadingTags 
}) => {
    return (
        <div className={styles.fieldGroup}>
            <label className={styles.label}>
                <div className={styles.labelTitle}>
                    Etiqueta <span className={styles.requiredAsterisk}>*</span>
                </div>
                {tagSearch && filteredTags.length === 0 && (
                    <div className={styles.tagHelper}>
                        Nueva etiqueta
                    </div>
                )}
            </label>
            <div className={styles.tagSearchWrapper}>
                <input
                    type="text"
                    placeholder="Busca o crea una etiqueta..."
                    value={tagSearch}
                    onChange={onTagChange}
                    onFocus={() => setShowSuggestions(true)}
                    className={styles.input}
                />
                {showSuggestions && (isLoadingTags || filteredTags.length > 0) && (
                    <div className={styles.suggestions}>
                        {isLoadingTags ? (
                            <div className={styles.suggestionItem}>Cargando etiquetas...</div>
                        ) : (
                            filteredTags.map(tag => (
                                <div 
                                    key={tag.id} 
                                    className={styles.suggestionItem}
                                    onClick={() => selectTag(tag)}
                                >
                                    {tag.name}
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TaskTagInput;
