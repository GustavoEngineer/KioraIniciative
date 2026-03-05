import { useState, useEffect } from 'react';
import { tagService } from '../services/tagService';

/**
 * Hook para obtener un tag por su ID
 */
export const useTag = (tagId) => {
    const [tag, setTag] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!tagId) return;

        const fetchTag = async () => {
            setIsLoading(true);
            setError(null);
            const { data, error } = await tagService.getTagById(tagId);
            if (error) {
                setError(error.message || 'Error al obtener el tag');
            } else {
                setTag(data);
            }
            setIsLoading(false);
        };

        fetchTag();
    }, [tagId]);

    return { tag, isLoading, error };
};

/**
 * Hook para obtener todos los tags del usuario
 */
export const useTags = () => {
    const [tags, setTags] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTags = async () => {
            setIsLoading(true);
            setError(null);
            const { data, error } = await tagService.getTags();
            if (error) {
                setError(error.message || 'Error al obtener los tags');
            } else {
                setTags(data || []);
            }
            setIsLoading(false);
        };

        fetchTags();
    }, []);

    return { tags, isLoading, error };
};
