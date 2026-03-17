import { supabase } from '../../../services/supabase.config';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const taskService = {
    /**
     * Gets tasks from KiorApi passing Supabase auth token
     */
    async getTasks(params = {}) {
        // 1. Get current session/token from Supabase
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !session) {
            return { data: null, error: sessionError || new Error('No active session') };
        }

        const { page = 1, limit = 8 } = params;
        const queryParams = new URLSearchParams({ page, limit }).toString();

        try {
            // 2. Fetch data from our API with token in Authorization header
            const response = await fetch(`${API_URL}/tasks?${queryParams}`, {
                headers: {
                    'Authorization': `Bearer ${session.access_token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return { data, error: null };
        } catch (error) {
            console.error('Error fetching tasks via API:', error);
            return { data: null, error };
        }
    },

    async getTasksByDate(date) {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !session) {
            return { data: null, error: sessionError || new Error('No active session') };
        }

        try {
            const response = await fetch(`${API_URL}/tasks/search/date?date=${date}`, {
                headers: {
                    'Authorization': `Bearer ${session.access_token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return { data, error: null };
        } catch (error) {
            console.error('Error fetching tasks by date:', error);
            return { data: null, error };
        }
    },

    async createTask(taskData) {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !session) return { data: null, error: sessionError || new Error('No auth session') };

        try {
            const response = await fetch(`${API_URL}/tasks`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session.access_token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(taskData)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || 'Error al crear la tarea');
            }

            const data = await response.json();
            return { data, error: null };
        } catch (error) {
            return { data: null, error };
        }
    },

    async createSubtask(taskId, subtaskData) {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !session) return { data: null, error: sessionError || new Error('No auth session') };

        try {
            const response = await fetch(`${API_URL}/tasks/${taskId}/subtasks`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session.access_token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(subtaskData)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || 'Error al crear la subtarea');
            }

            const data = await response.json();
            return { data, error: null };
        } catch (error) {
            return { data: null, error };
        }
    },

    async updateTask(taskId, updates) {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !session) return { data: null, error: sessionError || new Error('No auth session') };

        try {
            const response = await fetch(`${API_URL}/tasks/${taskId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${session.access_token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updates)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || 'Error al actualizar la tarea');
            }

            const data = await response.json();
            return { data, error: null };
        } catch (error) {
            return { data: null, error };
        }
    },

    async updateSubtask(subtaskId, updates) {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !session) return { data: null, error: sessionError || new Error('No auth session') };

        try {
            const response = await fetch(`${API_URL}/subtasks/${subtaskId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${session.access_token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updates)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || 'Error al actualizar la subtarea');
            }

            const data = await response.json();
            return { data, error: null };
        } catch (error) {
            return { data: null, error };
        }
    },

    async deleteSubtask(subtaskId) {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !session) return { data: null, error: sessionError || new Error('No auth session') };

        try {
            const response = await fetch(`${API_URL}/subtasks/${subtaskId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${session.access_token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || 'Error al eliminar la subtarea');
            }

            return { data: true, error: null };
        } catch (error) {
            return { data: null, error };
        }
    },

    async getDashboardSummary() {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !session) return { data: null, error: sessionError || new Error('No auth session') };

        try {
            const response = await fetch(`${API_URL}/dashboard`, {
                headers: {
                    'Authorization': `Bearer ${session.access_token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || 'Error al obtener el resumen');
            }

            const data = await response.json();
            return { data, error: null };
        } catch (error) {
            console.error('Error fetching dashboard summary:', error);
            return { data: null, error };
        }
    }
};
