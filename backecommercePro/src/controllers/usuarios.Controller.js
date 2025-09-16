import { Usuario, Rol } from '../models/index.js';
import { Op } from 'sequelize';

// ===== Obtener todos los usuarios (con paginación) =====
export const getUsuarios = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, sort = 'fechaCreacion', direction = 'DESC', activo } = req.query;
    const offset = (page - 1) * limit;

    // === Construimos el where dinámico ===
    const whereClause = {};
    if (activo === 'true') whereClause.activo = true;
    else if (activo === 'false') whereClause.activo = false;
    // si viene undefined o 'all', no ponemos filtro, trae todos

    if (search) {
      whereClause[Op.or] = [
        { nombre: { [Op.like]: `%${search}%` } },
        { apellido: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
    }

    const usuarios = await Usuario.findAndCountAll({
      where: whereClause,
      include: [
        { model: Rol, as: 'rol', attributes: ['id', 'codigo', 'descripcion'] }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sort, direction.toUpperCase()]]
    });

    res.json({
      success: true,
      data: usuarios.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(usuarios.count / limit),
        totalItems: usuarios.count,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error en getUsuarios:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: 'No se pudieron obtener los usuarios'
    });
  }
};


// ===== Obtener un usuario por ID =====
export const getUsuarioById = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await Usuario.findOne({
      where: { id, activo: true },
      include: [
        { model: Rol, as: 'rol', attributes: ['id', 'codigo', 'descripcion'] }
      ]
    });

    if (!usuario) {
      return res.status(404).json({ success: false, error: 'Usuario no encontrado' });
    }

    res.json({ success: true, data: usuario });
  } catch (error) {
    console.error('Error en getUsuarioById:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: 'No se pudo obtener el usuario'
    });
  }
};

// ===== Crear un nuevo usuario =====
export const createUsuario = async (req, res) => {
  try {
    const { nombre, apellido, email, password, idRol } = req.body;

    // Validar que el rol exista
    const rol = await Rol.findByPk(idRol);
    if (!rol) return res.status(400).json({ success: false, error: 'Rol no encontrado' });

    const nuevoUsuario = await Usuario.create({
      nombre,
      apellido,
      email,
      password,
      idRol,
      activo: true
    });

    const usuarioCompleto = await Usuario.findByPk(nuevoUsuario.id, {
      include: [{ model: Rol, as: 'rol', attributes: ['id', 'codigo', 'descripcion'] }]
    });

    res.status(201).json({
      success: true,
      data: usuarioCompleto,
      message: 'Usuario creado exitosamente'
    });
  } catch (error) {
    console.error('Error en createUsuario:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: 'No se pudo crear el usuario'
    });
  }
};

// ===== Actualizar un usuario =====
export const updateUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findOne({ where: { id, activo: true } });

    if (!usuario) return res.status(404).json({ success: false, error: 'Usuario no encontrado' });

    // Validar idRol si se envía
    if (req.body.idRol) {
      const rol = await Rol.findByPk(req.body.idRol);
      if (!rol) return res.status(400).json({ success: false, error: 'Rol no encontrado' });
    }

    await usuario.update(req.body);

    const usuarioActualizado = await Usuario.findByPk(id, {
      include: [{ model: Rol, as: 'rol', attributes: ['id', 'codigo', 'descripcion'] }]
    });

    res.json({
      success: true,
      data: usuarioActualizado,
      message: 'Usuario actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error en updateUsuario:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: 'No se pudo actualizar el usuario'
    });
  }
};

// ===== Soft delete de un usuario =====
export const deleteUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findOne({ where: { id, activo: true } });

    if (!usuario) return res.status(404).json({ success: false, error: 'Usuario no encontrado' });

    await usuario.update({ activo: false });

    res.json({
      success: true,
      message: 'Usuario eliminado exitosamente (soft delete)'
    });
  } catch (error) {
    console.error('Error en deleteUsuario:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: 'No se pudo eliminar el usuario'
    });
  }
};

// ===== Restaurar usuario =====
export const restoreUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findOne({ where: { id } });

    if (!usuario) return res.status(404).json({ success: false, error: 'Usuario no encontrado' });
    if (usuario.activo) return res.status(400).json({ success: false, message: 'El usuario ya está activo' });

    await usuario.update({ activo: true });

    const usuarioRestaurado = await Usuario.findByPk(id, {
      include: [{ model: Rol, as: 'rol', attributes: ['id', 'codigo', 'descripcion'] }]
    });

    res.json({
      success: true,
      data: usuarioRestaurado,
      message: 'Usuario restaurado exitosamente'
    });
  } catch (error) {
    console.error('Error en restoreUsuario:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: 'No se pudo restaurar el usuario'
    });
  }
};
