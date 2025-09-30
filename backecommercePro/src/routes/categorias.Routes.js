import { Router } from 'express';
import {
  getCategorias,
  getCategoriaById,
  getProductosByCategoria,
  createCategoria,
  updateCategoria,
  deleteCategoria,
  restoreCategoria,
  getCategoriasPublic,
  getProductosByCategoriaPublic
} from '../controllers/categorias.Controller.js';

import { protect, authorize } from '../middleware/auth.middleware.js';

import { 
  validateCategoriaCreate,
  validateCategoriaUpdate,
  validateIdParam,
  handleValidationErrors
} from '../middleware/validation.js';

const router = Router();

// // ================= RUTAS PÚBLICAS =================
router.get('/public', getCategoriasPublic); //listado de categorías activas.
router.get('/public/:id/productos', getProductosByCategoriaPublic); //productos activos de esa categoría.


// // ================= PROTECCIÓN GENERAL =================
// router.use(protect('ADMINISTRADOR')); // todas requieren login de administrador

// // ================= RUTAS =================

// // GET /api/categorias - Listar todas (ADMIN y SUPERADMIN)
// router.get('/', authorize('ADMIN','SUPERADMIN'), getCategorias);

// // GET /api/categorias/:id - Obtener por ID (ADMIN y SUPERADMIN)
// router.get('/:id', authorize('ADMIN','SUPERADMIN'), validateIdParam, handleValidationErrors, getCategoriaById);

// // GET /api/categorias/:id/productos - Productos de categoría
// router.get('/:id/productos', authorize('ADMIN','SUPERADMIN'), validateIdParam, handleValidationErrors, getProductosByCategoria);

// // POST /api/categorias - Crear nuevo (ADMIN y SUPERADMIN)
// router.post('/', authorize('ADMIN','SUPERADMIN'), validateCategoriaCreate, handleValidationErrors, createCategoria);

// // PUT /api/categorias/:id - Actualizar (ADMIN y SUPERADMIN)
// router.put('/:id', authorize('ADMIN','SUPERADMIN'), validateIdParam, validateCategoriaUpdate, handleValidationErrors, updateCategoria);

// // DELETE /api/categorias/:id - Eliminar (SOLO SUPERADMIN)
// router.delete('/:id', authorize('SUPERADMIN'), validateIdParam, handleValidationErrors, deleteCategoria);

// Ruta para restaurar categoría (ADMIN y SUPERADMIN)
// router.put('/:id/restaurar', authorize('ADMIN','SUPERADMIN'), validateIdParam, handleValidationErrors, restoreCategoria);


// Después (temporalmente sin autorización):
router.get('/', getCategorias);
router.get('/:id', validateIdParam, handleValidationErrors, getCategoriaById);
router.get('/:id/productos', validateIdParam, handleValidationErrors, getProductosByCategoria);
router.post('/', validateCategoriaCreate, handleValidationErrors, createCategoria);
router.put('/:id', validateIdParam, validateCategoriaUpdate, handleValidationErrors, updateCategoria);
router.delete('/:id', validateIdParam, handleValidationErrors, deleteCategoria);
// Ruta para restaurar categoría
router.put('/:id/restaurar', validateIdParam, handleValidationErrors, restoreCategoria);


export default router;
