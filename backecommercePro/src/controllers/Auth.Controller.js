import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';
import Administrador from '../models/Administrador.js';
import Rol from '../models/Rol.js';

// ===== REGISTRO PÚBLICO (solo usuarios) =====
export const registerUsuario = async (req, res) => {
  console.log('Datos recibidos:', req.body);
  try {
    const { nombre, apellido, email, password } = req.body;

    // ✅ ELIMINADO hasheo manual (lo hace el hook automáticamente)
    const nuevoUsuario = await Usuario.create({
      nombre,
      apellido,
      email,
      password, // ✅ Sequelize hook se encarga del hasheo
      proveedor: 'local', // ✅ Nuevo campo requerido
      idRol: 3, // USER
      activo: true,
    });

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: { id: nuevoUsuario.id, email: nuevoUsuario.email },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error en registro', error: err.message });
  }
};

// ===== LOGIN USUARIOS (clientes - tienda) =====
export const loginUsuario = async (req, res) => {
  try {
    const { email, password } = req.body;
    const usuario = await Usuario.findOne({
      where: { email },
      include: { model: Rol, as: 'rol', attributes: ['codigo'] },
    });

    if (!usuario) {
      return res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
    }

    // ✅ VERIFICAR si es usuario de Google (no puede login con password)
    if (usuario.proveedor !== 'local') {
      return res.status(401).json({ 
        success: false, 
        message: `Este usuario se registró con ${usuario.proveedor}. Use ese método para iniciar sesión.` 
      });
    }

    // ✅ USAR el nuevo método del modelo
    const isMatch = await usuario.validPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
    }

    const tokens = generateTokens(usuario, 'USUARIO');

    res.json({
      success: true,
      message: 'Inicio de sesión exitoso',
      data: { 
        ...tokens, 
        user: { 
          id: usuario.id, 
          email: usuario.email, 
          nombre: usuario.nombre, 
          rol: usuario.rol.codigo, 
          tipo: 'USUARIO',
          proveedor: usuario.proveedor
        } 
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error en login', error: err.message });
  }
};

// ===== LOGIN ADMINISTRADORES (panel admin) =====
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Administrador.findOne({
      where: { email },
      include: { model: Rol, as: 'rol', attributes: ['codigo'] },
    });

    if (!admin) {
      return res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
    }

    // ✅ Administradores SIEMPRE son 'local' (mantenemos bcrypt.compare)
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
    }

    const tokens = generateTokens(admin, 'ADMINISTRADOR');

    res.json({
      success: true,
      message: 'Inicio de sesión administrador exitoso',
      data: { 
        ...tokens, 
        user: { 
          id: admin.id, 
          email: admin.email, 
          nombre: admin.nombre, 
          rol: admin.rol.codigo, 
          tipo: 'ADMINISTRADOR' 
        } 
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error en login de administrador', error: err.message });
  }
};

// ===== GENERAR TOKENS =====
const generateTokens = (entidad, tipo) => {
  const payload = {
    id: entidad.id,
    email: entidad.email,
    rol: entidad.rol.codigo,
    tipo,
  };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { 
    expiresIn: '15m' 
  });

  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { 
    expiresIn: '7d' 
  });

  return { accessToken, refreshToken };
};

// ===== REFRESH TOKEN =====
export const refreshToken = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(401).json({ success: false, message: 'Token de refresco no proporcionado' });
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    let entidad, tipo;

    if (decoded.tipo === 'USUARIO') {
      entidad = await Usuario.findByPk(decoded.id, { 
        attributes: { exclude: ['password'] }, 
        include: { model: Rol, as: 'rol', attributes: ['codigo'] } 
      });
      tipo = 'USUARIO';
    } else if (decoded.tipo === 'ADMINISTRADOR') {
      entidad = await Administrador.findByPk(decoded.id, { 
        attributes: { exclude: ['password'] }, 
        include: { model: Rol, as: 'rol', attributes: ['codigo'] } 
      });
      tipo = 'ADMINISTRADOR';
    }

    if (!entidad) {
      return res.status(404).json({ success: false, message: `${tipo} no encontrado` });
    }

    const tokens = generateTokens(entidad, tipo);
    
    res.json({
      success: true,
      message: 'Token refrescado exitosamente',
      data: { 
        ...tokens, 
        user: { 
          id: entidad.id, 
          email: entidad.email, 
          nombre: entidad.nombre, 
          rol: entidad.rol.codigo, 
          tipo 
        } 
      },
    });
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ success: false, message: 'Token inválido' });
    }
    res.status(500).json({ success: false, message: 'Error al refrescar token', error: err.message });
  }
};

























































// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import Usuario from '../models/Usuario.js';
// import Administrador from '../models/Administrador.js';
// import Rol from '../models/Rol.js';

// const SALT_ROUNDS = 10;

// // ===== Registro =====
// export const registerUsuario = async (req, res) => {
//   console.log('Datos recibidos:', req.body);
//   try {
//     const { nombre, apellido, email, password, } = req.body;

//     const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

//     // Siempre asigna rol USER (ej: idRol = 1)
//     const nuevoUsuario = await Usuario.create({
//       nombre,
//       apellido,
//       email,
//       password: hashedPassword,
//       idRol: 3, // USER
//       activo: true,
//     });

