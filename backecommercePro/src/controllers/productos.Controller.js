import { Producto, Categoria } from '../models/index.js';

// ===== Obtener todos los productos =====
export const getProductos = async (req, res) => {
  try {
    const { page = 1, limit = 10, categoriaId, activo = true } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = { activo };
    if (categoriaId) whereClause.categoriaId = categoriaId;

    const productos = await Producto.findAndCountAll({
      where: whereClause,
      include: [{
        model: Categoria,
        as: 'categoria',
        attributes: ['id', 'nombre', 'descripcion']
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
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
    console.error('Error en getProductos:', err);
    res.status(500).json({
      success: false,
      message: 'No se pudieron obtener los productos'
    });
  }
};

// ===== Obtener un producto por ID =====
export const getProductoById = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Producto.findByPk(id, {
      include: [{
        model: Categoria,
        as: 'categoria',
        attributes: ['id', 'nombre', 'descripcion']
      }]
    });

    if (!producto) return res.status(404).json({ success: false, message: 'Producto no encontrado' });

    res.json({ success: true, data: producto });
  } catch (err) {
    console.error('Error en getProducto:', err);
    res.status(500).json({
      success: false,
      message: 'No se pudo obtener el producto'
    });
  }
};

// ===== Crear un producto =====
export const createProducto = async (req, res) => {
  try {
    const { nombre, descripcion, precio, stock, categoriaId } = req.body;

    const nuevoProducto = await Producto.create({ nombre, descripcion, precio, stock, categoriaId });

    // Cargar categoría si existe
    const productoConCategoria = await Producto.findByPk(nuevoProducto.id, {
      include: [{
        model: Categoria,
        as: 'categoria',
        attributes: ['id', 'nombre', 'descripcion']
      }]
    });

    res.status(201).json({
      success: true,
      data: productoConCategoria || nuevoProducto,
      message: 'Producto creado exitosamente'
    });
  } catch (err) {
    console.error('Error en createProducto:', err);
    res.status(500).json({
      success: false,
      message: 'No se pudo crear el producto'
    });
  }
};

// ===== Actualizar un producto =====
export const updateProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Producto.findByPk(id);
    if (!producto) return res.status(404).json({ success: false, message: 'Producto no encontrado' });

    await producto.update(req.body);

    res.json({
      success: true,
      data: producto,
      message: 'Producto actualizado exitosamente'
    });
  } catch (err) {
    console.error('Error en updateProducto:', err);
    res.status(500).json({
      success: false,
      message: 'No se pudo actualizar el producto'
    });
  }
};

// ===== Eliminar un producto (soft delete) =====
export const deleteProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Producto.findByPk(id);
    if (!producto) return res.status(404).json({ success: false, message: 'Producto no encontrado' });

    await producto.update({ activo: false });

    res.json({ success: true, message: 'Producto eliminado exitosamente' });
  } catch (err) {
    console.error('Error en deleteProducto:', err);
    res.status(500).json({
      success: false,
      message: 'No se pudo eliminar el producto'
    });
  }
};
