/**
 * Middleware global para el manejo de errores.
 * Captura excepciones no controladas y las formatea según
 * la estructura estándar de errores definida en la documentación.
 */
const errorHandler = (err, req, res, next) => {
    console.error(`[Error] ${err.message}`, err.stack);

    // Si el error ya tiene el formato esperado, lo usamos
    const statusCode = err.statusCode || 500;

    const errorResponse = {
        error: err.name || "Error interno del servidor",
        code: err.code || "INTERNAL_SERVER_ERROR",
        details: err.details || { message: err.message }
    };

    res.status(statusCode).json(errorResponse);
};

module.exports = errorHandler;
