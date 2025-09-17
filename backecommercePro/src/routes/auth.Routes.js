import { Router } from 'express';
import passport from '../config/passport.js';
import jwt from 'jsonwebtoken';
import {
  registerUsuario,
  loginUsuario,
  loginAdmin,
  refreshToken,
} from '../controllers/Auth.Controller.js';

import { protect, authorize } from '../middleware/auth.middleware.js';
import {
  validateUsuarioCreate,
  validateUsuarioLogin,
  validateAdminLogin,
  handleValidationErrors
} from '../middleware/validation.js';

const router = Router();

// ================= AUTENTICACIÓN LOCAL =================

// Registro y Login
router.post('/registerUsuario', validateUsuarioCreate, handleValidationErrors, registerUsuario);
router.post('/loginUsuario', validateUsuarioLogin, handleValidationErrors, loginUsuario);

// Login administrador
router.post('/loginAdmin', validateAdminLogin, handleValidationErrors, loginAdmin);

// Refresh Token unificado
router.post('/refresh-token', refreshToken);

/// ================= GOOGLE OAUTH =================
router.get('/google',
  passport.authenticate('google', { 
    scope: ['profile', 'email'] 
  })
);

router.get('/google/callback',
  (req, res, next) => {
    passport.authenticate('google', { session: false }, (err, user, info) => {
      if (err) {
        return res.status(500).json({ 
          success: false, 
          message: 'Error en autenticación Google' 
        });
      }
      if (!user) {
        return res.status(401).json({ 
          success: false, 
          message: info?.message || 'Autenticación fallida' 
        });
      }
      req.user = user;
      next();
    })(req, res, next);
  },
  (req, res) => {
    try {
      // Generar tokens
      const accessToken = jwt.sign(
        { 
          id: req.user.id, 
          email: req.user.email,
          rol: req.user.rol.codigo,
          tipo: 'USUARIO'
        }, 
        process.env.JWT_SECRET,
        { 
          expiresIn: '15m' 
        }
      );

      const refreshToken = jwt.sign(
        { 
          id: req.user.id, 
          email: req.user.email,
          rol: req.user.rol.codigo, 
          tipo: 'USUARIO'
        },
        process.env.JWT_REFRESH_SECRET,
        { 
          expiresIn: '7d' 
        }
      );
      
      res.json({
        success: true,
        message: 'Autenticación con Google exitosa',
        data: {
          accessToken,
          refreshToken,
          user: {
            id: req.user.id,
            email: req.user.email,
            nombre: req.user.nombre,
            apellido: req.user.apellido,
            rol: req.user.rol.codigo,
            tipo: 'USUARIO',
            proveedor: req.user.proveedor
          }
        }
      });
    } catch (error) {
      console.error('Error generando token JWT:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error interno del servidor' 
      });
    }
  }
);

// ================= RUTAS PROTEGIDAS =================

router.get('/perfil', protect('USUARIO'), authorize('USER'), (req, res) => {
  res.json({ success: true, data: req.usuario });
});

router.get('/dashboard', protect('ADMINISTRADOR'), authorize('ADMIN', 'SUPERADMIN'), (req, res) => {
  res.json({ success: true, data: req.administrador });
});

export default router;













































// import { Router } from 'express';
// import {
//   registerUsuario,
//   loginUsuario,
//   registerAdmin,
//   loginAdmin,
//   refreshToken
// } from '../controllers/Auth.Controller.js';

// import { protect, authorize } from '../middleware/auth.middleware.js';
// import {
//   validateUsuarioCreate,
//   validateUsuarioLogin,
//   validateAdminRegister,
//   validateAdminLogin,
//   handleValidationErrors
// } from '../middleware/validation.js';

// const router = Router();

// // ================= USUARIO =================

// // Registro, Login y Refresh Token usuario
// router.post('/registerUsuario', validateUsuarioCreate, handleValidationErrors, registerUsuario); //POST http://localhost:3000/api/auth/registerUsuario
// router.post('/loginUsuario', validateUsuarioLogin, handleValidationErrors, loginUsuario); //POST http://localhost:3000/api/auth/loginUsuario

// // Ruta protegida de ejemplo (perfil)
// router.get('/perfil', protect('USUARIO'), authorize('USER'), (req, res) => {
//     res.json({ success: true, data: req.usuario }); //GET http://localhost:3000/api/auth/perfil
//   });

// // ================= ADMINISTRADOR =================

// // Registro, Login y Refresh Token administrador
// router.post('/registerAdmin', validateAdminRegister, handleValidationErrors, registerAdmin); //POST http://localhost:3000/api/auth/registerAdmin
// router.post('/loginAdmin', validateAdminLogin, handleValidationErrors,loginAdmin); //POST http://localhost:3000/api/auth/loginAdmin

// // Ruta protegida de ejemplo (dashboard)
// router.get('/dashboard', protect('ADMINISTRADOR'), authorize('ADMIN', 'SUPERADMIN'), (req, res) => {
//     res.json({ success: true, data: req.administrador }); //GET http://localhost:3000/api/auth/dashboard
//   });

// // ================= REFRESH TOKEN UNIFICADO =================
// router.post('/refresh-token', refreshToken); //POST http://localhost:3000/api/auth/refresh-token


// export default router;



// /*
// Con esto:
// El frontend envía el refreshToken en el body (no importa si es usuario o admin).
// El controlador unificado determina si es USUARIO o ADMINISTRADOR a partir del payload del token y devuelve los nuevos tokens.
// */