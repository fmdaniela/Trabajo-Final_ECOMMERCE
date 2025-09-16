import { Rol } from '../models/index.js';
import { Op } from 'sequelize';

// ===== Obtener todos los roles con filtros y paginación =====
export const getRoles = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      activo,
      eliminado,
      sort = 'codigo',
      direction = 'ASC',
    } = req.query;

    const where = {};

    // Filtro de búsqueda
    if (search?.trim()) {
      where[Op.or] = [
        { codigo: { [Op.like]: `%${search}%` } },
        { descripcion: { [Op.like]: `%${search}%` } },
      ];
    }

    // Filtro eliminado
    if (eliminado === 'true') where.eliminado = true;
    else if (eliminado === 'false') where.eliminado = false;

    // Filtro activo
    if (activo === 'true') where.activo = true;
    else if (activo === 'false') {
      where.activo = false;
      // Evitar traer eliminados cuando pedimos solo inactivos
      if (!where.hasOwnProperty('eliminado')) where.eliminado = false;
    }

    const offset = (Number(page) - 1) * Number(limit);

    const { rows, count } = await Rol.findAndCountAll({
      where,
      order: [[sort, direction.toUpperCase() === 'DESC' ? 'DESC' : 'ASC']],
      limit: Number(limit),
      offset,
    });

    res.json({
      success: true,
      data: rows,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        totalItems: count,
        totalPages: Math.max(1, Math.ceil(count / Number(limit))),
      },
    });
  } catch (error) {
    console.error('Error en getRoles:', error);
    res.status(500).json({
      success: false,
      message: 'No se pudieron obtener los roles',
      error: 'Error interno del servidor',
    });
  }
};

// ===== Obtener un rol por ID =====
export const getRolById = async (req, res) => {
  try {
    const { id } = req.params;
    const rol = await Rol.findByPk(id);

    if (!rol) return res.status(404).json({ success: false, message: 'Rol no encontrado' });

    res.json({ success: true, data: rol });
  } catch (error) {
    console.error('Error en getRolById:', error);
    res.status(500).json({
      success: false,
      message: 'No se pudo obtener el rol',
      error: 'Error interno del servidor',
    });
  }
};

// ===== Crear un nuevo rol =====
export const createRol = async (req, res) => {
  try {
    const { nombre, descripcion, activo = true, eliminado = false } = req.body;

    // Verificar si ya existe un rol con ese código
    const rolExistente = await Rol.findOne({
      where: { codigo: nombre }
    });

    if (rolExistente) {
      return res.status(400).json({
        success: false,
        message: 'Rol ya existente. Si deseas, puedes restaurarlo desde los roles eliminados.'
      });
    }

    const nuevoRol = await Rol.create({
      codigo: nombre, // mapear nombre a codigo
      descripcion,
      activo,
      eliminado,
    });

    res.status(201).json({
      success: true,
      data: nuevoRol,
      message: 'Rol creado exitosamente',
    });
  } catch (error) {
    console.error('Error en createRol:', error);
    res.status(500).json({
      success: false,
      message: 'No se pudo crear el rol',
      error: 'Error interno del servidor',
    });
  }
};

// ===== Actualizar un rol =====
export const updateRol = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, activo, eliminado } = req.body;

    const rol = await Rol.findByPk(id);
    if (!rol) return res.status(404).json({ success: false, message: 'Rol no encontrado' });

    // Validación: no permitir que el nuevo codigo ya exista en otro rol
    if (nombre) {
      const rolExistente = await Rol.findOne({
        where: {
          codigo: nombre,
          id: { [Op.ne]: id }, // diferente al rol que estamos editando
        },
      });
      if (rolExistente) {
        return res.status(400).json({ success: false, message: 'Ya existe un rol con ese código' });
      }

      // Mapeamos nombre → codigo
      req.body.codigo = nombre;
      delete req.body.nombre;
    }

    // Actualizamos los campos permitidos
    await rol.update({
      codigo: req.body.codigo || rol.codigo,
      descripcion: descripcion ?? rol.descripcion,
      activo: activo ?? rol.activo,
      eliminado: eliminado ?? rol.eliminado,
    });

    res.json({ success: true, data: rol, message: 'Rol actualizado exitosamente' });
  } catch (error) {
    console.error('Error en updateRol:', error);
    res.status(500).json({
      success: false,
      message: 'No se pudo actualizar el rol',
      error: 'Error interno del servidor',
    });
  }
};


// ===== Soft delete de rol (marca eliminado=true y activo=false) =====
export const deleteRol = async (req, res) => {
  try {
    const { id } = req.params;
    const rol = await Rol.findByPk(id);

    if (!rol) return res.status(404).json({ success: false, message: 'Rol no encontrado' });

    await rol.update({ eliminado: true, activo: false });

    res.json({ success: true, message: 'Rol eliminado (soft delete)' });
  } catch (error) {
    console.error('Error en deleteRol:', error);
    res.status(500).json({
      success: false,
      message: 'No se pudo eliminar el rol',
      error: 'Error interno del servidor',
    });
  }
};

// ===== Restaurar rol eliminado o inactivo =====
export const restoreRol = async (req, res) => {
  try {
    const { id } = req.params;
    const rol = await Rol.findByPk(id);

    if (!rol) 
      return res.status(404).json({ success: false, message: 'Rol no encontrado' });

    // Solo restauramos si está eliminado o inactivo
    if (!rol.eliminado && rol.activo)
      return res.status(400).json({ success: false, message: 'El rol ya está activo' });

    await Rol.update({ eliminado: false, activo: false }, { where: { id } });

    res.json({ success: true, data: rol, message: 'Rol restaurado exitosamente' });
  } catch (error) {
    console.error('Error en restoreRol:', error);
    res.status(500).json({
      success: false,
      message: 'No se pudo restaurar el rol',
      error: 'Error interno del servidor',
    });
  }
};

