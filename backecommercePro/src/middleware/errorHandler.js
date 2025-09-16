// Middleware para manejo centralizado de errores y rutas no encontradas

/**
 * Middleware para manejo centralizado de errores
 * Captura errores comunes (Sequelize, conexión, etc.) y responde en formato JSON.
 */

export const errorHandler = (err, req, res, next) => {
    console.error('Error capturado por middleware:', err);

    // 🔹 Error de validación de Sequelize
    if (err.name === 'SequelizeValidationError') {
        const errors = err.errors.map(error => ({
            field: error.path,
            message: error.message
        }));
        return res.status(400).json({
            success: false,
            error: 'Error de validación',
            details: errors
        });
    }

    // 🔹 Error de clave única
    if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({
            success: false,
            error: 'Conflicto de datos',
            message: 'Ya existe un registro con estos datos'         
        });
    }

    // 🔹 Error de clave foránea    
    if (err.name === 'SequelizeForeignKeyConstraintError') {
        return res.status(400).json({
            success: false,
            error: 'Error de referencia',
            message: 'Referencia a datos inexistentes'
        });
    }

    // 🔹 Error de conexión a la base de datos
    if (err.name === 'SequelizeConnectionError') {
        return res.status(503).json({
            success: false,
            error: 'Error de conexión',
            message: 'No se pudo conectar a la base de datos'
        });
    }

    // 🔹 Error genérico por defecto
    res.status(err.status || 500).json({
        success: false,
        error: 'Error interno del servidor',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Algo salió mal'
    });
};

// Middleware para manejar rutas no encontradas (404)

export const notFound = (req, res, next) => {
    res.status(404).json({
        success: false,
        error: 'Ruta no encontrada',
        message: `La ruta ${req.originalUrl} no existe`
    });
};
