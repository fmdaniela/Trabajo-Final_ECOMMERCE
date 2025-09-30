import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Usuario from '../models/Usuario.js';
import Administrador from '../models/Administrador.js';
import Rol from '../models/Rol.js';

// ===== REGISTRO PÚBLICO (solo usuarios) =====
export const registerUsuario = async (req, res) => {
  try {
    const { nombre, apellido, email, password } = req.body;

    const nuevoUsuario = await Usuario.create({
      nombre,
      apellido,
      email,
      password, // Sequelize hook se encarga del hash
      proveedor: 'local',
      idRol: 3, // USER
      activo: true
    });

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: { id: nuevoUsuario.id, email: nuevoUsuario.email }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error en registro', error: err.message });
  }
};

// ===== LOGIN USUARIO (clientes - tienda) =====
export const loginUsuario = async (req, res) => {
  try {
    const { email, password } = req.body;
    const usuario = await Usuario.findOne({
      where: { email },
      include: { model: Rol, as: 'rol', attributes: ['codigo'] }
    });

    if (!usuario) {
      return res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
    }

    if (usuario.password) {
      const isMatch = await usuario.validPassword(password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
      }
    } else {
      return res.status(401).json({
        success: false,
        message: `Usuario registrado vía ${usuario.proveedor}, no tiene contraseña. Use ese método.`
      });
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
      }
    });

  } catch (err) {
    res.status(500).json({ success: false, message: 'Error en login', error: err.message });
  }
};

// ===== LOGIN SOCIAL (Google) =====

export const loginSocial = async (req, res) => {
  try {
    const { email, nombre, proveedor, googleId } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email es requerido" });
    }

    let usuario = await Usuario.findOne({ where: { email }, include: [{ model: Rol, as: "rol" }] });

    if (!usuario) {
      usuario = await Usuario.create({
        email,
        nombre,
        proveedor,
        proveedorId: googleId, // guardamos el sub de Google
        password: "SOCIAL_" + Date.now(),
        idRol: 3, // USER default
      });
    }

    const rolCodigo = usuario.rol?.codigo || "USER";

    const accessToken = jwt.sign(
      { id: usuario.id, email: usuario.email, rol: rolCodigo, tipo: "USUARIO" },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: usuario.id, email: usuario.email, rol: rolCodigo, tipo: "USUARIO" },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      data: {
        user: {
          id: usuario.id,
          email: usuario.email,
          nombre: usuario.nombre,
          rol: rolCodigo,
          proveedor,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.error("❌ Error en loginSocial:", error);
    res.status(500).json({ success: false, message: "Error en login social" });
  }
};

// ===== LOGIN ADMINISTRADORES (panel admin) =====
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Administrador.findOne({
      where: { email },
      include: { model: Rol, as: 'rol', attributes: ['codigo'] }
    });

    if (!admin) {
      return res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
    }

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
      }
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
    rol: entidad.rol?.codigo || 'USER',
    tipo
  };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

  return { accessToken, refreshToken };
};

// ===== REFRESH TOKEN =====
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken  } = req.body;
    if (!refreshToken) return res.status(401).json({ success: false, message: 'Token de refresco no proporcionado' });

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
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

    if (!entidad) return res.status(404).json({ success: false, message: `${tipo} no encontrado` });

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
          rol: entidad.rol?.codigo || 'USER',
          tipo
        }
      }
    });

  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ success: false, message: 'Token inválido' });
    }
    res.status(500).json({ success: false, message: 'Error al refrescar token', error: err.message });
  }
};
