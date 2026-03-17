import { useState, useEffect } from 'react';
import { taskService } from '../services/taskService';

export const useTasks = (initialPage = 1) => {
    const [tasks, setTasks] = useState([]);
    const [stats, setStats] = useState(null); // Nuevo estado para estadísticas globales
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(initialPage);
    const [totalTasks, setTotalTasks] = useState(0);

    const fetchTasks = async (targetPage = page) => {
        setIsLoading(true);
        setError(null);

        // Fetch paginated tasks and global stats in parallel
        const [tasksRes, statsRes] = await Promise.all([
            taskService.getTasks({ page: targetPage, limit: 8 }),
            taskService.getDashboardSummary()
        ]);

        if (tasksRes.error) {
            setError(tasksRes.error.message || 'Ocurrió un error al cargar las tareas');
        } else {
            setTasks(tasksRes.data?.tasks || []);
            setTotalTasks(tasksRes.data?.total || 0);
            setPage(targetPage);
        }

        if (!statsRes.error) {
            setStats(statsRes.data);
        }

        setIsLoading(false);
    };

    useEffect(() => {
        fetchTasks(page);
    }, [page]);

    return {
        tasks,
        stats, // Exportar estadísticas
        isLoading,
        error,
        page,
        totalTasks,
        setPage,
        refetchTasks: () => fetchTasks(page)
    };
};
