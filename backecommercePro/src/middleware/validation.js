import { body, param, query, validationResult } from 'express-validator';

// ===== Validaciones para registro/login de Usuario =====
export const validateUsuarioCreate = [
  body('nombre')
    .notEmpty().withMessage('El nombre es requerido')
    .isLength({ min: 2, max: 50 }).withMessage('El nombre debe tener entre 2 y 50 caracteres'),
  body('apellido')
    .notEmpty().withMessage('El apellido es requerido')
    .isLength({ min: 2, max: 50 }).withMessage('El apellido debe tener entre 2 y 50 caracteres'),
  body('email')
    .isEmail().withMessage('Debe ser un email válido')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  // body('telefono')
  //   .notEmpty().withMessage('El teléfono es requerido')
  //   .isMobilePhone('es-AR').withMessage('Debe ser un teléfono válido de Argentina')
];


export const validateUsuarioLogin = [
  body('email').isEmail().withMessage('Debe ser un email válido'),
  body('password').notEmpty().withMessage('La contraseña es requerida')
];

export const validateUsuarioUpdate = [
  body('nombre')
    .optional()
    .isLength({ min: 2, max: 50 }).withMessage('El nombre debe tener entre 2 y 50 caracteres'),
  body('apellido')
    .optional()
    .isLength({ min: 2, max: 50 }).withMessage('El apellido debe tener entre 2 y 50 caracteres'),
  body('email')
    .optional()
    .isEmail().withMessage('Debe ser un email válido')
    .normalizeEmail(),
  body('password')
    .optional()
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('idRol')
    .optional()
    .isInt({ min: 1 }).withMessage('El rol debe ser un número entero positivo')
];

// ===== Validaciones para registro/login de Administrador =====
export const validateAdminRegister = [
  body('nombre')
    .notEmpty().withMessage('El nombre es requerido')
    .isLength({ min: 2, max: 50 }).withMessage('El nombre debe tener entre 2 y 50 caracteres'),
  body('apellido')
    .notEmpty().withMessage('El apellido es requerido')
    .isLength({ min: 2, max: 50 }).withMessage('El apellido debe tener entre 2 y 50 caracteres'),
  body('email')
    .isEmail().withMessage('Debe ser un email válido')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('idRol')
    .isInt({ min: 1 }).withMessage('El rol debe ser un número entero positivo')
];

export const validateAdminLogin = [
  body('email').isEmail().withMessage('Debe ser un email válido'),
  body('password').notEmpty().withMessage('La contraseña es requerida')
];

// ===== Validación de ID para rutas =====
export const validateIdParam = [
  param('id').isInt({ min: 1 }).withMessage('El ID debe ser un número entero positivo')
];

// ===== Validación de paginación (opcional) =====
export const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('La página debe ser un número entero positivo'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('El límite debe ser un número entre 1 y 100')
];

// ===== Validación para Productos =====
export const validateProductoCreate = [
  body('nombre')
    .notEmpty().withMessage('El nombre es requerido')
    .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  body('precio')
    .isFloat({ min: 0 }).withMessage('El precio debe ser un número mayor o igual a 0'),
  body('stock')
    .isInt({ min: 0 }).withMessage('El stock debe ser un número entero mayor o igual a 0'),
  body('categoriaId')
    .optional()
    .isInt({ min: 1 }).withMessage('El ID de categoría debe ser un número entero positivo'),
  body('descripcion')
    .optional()
    .isLength({ max: 1000 }).withMessage('La descripción no puede exceder 1000 caracteres')
];

export const validateProductoUpdate = [
  body('nombre')
    .optional()
    .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  body('precio')
    .optional()
    .isFloat({ min: 0 }).withMessage('El precio debe ser un número mayor o igual a 0'),
  body('stock')
    .optional()
    .isInt({ min: 0 }).withMessage('El stock debe ser un número entero mayor o igual a 0'),
  body('categoriaId')
    .optional()
    .isInt({ min: 1 }).withMessage('El ID de categoría debe ser un número entero positivo'),
  body('descripcion')
    .optional()
    .isLength({ max: 1000 }).withMessage('La descripción no puede exceder 1000 caracteres')
];

// ===== Validación para Categorías =====
export const validateCategoriaCreate = [
  body('nombre')
    .notEmpty().withMessage('El nombre es requerido')
    .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  body('descripcion')
    .optional()
    .isLength({ max: 1000 }).withMessage('La descripción no puede exceder 1000 caracteres')
];

export const validateCategoriaUpdate = [
  body('nombre')
    .optional()
    .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  body('descripcion')
    .optional()
    .isLength({ max: 1000 }).withMessage('La descripción no puede exceder 1000 caracteres')
];

// ===== Validación para Roles: (Es simple porque solo hay nombre y descripción)=====
export const validateRolCreate = [
  body('nombre')
    .notEmpty().withMessage('El nombre del rol es requerido')
    .isLength({ min: 2, max: 50 }).withMessage('El nombre del rol debe tener entre 2 y 50 caracteres'),
  body('descripcion')
    .optional()
    .isLength({ max: 200 }).withMessage('La descripción no puede exceder 200 caracteres')
];

export const validateRolUpdate = [
  body('nombre')
    .optional()
    .isLength({ min: 2, max: 50 }).withMessage('El nombre del rol debe tener entre 2 y 50 caracteres'),
  body('descripcion')
    .optional()
    .isLength({ max: 200 }).withMessage('La descripción no puede exceder 200 caracteres')
];


// Middleware para capturar errores de validación
export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }
    next();
};
