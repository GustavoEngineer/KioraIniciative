import { useState, useEffect } from 'react';
import { taskService } from '../services/taskService';

export const useTasksByDate = (date) => {
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchTasksByDate = async () => {
        if (!date) return;

        setIsLoading(true);
        setError(null);

        // Formatear fecha a YYYY-MM-DD local
        const dateString = date instanceof Date
            ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
            : date;

        const { data, error } = await taskService.getTasksByDate(dateString);

        if (error) {
            setError(error.message || 'Ocurrió un error al cargar las tareas por fecha');
        } else {
            setTasks(data || []);
        }

        setIsLoading(false);
    };

    useEffect(() => {
        fetchTasksByDate();
    }, [date]);

    return {
        tasks,
        isLoading,
        error,
        refetch: fetchTasksByDate
    };
};
