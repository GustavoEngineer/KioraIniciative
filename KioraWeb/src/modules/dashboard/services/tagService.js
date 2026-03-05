import { supabase } from '../../../services/supabase.config';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const getAuthHeaders = async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session) throw error || new Error('No active session');
    return {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json'
    };
};

export const tagService = {
    /**
     * Obtiene todos los tags del usuario
     */
    async getTags() {
        try {
            const headers = await getAuthHeaders();
            const response = await fetch(`${API_URL}/tags`, { headers });
            if (!response.ok) {
                const err = await response.json().catch(() => ({}));
                throw new Error(err.error || `HTTP ${response.status}`);
            }
            return { data: await response.json(), error: null };
        } catch (error) {
            return { data: null, error };
        }
    },

    /**
     * Obtiene un tag por su ID
     */
    async getTagById(id) {
        try {
            const headers = await getAuthHeaders();
            const response = await fetch(`${API_URL}/tags/${id}`, { headers });
            if (!response.ok) {
                const err = await response.json().catch(() => ({}));
                throw new Error(err.error || `HTTP ${response.status}`);
            }
            return { data: await response.json(), error: null };
        } catch (error) {
            return { data: null, error };
        }
    }
};
