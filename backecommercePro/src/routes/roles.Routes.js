import { Router } from 'express';
import {
  getRoles,
  getRolById,
  createRol,
  updateRol,
  deleteRol,
  restoreRol   // <-- opcional
} from '../controllers/roles.Controller.js';

import { protect, authorize } from '../middleware/auth.middleware.js';
import {
  validateRolCreate,
  validateRolUpdate,
  validateIdParam,
  handleValidationErrors
} from '../middleware/validation.js';

const router = Router();

// // ================= PROTECCIÓN GENERAL =================
// // Todas las rutas requieren autenticación
// router.use(protect('ADMINISTRADOR'));

// // ================= RUTAS =================

// // GET /api/roles - Listar todos (ADMIN y SUPERADMIN)
// router.get('/', authorize('ADMIN','SUPERADMIN'), getRoles);

// // GET /api/roles/:id - Obtener por ID (ADMIN y SUPERADMIN)
// router.get('/:id', authorize('ADMIN','SUPERADMIN'), validateIdParam, handleValidationErrors, getRolById);

// // POST /api/roles - Crear nuevo rol (SOLO SUPERADMIN)
// router.post('/', authorize('SUPERADMIN'), validateRolCreate, handleValidationErrors, createRol);

// // PUT /api/roles/:id - Actualizar rol (ADMIN y SUPERADMIN)
// router.put('/:id', authorize('ADMIN','SUPERADMIN'), validateIdParam, validateRolUpdate, handleValidationErrors, updateRol);

// // DELETE /api/roles/:id - Eliminar rol (SOLO SUPERADMIN)
// router.delete('/:id', authorize('SUPERADMIN'), validateIdParam, handleValidationErrors, deleteRol);

// PATCH / api/roles/:id/restore - Opcional: restaurar un rol eliminado (SOLO SUPERADMIN)
// router.patch('/:id/restore', authorize('SUPERADMIN'), validateIdParam, handleValidationErrors, restoreRol);


// ================= RUTAS SIN PROTECCIÓN =================

// GET /api/roles - Listar todos
router.get('/', getRoles); //http://localhost:3000/api/roles

// GET /api/roles/:id - Obtener por ID
router.get('/:id', validateIdParam, handleValidationErrors, getRolById); //http://localhost:3000/api/roles/1

// POST /api/roles - Crear nuevo rol
router.post('/', validateRolCreate, handleValidationErrors, createRol); //http://localhost:3000/api/roles

// PUT /api/roles/:id - Actualizar rol
router.put('/:id', validateIdParam, validateRolUpdate, handleValidationErrors, updateRol); //http://localhost:3000/api/roles/1

// DELETE /api/roles/:id - Eliminar rol
router.delete('/:id', validateIdParam, handleValidationErrors, deleteRol); //http://localhost:3000/api/roles/1

// Opcional: restaurar un rol eliminado
router.patch('/:id/restore', restoreRol); //http://localhost:3000/api/roles/1/restore

export default router;
