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

router.post('/', createAdministrador);
router.get('/', getAdministradores);
router.get('/', getAdministradorById);
router.put('/:id', updateAdministrador);
router.delete('/:id', deleteAdministrador);
router.put('/:id/restore', restoreAdministrador);

export default router;
