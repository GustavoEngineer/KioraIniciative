const { globalSupabase } = require('../config/supabaseClient');

/**
 * Middleware para validar el token JWT usando Supabase Auth.
 * Si el token es válido, inyecta la información del usuario en req.user
 */
const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            error: "No autenticado",
            code: "UNAUTHORIZED",
            details: { message: "Falta el token de autorización o el formato es incorrecto" }
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        // Validar el token con Supabase
        const { data: { user }, error } = await globalSupabase.auth.getUser(token);

        if (error || !user) {
            return res.status(401).json({
                error: "No autenticado",
                code: "UNAUTHORIZED",
                details: { message: "Token inválido o expirado" }
            });
        }

        // Añadir el usuario al request para uso posterior en controllers/services
        req.user = user;
        next();
    } catch (err) {
        next(err);
    }
};

module.exports = authMiddleware;
