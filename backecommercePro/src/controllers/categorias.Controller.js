import { Categoria, Producto } from '../models/index.js';
import { Op } from 'sequelize';

// ===== Obtener todas las categorías =====
export const getCategorias = async (req, res) => {
  try {
    const { page = 1, limit = 10, activa, search, sort = 'nombre', direction = 'ASC' } = req.query;
    const offset = (page - 1) * limit;

    console.log('Query param activa:', activa);

    const whereClause = {};
    if (activa !== undefined && activa !== 'all') whereClause.activa = activa === 'true' ? 1 : 0;
    if (search) {
      whereClause[Op.or] = [
        { nombre: { [Op.like]: `%${search}%` } },
        { descripcion: { [Op.like]: `%${search}%` } }
      ];
    }

    const categorias = await Categoria.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sort, direction.toUpperCase()]]
    });

    res.json({
      success: true,
      data: categorias.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(categorias.count / limit),
        totalItems: categorias.count,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (err) {
    console.error("Error en getCategorias:", err);
    res.status(500).json({ success: false, error: "Error interno del servidor", message: "No se pudieron obtener las categorías" });
  }
};

// ===== Obtener una categoría por ID =====
export const getCategoriaById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) return res.status(400).json({ success: false, error: "ID de categoría inválido" });

    const categoria = await Categoria.findByPk(id);
    if (!categoria) return res.status(404).json({ success: false, error: "Categoría no encontrada" });

    res.json({ success: true, data: categoria });
  } catch (err) {
    console.error("Error en getCategoria:", err);
    res.status(500).json({ success: false, error: "Error interno del servidor", message: "No se pudo obtener la categoría" });
  }
};

// ===== Obtener productos por categoría =====
export const getProductosByCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10, activa, search, sort = 'id', direction = 'DESC' } = req.query;
    const offset = (page - 1) * limit;

    if (!id || isNaN(id)) return res.status(400).json({ success: false, error: "ID de categoría inválido" });

    const categoria = await Categoria.findByPk(id);
    if (!categoria) return res.status(404).json({ success: false, error: "Categoría no encontrada" });

    const whereClause = { idCategoria: id };

    if (activa !== undefined && activa !== 'all') whereClause.activa = activa === 'true' ? 1 : 0;

    if (search) {
      whereClause[Op.or] = [
        { nombre: { [Op.like]: `%${search}%` } },
        { descripcion: { [Op.like]: `%${search}%` } }
      ];
    }

    const productos = await Producto.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sort, direction.toUpperCase()]]
    });

    res.json({
      success: true,
      data: productos.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(productos.count / limit),
        totalItems: productos.count,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (err) {
    console.error("Error en getProductosByCategoria:", err);
    res.status(500).json({ success: false, error: "Error interno del servidor", message: "No se pudieron obtener los productos de la categoría" });
  }
};

// ===== Crear una nueva categoría =====
export const createCategoria = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;

    // Si subieron un archivo, generar URL accesible
    let imagenUrl = "https://via.placeholder.com/150";
    if (req.file) {
      imagenUrl = `${req.protocol}://${req.get('host')}/uploads/categorias/${req.file.filename}`;
    }

    const nuevaCategoria = await Categoria.create({
      nombre,
      descripcion,
      imagenUrl,
      activa: true
    });

    res.status(201).json({
      success: true,
      data: nuevaCategoria,
      message: "Categoría creada exitosamente"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "No se pudo crear la categoría" });
  }
};


// ===== Actualizar categoría =====
export const updateCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, activa } = req.body;

    const categoria = await Categoria.findByPk(id);
    if (!categoria) return res.status(404).json({ success: false, message: "Categoría no encontrada" });

    let imagenUrl = categoria.imagenUrl;
    if (req.file) {
      imagenUrl = `${req.protocol}://${req.get('host')}/uploads/categorias/${req.file.filename}`;
    }

    await categoria.update({
      nombre,
      descripcion,
      activa: activa === 'true' || activa === true,
      imagenUrl
    });

    res.json({
      success: true,
      data: categoria,
      message: "Categoría actualizada exitosamente"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "No se pudo actualizar la categoría" });
  }
};

// ===== Soft delete categoría =====
export const deleteCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const categoria = await Categoria.findByPk(id);
    if (!categoria) return res.status(404).json({ success: false, error: "Categoría no encontrada" });

    await categoria.update({ activa: false });
    res.json({ success: true, message: "Categoría eliminada exitosamente" });
  } catch (err) {
    console.error("Error en deleteCategoria:", err);
    res.status(500).json({ success: false, error: "Error interno del servidor", message: "No se pudo eliminar la categoría" });
  }
};

// ===== Restaurar categoría =====
export const restoreCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const categoria = await Categoria.findByPk(id);
    if (!categoria)
      return res.status(404).json({ success: false, error: "Categoría no encontrada" });

    if (categoria.activa)
      return res.status(400).json({ success: false, message: "La categoría ya está activa" });

    await categoria.update({ activa: true });

    res.json({
      success: true,
      data: categoria,
      message: "Categoría restaurada exitosamente"
    });
  } catch (err) {
    console.error("Error en restoreCategoria:", err);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
      message: "No se pudo restaurar la categoría"
    });
  }
};

// =============== PÚBLICO ===============

// ===== Obtener categorías activas (público) =====
export const getCategoriasPublic = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = 'nombre', direction = 'ASC', search } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = { activa: true }; 
    if (search) {
      whereClause.nombre = { [Op.like]: `%${search}%` };
    }

    const categorias = await Categoria.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sort, direction.toUpperCase()]]
    });

    res.json({
      success: true,
      data: categorias.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(categorias.count / limit),
        totalItems: categorias.count,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (err) {
    console.error("Error en getCategoriasPublic:", err);
    res.status(500).json({ success: false, error: "Error interno del servidor", message: "No se pudieron obtener las categorías" });
  }
};

// ===== Obtener productos por categoría (público) =====
export const getProductosByCategoriaPublic = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10, sort = 'id', direction = 'DESC', search } = req.query;
    const offset = (page - 1) * limit;

    // Validar ID
    if (!id || isNaN(id)) {
      return res.status(400).json({ success: false, error: "ID de categoría inválido" });
    }

    // Buscar categoría activa
    const categoria = await Categoria.findOne({ where: { id, activa: true } });
    if (!categoria) {
      return res.status(404).json({ success: false, error: "Categoría no encontrada o inactiva" });
    }

    // Preparar filtros para productos
    const whereClause = { idCategoria: id }; // solo filtro por categoría
    if (search) {
      whereClause[Op.or] = [
        { nombre: { [Op.like]: `%${search}%` } },
        { descripcion: { [Op.like]: `%${search}%` } }
      ];
    }

    // Buscar productos
    const productos = await Producto.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sort, direction.toUpperCase()]]
    });

    res.json({
      success: true,
      data: productos.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(productos.count / limit),
        totalItems: productos.count,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (err) {
    console.error("Error en getProductosByCategoriaPublic:", err);
    res.status(500).json({ 
      success: false, 
      error: "Error interno del servidor", 
      message: "No se pudieron obtener los productos de la categoría" 
    });
  }
};

