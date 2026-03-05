import { useState, useEffect } from 'react';
import { taskService } from '../services/taskService';

export const useTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTasks = async () => {
        setIsLoading(true);
        setError(null);

        const { data, error } = await taskService.getTasks();

        if (error) {
            setError(error.message || 'Ocurrió un error al cargar las tareas');
        } else {
            setTasks(data || []);
        }

        setIsLoading(false);
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    return {
        tasks,
        isLoading,
        error,
        refetchTasks: fetchTasks
    };
};
