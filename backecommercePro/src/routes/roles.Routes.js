import { Router } from 'express';
import {
  getRoles,
  getRolById,
  createRol,
  updateRol,
  deleteRol,
  restoreRol,
  toggleActivo   
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
// router.get('/:id', authorize('ADMIN','SUPERADMIN'), validateIdParam('id'), handleValidationErrors, getRolById);

// // POST /api/roles - Crear nuevo rol (SOLO SUPERADMIN)
// router.post('/', authorize('SUPERADMIN'), validateRolCreate, handleValidationErrors, createRol);

// // PUT /api/roles/:id - Actualizar rol (ADMIN y SUPERADMIN)
// router.put('/:id', authorize('ADMIN','SUPERADMIN'), validateIdParam('id'), validateRolUpdate, handleValidationErrors, updateRol);

// // DELETE /api/roles/:id - Eliminar rol (SOLO SUPERADMIN)
// router.delete('/:id', authorize('SUPERADMIN'), validateIdParam('id'), handleValidationErrors, deleteRol);

// //PATCH / api/roles/:id/restore - Opcional: restaurar un rol eliminado (SOLO SUPERADMIN)
// router.patch('/:id/restore', authorize('SUPERADMIN'), validateIdParam('id'), handleValidationErrors, restoreRol);

// // PATCH /api/roles/:id/toggle - Activar/Desactivar
// router.patch("/:id/toggle", authorize('ADMIN','SUPERADMIN'), validateIdParam("id"), handleValidationErrors, toggleActivo);


// ================= RUTAS SIN PROTECCIÓN =================

// GET /api/roles - Listar todos
router.get('/', getRoles); //http://localhost:3000/api/roles
// GET /api/roles/:id - Obtener por ID
router.get('/:id', validateIdParam('id'), handleValidationErrors, getRolById); //http://localhost:3000/api/roles/1
// POST /api/roles - Crear nuevo rol
router.post('/', validateRolCreate, handleValidationErrors, createRol); //http://localhost:3000/api/roles
// PUT /api/roles/:id - Actualizar rol
router.put('/:id', validateIdParam('id'), validateRolUpdate, handleValidationErrors, updateRol); //http://localhost:3000/api/roles/1
// DELETE /api/roles/:id - Eliminar rol
router.delete('/:id', validateIdParam('id'), handleValidationErrors, deleteRol); //http://localhost:3000/api/roles/1
// Opcional: restaurar un rol eliminado
router.patch('/:id/restore', validateIdParam('id'), handleValidationErrors, restoreRol); //http://localhost:3000/api/roles/1/restore
// PATCH /api/roles/:id/toggle - Activar/Desactivar
router.patch("/:id/toggle", validateIdParam("id"), handleValidationErrors, toggleActivo);
export default router;