//     res.status(201).json({
//       success: true,
//       message: 'Usuario registrado exitosamente',
//       data: { id: nuevoUsuario.id, email: nuevoUsuario.email },
//     });
//   } catch (err) {
//     res.status(500).json({ success: false, message: 'Error en registro', error: err.message });
//   }
// };

// export const registerAdmin = async (req, res) => {
//   try {
//     const { nombre, apellido, email, password, idRol } = req.body;

//     // Solo permitir SUPERADMIN (1) o ADMIN (2) 
//     if (![1, 2].includes(idRol)) {
//       return res.status(400).json({ success: false, message: 'Rol no permitido' });
//     }

//     const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

//     const nuevoAdmin = await Administrador.create({
//       nombre,
//       apellido,
//       email,
//       password: hashedPassword,
//       idRol,
//       activo: true,
//     });

//     res.status(201).json({
//       success: true,
//       message: 'Administrador registrado exitosamente',
//       data: { id: nuevoAdmin.id, email: nuevoAdmin.email },
//     });
//   } catch (err) {
//     res.status(500).json({ success: false, message: 'Error en registro de administrador', error: err.message });
//   }
// };

// // ===== Login =====
// export const loginUsuario = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const usuario = await Usuario.findOne({
//       where: { email },
//       include: { model: Rol, as: 'rol', attributes: ['codigo'] },
//     });
//     // console.log para debug
//     console.log("Usuario encontrado:", usuario);
//     console.log("Password enviado:", password);

//     if (!usuario) return res.status(401).json({ success: false, message: 'Credenciales incorrectas' });

//     const isMatch = await bcrypt.compare(password, usuario.password);
//     if (!isMatch) return res.status(401).json({ success: false, message: 'Credenciales incorrectas' });

//     const tokens = generateTokens(usuario, 'USUARIO');

//     res.json({
//       success: true,
//       message: 'Inicio de sesión exitoso',
//       data: { ...tokens, user: { id: usuario.id, email: usuario.email, nombre: usuario.nombre, rol: usuario.rol.codigo, tipo: 'USUARIO' } },
//     });
//   } catch (err) {
//     res.status(500).json({ success: false, message: 'Error en login', error: err.message });
//   }
// };

// export const loginAdmin = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const admin = await Administrador.findOne({
//       where: { email },
//       include: { model: Rol, as: 'rol', attributes: ['codigo'] },
//     });

//     if (!admin) return res.status(401).json({ success: false, message: 'Credenciales incorrectas' });

//     const isMatch = await bcrypt.compare(password, admin.password);
//     if (!isMatch) return res.status(401).json({ success: false, message: 'Credenciales incorrectas' });

//     const tokens = generateTokens(admin, 'ADMINISTRADOR');

//     res.json({
//       success: true,
//       message: 'Inicio de sesión administrador exitoso',
//       data: { ...tokens, user: { id: admin.id, email: admin.email, nombre: admin.nombre, rol: admin.rol.codigo, tipo: 'ADMINISTRADOR' } },
//     });
//   } catch (err) {
//     res.status(500).json({ success: false, message: 'Error en login de administrador', error: err.message });
//   }
// };

// // ===== Generar tokens =====
// const generateTokens = (entidad, tipo) => {
//   const payload = {
//     id: entidad.id,
//     email: entidad.email,
//     rol: entidad.rol.codigo,
//     tipo,
//   };

//   const accessToken = jwt.sign(payload, 
//     process.env.JWT_SECRET, { 
//     expiresIn: '15m' });

//   const refreshToken = jwt.sign(payload, 
//     process.env.JWT_REFRESH_SECRET, { 
//     expiresIn: '7d' });

//   return { accessToken, refreshToken };
// };

// // ===== Refresh Token =====
// export const refreshToken = async (req, res) => {
//   try {
//     const { token } = req.body;
//     if (!token) return res.status(401).json({ success: false, message: 'Token de refresco no proporcionado' });

//     const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
//     let entidad, tipo;

//     if (decoded.tipo === 'USUARIO') {
//       entidad = await Usuario.findByPk(decoded.id, { attributes: { exclude: ['password'] }, include: { model: Rol, as: 'rol', attributes: ['codigo'] } });
//       tipo = 'USUARIO';
//     } else if (decoded.tipo === 'ADMINISTRADOR') {
//       entidad = await Administrador.findByPk(decoded.id, { attributes: { exclude: ['password'] }, include: { model: Rol, as: 'rol', attributes: ['codigo'] } });
//       tipo = 'ADMINISTRADOR';
//     }

//     if (!entidad) return res.status(404).json({ success: false, message: `${tipo} no encontrado` });

//     const tokens = generateTokens(entidad, tipo);
//     res.json({
//       success: true,
//       message: 'Token refrescado exitosamente',
//       data: { ...tokens, user: { id: entidad.id, email: entidad.email, nombre: entidad.nombre, rol: entidad.rol.codigo, tipo } },
//     });
//   } catch (err) {
//     if (err instanceof jwt.JsonWebTokenError) return res.status(401).json({ success: false, message: 'Token inválido' });
//     res.status(500).json({ success: false, message: 'Error al refrescar token', error: err.message });
//   }
// };
