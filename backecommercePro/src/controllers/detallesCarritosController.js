import DetalleCarrito from '../models/DetalleCarrito.js';

// Obtener todos los detalles de carrito
export const getDetallesCarrito = async (req, res) => {
  try {
    const detalles = await DetalleCarrito.findAll();
    res.status(200).json(detalles);
  } catch (error) {
    console.error("Error al obtener detalles de carrito:", error);
    res.status(500).json({ message: 'Error al obtener detalles de carrito', error: error.message });
  }
};

// Obtener un detalle de carrito por id
export const getDetalleCarritoById = async (req, res) => {
  try {
    const { id } = req.params;
    const detalle = await DetalleCarrito.findByPk(id);
    if (detalle) {
      res.status(200).json(detalle);
    } else {
      res.status(404).json({ message: 'Detalle de carrito no encontrado' });
    }
  } catch (error) {
    console.error("Error al obtener detalle de carrito por id:", error);
    res.status(500).json({ message: 'Error al obtener detalle de carrito', error: error.message });
  }
};

// Crear un nuevo detalle de carrito
export const createDetalleCarrito = async (req, res) => {
  try {
    const nuevoDetalle = await DetalleCarrito.create(req.body);
    res.status(201).json(nuevoDetalle);
  } catch (error) {
    console.error("Error al crear detalle de carrito:", error);
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({ message: 'Error de validación', errors: error.errors?.map(e => e.message) || [error.message] });
    }
    res.status(500).json({ message: 'Error al crear detalle de carrito', error: error.message });
  }
};

// Actualizar un detalle de carrito existente
export const updateDetalleCarrito = async (req, res) => {
  try {
    const { id } = req.params;
    const datosActualizar = req.body;

    const detalle = await DetalleCarrito.findByPk(id);

    if (detalle) {
      const detalleActualizado = await detalle.update(datosActualizar);
      res.status(200).json(detalleActualizado);
    } else {
      res.status(404).json({ message: 'Detalle de carrito no encontrado para actualizar' });
    }
  } catch (error) {
    console.error("Error al actualizar detalle de carrito:", error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        message: 'Error de validación',
        errors: error.errors.map(e => e.message)
      });
    }
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};

// Eliminar un detalle de carrito
export const deleteDetalleCarrito = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await DetalleCarrito.destroy({ where: { id } });
    if (resultado > 0) {
      res.status(200).json({ message: 'Detalle de carrito eliminado exitosamente' });
    } else {
      res.status(404).json({ message: 'Detalle de carrito no encontrado para eliminar' });
    }
  } catch (error) {
    console.error("Error al eliminar detalle de carrito:", error);
    res.status(500).json({ message: 'Error al eliminar detalle de carrito', error: error.message });
  }
};
