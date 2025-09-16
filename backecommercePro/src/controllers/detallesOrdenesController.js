import DetalleOrden from '../models/DetalleOrden.js';

// Obtener todos los detalles de orden
export const getDetallesOrden = async (req, res) => {
  try {
    const detalles = await DetalleOrden.findAll();
    res.status(200).json(detalles);
  } catch (error) {
    console.error("Error al obtener detalles de orden:", error);
    res.status(500).json({ message: 'Error al obtener detalles de orden', error: error.message });
  }
};

// Obtener un detalle de orden por id
export const getDetalleOrdenById = async (req, res) => {
  try {
    const { id } = req.params;
    const detalle = await DetalleOrden.findByPk(id);
    if (detalle) {
      res.status(200).json(detalle);
    } else {
      res.status(404).json({ message: 'Detalle de orden no encontrado' });
    }
  } catch (error) {
    console.error("Error al obtener detalle de orden por id:", error);
    res.status(500).json({ message: 'Error al obtener detalle de orden', error: error.message });
  }
};

// Crear un nuevo detalle de orden
export const createDetalleOrden = async (req, res) => {
  try {
    const nuevoDetalle = await DetalleOrden.create(req.body);
    res.status(201).json(nuevoDetalle);
  } catch (error) {
    console.error("Error al crear detalle de orden:", error);
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({ message: 'Error de validación', errors: error.errors?.map(e => e.message) || [error.message] });
    }
    res.status(500).json({ message: 'Error al crear detalle de orden', error: error.message });
  }
};

// Actualizar un detalle de orden existente
export const updateDetalleOrden = async (req, res) => {
  try {
    const { id } = req.params;
    const datosActualizar = req.body;

    const detalle = await DetalleOrden.findByPk(id);

    if (detalle) {
      const detalleActualizado = await detalle.update(datosActualizar);
      res.status(200).json(detalleActualizado);
    } else {
      res.status(404).json({ message: 'Detalle de orden no encontrado para actualizar' });
    }
  } catch (error) {
    console.error("Error al actualizar detalle de orden:", error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        message: 'Error de validación',
        errors: error.errors.map(e => e.message)
      });
    }
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};

// Eliminar un detalle de orden
export const deleteDetalleOrden = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await DetalleOrden.destroy({ where: { id } });
    if (resultado > 0) {
      res.status(200).json({ message: 'Detalle de orden eliminado exitosamente' });
    } else {
      res.status(404).json({ message: 'Detalle de orden no encontrado para eliminar' });
    }
  } catch (error) {
    console.error("Error al eliminar detalle de orden:", error);
    res.status(500).json({ message: 'Error al eliminar detalle de orden', error: error.message });
  }
};

