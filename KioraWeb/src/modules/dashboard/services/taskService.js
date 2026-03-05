import { supabase } from '../../../services/supabase.config';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const taskService = {
    /**
     * Gets tasks from KiorApi passing Supabase auth token
     */
    async getTasks() {
        // 1. Get current session/token from Supabase
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !session) {
            return { data: null, error: sessionError || new Error('No active session') };
        }

        try {
            // 2. Fetch data from our API with token in Authorization header
            const response = await fetch(`${API_URL}/tasks`, {
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
    }
};
