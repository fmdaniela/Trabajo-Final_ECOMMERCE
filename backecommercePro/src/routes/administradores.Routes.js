import { Router } from 'express';
import {
  createAdministrador,
  getAdministradores,
  getAdministradorById,
  updateAdministrador,
  deleteAdministrador,
  restoreAdministrador
} from '../controllers/administradores.Controller.js';

import { protect, authorize } from '../middleware/auth.middleware.js';

import { 
  validateIdParam, 
  handleValidationErrors 
} from '../middleware/validation.js';

const router = Router();

// // ================= PROTECCIÓN GENERAL =================
// // Todas las rutas requieren autenticación de ADMINISTRADOR
// router.use(protect('ADMINISTRADOR'));

// // ================= RUTAS =================
// // POST /api/administradores - Crear nuevo (SOLO SUPERADMIN)
// router.post('/', authorize('SUPERADMIN'), createAdministrador);

// // GET /api/administradores - Listar todos (ADMIN y SUPERADMIN)
// router.get('/', authorize('ADMIN','SUPERADMIN'), getAdministradores);

// // GET /api/administradores/:id - Obtener por ID (ADMIN y SUPERADMIN)
// router.get('/:id', authorize('ADMIN','SUPERADMIN'), validateIdParam, handleValidationErrors, getAdministrador);

// // PUT /api/administradores/:id - Actualizar (ADMIN y SUPERADMIN)
// router.put('/:id', authorize('ADMIN','SUPERADMIN'), validateIdParam, handleValidationErrors, updateAdministrador);

// // DELETE /api/administradores/:id - Eliminar (SOLO SUPERADMIN)
// router.delete('/:id', authorize('SUPERADMIN'), validateIdParam, handleValidationErrors, deleteAdministrador);

// // PATCH /api/administradores/:id/restore - Restaurar (ADMIN y SUPERADMIN)
// router.patch('/:id', authorize('ADMIN','SUPERADMIN'), validateIdParam, handleValidationErrors, restoreAdministrador);


/* Rutas para probar */
router.get('/', handleValidationErrors, getAdministradores);
router.get('/:id', validateIdParam('id'), handleValidationErrors, getAdministradorById);
router.post('/', handleValidationErrors, createAdministrador);
router.put('/:id', validateIdParam('id'), handleValidationErrors, updateAdministrador);
router.delete('/:id', validateIdParam('id'), handleValidationErrors, deleteAdministrador);
router.patch('/:id/restore', validateIdParam('id'), restoreAdministrador);

export default router;
