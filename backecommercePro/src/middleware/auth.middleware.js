import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';
import Administrador from '../models/Administrador.js';
import Rol from '../models/Rol.js';

// Middleware para proteger rutas usando Bearer token
export const protect = (tipo = 'USUARIO') => {
  return async (req, res, next) => {
    try {
      if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')) {
        return res.status(401).json({ success: false, message: 'No autorizado, no hay token' });
      }

      // Obtener token del header
      const token = req.headers.authorization.split(' ')[1];

      // Verificar el token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Adjuntar el usuario/administrador y su rol al request
      let entidad;
      if (tipo === 'USUARIO') {
        entidad = await Usuario.findByPk(decoded.id, {
          attributes: { exclude: ['password'] },
          include: { model: Rol, as: 'rol', attributes: ['codigo'] }
        });
        req.usuario = entidad;
      } else if (tipo === 'ADMINISTRADOR') {
        entidad = await Administrador.findByPk(decoded.id, {
          attributes: { exclude: ['password'] },
          include: { model: Rol, as: 'rol', attributes: ['codigo'] }
        });
        req.administrador = entidad;
      }

      if (!entidad) return res.status(401).json({ success: false, message: `${tipo} no encontrado` });

      next();
    } catch (err) {
      if (err.name === 'TokenExpiredError') return res.status(401).json({ success: false, message: 'Token expirado' });
      return res.status(401).json({ success: false, message: 'No autorizado, token inválido' });
    }
  };
};

// Middleware para autorizar por roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    const entidad = req.usuario || req.administrador;
    if (!entidad || !entidad.rol || !roles.includes(entidad.rol.codigo)) {
      return res.status(403).json({ success: false, message: 'No tienes permiso para realizar esta acción' });
    }
    next();
  };
};
