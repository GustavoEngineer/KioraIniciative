import { supabase } from '../../../../../services/supabase.config';

/**
 * Service for communicating with Supabase Authentication API
 */
export const authService = {
    /**
     * Registra un nuevo usuario con correo y contraseña.
     * También permite guardar el nombre del usuario (u otros datos) en los `user_metadata`.
     * 
     * @param {string} email 
     * @param {string} password 
     * @param {string} fullName 
     * @returns {Promise<{data: any, error: any}>}
     */
    async registerUser(email, password, fullName) {
        // 1. Registro en Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                },
            },
        });

        if (authError) return { data: null, error: authError };

        // 2. Creación/Actualización explícita del perfil en la tabla 'profiles'
        // Usamos upsert para evitar errores 409 si ya existe un trigger en la DB que lo cree.
        const { error: profileError } = await supabase
            .from('profiles')
            .upsert([
                {
                    id: authData.user.id,
                    full_name: fullName,
                    updated_at: new Date().toISOString()
                }
            ]);

        if (profileError) {
            console.error('Error al crear perfil:', profileError);
            // Podríamos decidir si fallar el registro o no. Por ahora retornamos el error de perfil.
            return { data: authData, error: profileError };
        }

        return { data: authData, error: null };
    },

    /**
     * Inicia sesión con correo y contraseña y verifica la existencia del perfil.
     * 
     * @param {string} email 
     * @param {string} password 
     * @returns {Promise<{data: any, error: any}>}
     */
    async loginUser(email, password) {
        // 1. Autenticación en Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (authError) return { data: null, error: authError };

        // 2. Verificación de existencia en la tabla 'profiles'
        const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authData.user.id)
            .single();

        if (profileError) {
            if (profileError.code === 'PGRST116') {
                return {
                    data: { user: authData.user, session: authData.session },
                    error: { message: "Usuario autenticado pero perfil no encontrado en la base de datos.", status: 404 }
                };
            }
            return { data: null, error: profileError };
        }

        return { data: { user: authData.user, session: authData.session, profile: profileData }, error: null };
    },

    /**
     * Cierra la sesión del usuario actual.
     */
    async logoutUser() {
        const { error } = await supabase.auth.signOut();
        return { error };
    }
};
