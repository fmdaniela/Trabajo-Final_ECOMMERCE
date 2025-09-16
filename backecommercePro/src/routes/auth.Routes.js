import { Router } from 'express';
import {
  registerUsuario,
  loginUsuario,
  registerAdmin,
  loginAdmin,
  refreshToken
} from '../controllers/Auth.Controller.js';

import { protect, authorize } from '../middleware/auth.middleware.js';
import {
  validateUsuarioCreate,
  validateUsuarioLogin,
  validateAdminRegister,
  validateAdminLogin,
  handleValidationErrors
} from '../middleware/validation.js';

const router = Router();

// ================= USUARIO =================

// Registro, Login y Refresh Token usuario
router.post('/registerUsuario', validateUsuarioCreate, handleValidationErrors, registerUsuario); //POST http://localhost:3000/api/auth/registerUsuario
router.post('/loginUsuario', validateUsuarioLogin, handleValidationErrors, loginUsuario); //POST http://localhost:3000/api/auth/loginUsuario

// Ruta protegida de ejemplo (perfil)
router.get('/perfil', protect('USUARIO'), authorize('USER'), (req, res) => {
    res.json({ success: true, data: req.usuario }); //GET http://localhost:3000/api/auth/perfil
  });

// ================= ADMINISTRADOR =================

// Registro, Login y Refresh Token administrador
router.post('/registerAdmin', validateAdminRegister, handleValidationErrors, registerAdmin); //POST http://localhost:3000/api/auth/registerAdmin
router.post('/loginAdmin', validateAdminLogin, handleValidationErrors,loginAdmin); //POST http://localhost:3000/api/auth/loginAdmin

// Ruta protegida de ejemplo (dashboard)
router.get('/dashboard', protect('ADMINISTRADOR'), authorize('ADMIN', 'SUPERADMIN'), (req, res) => {
    res.json({ success: true, data: req.administrador }); //GET http://localhost:3000/api/auth/dashboard
  });

// ================= REFRESH TOKEN UNIFICADO =================
router.post('/refresh-token', refreshToken); //POST http://localhost:3000/api/auth/refresh-token


export default router;



/*
Con esto:
El frontend envía el refreshToken en el body (no importa si es usuario o admin).
El controlador unificado determina si es USUARIO o ADMINISTRADOR a partir del payload del token y devuelve los nuevos tokens.
*/