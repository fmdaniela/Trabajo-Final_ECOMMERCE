import { Administrador } from '../models/index.js';
import { Op } from 'sequelize';

export const getAdministradores = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      activo,
      eliminado,
      sort = 'nombre',
      direction = 'ASC',
    } = req.query;

    const where = {};

    // Filtro de búsqueda
    if (search?.trim()) {
      where[Op.or] = [
        { nombre: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ];
    }
    
    // Filtro activo
    if (activo === 'true') where.activo = true;
    else if (activo === 'false') where.activo = false;

    // Filtro eliminado
    if (eliminado === 'true') where.eliminado = true;
    else if (eliminado === 'false') where.eliminado = false;
    
    const offset = (Number(page) - 1) * Number(limit);

    const { rows, count } = await Administrador.findAndCountAll({
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
    console.error('Error en getAdministradores:', error);
    res.status(500).json({
      success: false,
      message: 'No se pudieron obtener los administradores',
      error: 'Error interno del servidor',
    });
  }
};


// ===== Obtener un administrador por ID =====
export const getAdministradorById = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await Administrador.findByPk(id);

    if (!admin) return res.status(404).json({ success: false, message: 'Administrador no encontrado' });

    res.json({ success: true, data: admin });
  } catch (error) {
    console.error('Error en getAdministradorById:', error);
    res.status(500).json({
      success: false,
      message: 'No se pudo obtener el administrador',
      error: 'Error interno del servidor',
    });
  }
};

// ===== Crear administrador =====
export const createAdministrador = async (req, res) => {
  try {
    const {
      nombre,
      apellido,
      email,
      password,
      idRol,
      activo = true,
    } = req.body;

    // Crear nuevo administrador
    const nuevoAdmin = await Administrador.create({
      nombre,
      apellido,
      email,
      password,
      idRol,
      activo,
    });

    res.status(201).json({
      success: true,
      data: nuevoAdmin,
      message: 'Administrador creado exitosamente',
    });
  } catch (error) {
    console.error('Error en createAdministrador:', error);
    res.status(500).json({
      success: false,
      message: 'No se pudo crear el administrador',
      error: error.message || 'Error interno del servidor',
    });
  }
};


// ===== Actualizar administrador =====
export const updateAdministrador = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await Administrador.findByPk(id);

    if (!admin) 
      return res.status(404).json({ success: false, message: 'Administrador no encontrado' });

    // Creamos un objeto solo con los campos que queremos permitir actualizar
    const dataToUpdate = {
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      activo: req.body.activo,
      idRol: req.body.idRol ? Number(req.body.idRol) : undefined, // aseguramos number
    };

    // Si envían password, lo actualizamos; si no, lo eliminamos del objeto
    if (req.body.password && req.body.password.trim() !== '') {
      dataToUpdate.password = req.body.password;
    }

    // Eliminamos campos undefined para no sobrescribir con null
    Object.keys(dataToUpdate).forEach(
      key => dataToUpdate[key] === undefined && delete dataToUpdate[key]
    );

    // Actualizamos
    await admin.update(dataToUpdate);

    res.json({ success: true, data: admin, message: 'Administrador actualizado exitosamente' });
  } catch (error) {
    console.error('Error en updateAdministrador:', error);
    res.status(500).json({
      success: false,
      message: 'No se pudo actualizar el administrador',
      error: 'Error interno del servidor',
    });
  }
};

// ===== Soft delete (eliminado=true, activo=false) =====
export const deleteAdministrador = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await Administrador.findByPk(id);

    if (!admin) return res.status(404).json({ success: false, message: 'Administrador no encontrado' });

    await admin.update({ eliminado: true, activo: false });

    res.json({ success: true, message: 'Administrador eliminado (soft delete)' });
  } catch (error) {
    console.error('Error en deleteAdministrador:', error);
    res.status(500).json({
      success: false,
      message: 'No se pudo eliminar el administrador',
      error: 'Error interno del servidor',
    });
  }
};

// ===== Restaurar administrador =====
export const restoreAdministrador = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await Administrador.findByPk(id);
    if (!admin)
      return res.status(404).json({ success: false, error: "Administrador no encontrado" });

    // Solo restauramos si estaba inactivo
    if (admin.activo)
      return res.status(400).json({ success: false, message: "El administrador ya está activo" });

    await admin.update({ activo: true });

    res.json({
      success: true,
      data: admin,
      message: "Administrador restaurado exitosamente"
    });
  } catch (err) {
    console.error("Error en restoreAdministrador:", err);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
      message: "No se pudo restaurar el administrador"
    });
  }
};



