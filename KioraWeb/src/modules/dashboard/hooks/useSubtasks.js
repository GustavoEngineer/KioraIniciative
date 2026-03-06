import { useState, useEffect } from 'react';
import { supabase } from '../../../services/supabase.config';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const useSubtasks = (taskId) => {
    const [subtasks, setSubtasks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchSubtasks = async () => {
        if (!taskId) {
            setSubtasks([]);
            return;
        }
        setIsLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) { setIsLoading(false); return; }

        try {
            const res = await fetch(`${API_URL}/tasks/${taskId}/subtasks`, {
                headers: { 'Authorization': `Bearer ${session.access_token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setSubtasks(data || []);
            }
        } catch {
            setSubtasks([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSubtasks();
    }, [taskId]);

    return { subtasks, isLoading, refetchSubtasks: fetchSubtasks };
};
