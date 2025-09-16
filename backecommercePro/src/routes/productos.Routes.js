import { Router } from 'express';
import {
  getProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto
} from '../controllers/productos.Controller.js';

import { protect, authorize } from '../middleware/auth.middleware.js';
import { 
  validateIdParam, 
  validateProductoCreate, 
  validateProductoUpdate, 
  handleValidationErrors 
} from '../middleware/validation.js';

const router = Router();

// ================= PROTECCIÓN GENERAL =================
// Todas las rutas requieren autenticación de ADMINISTRADOR
router.use(protect('ADMINISTRADOR'));

// ================= RUTAS =================

// GET /api/productos - Listar todos los productos (ADMIN y SUPERADMIN)
router.get('/', authorize('ADMIN','SUPERADMIN'), getProductos);

// GET /api/productos/:id - Obtener producto por ID (ADMIN y SUPERADMIN)
router.get('/:id', authorize('ADMIN','SUPERADMIN'), validateIdParam, handleValidationErrors, getProductoById);

// POST /api/productos - Crear producto (ADMIN y SUPERADMIN)
router.post('/', authorize('ADMIN','SUPERADMIN'), validateProductoCreate, handleValidationErrors, createProducto);

// PUT /api/productos/:id - Actualizar producto (ADMIN y SUPERADMIN)
router.put('/:id', authorize('ADMIN','SUPERADMIN'), validateIdParam, validateProductoUpdate, handleValidationErrors, updateProducto);

// DELETE /api/productos/:id - Eliminar producto (SOLO SUPERADMIN)
router.delete('/:id', authorize('SUPERADMIN'), validateIdParam, handleValidationErrors, deleteProducto);

export default router;
