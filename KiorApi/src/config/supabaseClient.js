const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.warn('Faltan variables de entorno SUPABASE_URL y/o SUPABASE_ANON_KEY');
}

/**
 * Crea un cliente de Supabase configurado con el token JWT del usuario
 * para que se apliquen las políticas de Row Level Security (RLS).
 * 
 * @param {Object} req - El objeto de request de Express
 * @returns {import('@supabase/supabase-js').SupabaseClient | null}
 */
const getSupabaseClient = (req) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }

    const token = authHeader.split(' ')[1];

    // Crear una instancia de cliente para esta petición específica
    const supabase = createClient(supabaseUrl, supabaseKey, {
        global: {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    });

    return supabase;
};

// Cliente global sin contexto de usuario (usar solo para auth inicial. no tiene RLS de usuario)
const globalSupabase = createClient(supabaseUrl || '', supabaseKey || '');

module.exports = {
    getSupabaseClient,
    globalSupabase
};
