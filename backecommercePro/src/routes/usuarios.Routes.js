import { Router } from 'express';
import { 
  getUsuarios, 
  getUsuarioById, 
  createUsuario, 
  updateUsuario, 
  deleteUsuario,
  restoreUsuario
} from '../controllers/usuarios.Controller.js';

import { protect, authorize } from '../middleware/auth.middleware.js';

import { 
  validateUsuarioCreate, 
  validateUsuarioUpdate, 
  validateIdParam, 
  validatePagination, 
  handleValidationErrors 
} from '../middleware/validation.js';

const router = Router();

// // Obtener todos los usuarios (solo ADMIN o SUPERADMIN)
// router.get('/', protect, authorize('ADMIN', 'SUPERADMIN'), validatePagination, handleValidationErrors, getUsuarios);

// // Obtener un usuario por ID (todos los roles autenticados)
// router.get( '/:id', protect, validateIdParam, handleValidationErrors, getUsuarioById);

// // Crear un nuevo usuario (solo SUPERADMIN)
// router.post('/', protect, authorize('ADMIN', 'SUPERADMIN'), validateUsuarioCreate, handleValidationErrors, createUsuario);

// // Actualizar un usuario (autenticado)
// router.put('/:id', protect, authorize('ADMIN', 'SUPERADMIN'), validateIdParam, validateUsuarioUpdate, handleValidationErrors, updateUsuario);

// // Eliminar (soft delete) un usuario ( solo SUPERADMIN)
// router.delete('/:id', protect, authorize('SUPERADMIN'), validateIdParam, handleValidationErrors, deleteUsuario);

// // Restaurar un usuario (solo ADMIN o SUPERADMIN)
// router.patch('/:id', protect, authorize('SUPERADMIN'), validateIdParam, handleValidationErrors, restoreUsuario);

router.get('/', validatePagination, handleValidationErrors, getUsuarios);
router.get('/:id', validateIdParam('id'), handleValidationErrors, getUsuarioById);
router.post('/', validateUsuarioCreate, handleValidationErrors, createUsuario);
router.put('/:id', validateIdParam('id'), validateUsuarioUpdate, handleValidationErrors, updateUsuario);
router.delete('/:id', validateIdParam('id'), handleValidationErrors, deleteUsuario);
router.patch('/:id/restore', validateIdParam('id'), restoreUsuario);

export default router;













// import { Router } from 'express';
// import {
//   getTodosLosUsuarios,
//   getUsuariosActivos,
//   getUsuariosInactivos,
//   getUsuarioById,
//   createUsuario,
//   updateUsuario,
//   deleteUsuario,
//   buscarPorEmailOTelefono,
//   buscarPorPais,
//   contarUsuariosPorPais,
//   // actualizarPerfil
// } from '../controllers/usuarios.Controller.js';

// const router = Router();

// // CRUD básico
// router.get('/todos', getTodosLosUsuarios); // GET /api/usuarios/todos

// // Búsquedas y estadísticas
// router.get('/buscar', buscarPorEmailOTelefono); // GET /api/usuarios/buscar?email=algo (gmail.com)/ ?telefono=algo
// router.get('/pais/:pais', buscarPorPais); // GET /api/usuarios/pais/Argentina
// router.get('/estadisticas/paises', contarUsuariosPorPais); // GET /api/usuarios/estadisticas/paises

// router.get('/activos', getUsuariosActivos); // GET /api/usuarios/activos
// router.get('/inactivos', getUsuariosInactivos); // GET /api/usuarios/inactivos
// router.get('/:id', getUsuarioById); // GET /api/usuarios/:id
// router.post('/', createUsuario);   // POST /api/usuarios
// router.put('/:id', updateUsuario); // PUT /api/usuarios/:id
// // router.put('/:perfil', actualizarPerfil); // PUT /api/usuarios/perfil
// router.delete('/:id', deleteUsuario); // DELETE /api/usuarios/:id

// export default router;
