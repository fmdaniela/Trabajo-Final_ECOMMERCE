import OrdenCompra from '../models/OrdenCompra.js';

// Obtener todas las órdenes de compra
export const getOrdenesCompra = async (req, res) => {
  try {
    const ordenes = await OrdenCompra.findAll();
    res.status(200).json(ordenes);
  } catch (error) {
    console.error("Error al obtener órdenes de compra:", error);
    res.status(500).json({ message: 'Error al obtener órdenes de compra', error: error.message });
  }
};

// Obtener una orden de compra por id
export const getOrdenCompraById = async (req, res) => {
  try {
    const { id } = req.params;
    const orden = await OrdenCompra.findByPk(id);
    if (orden) {
      res.status(200).json(orden);
    } else {
      res.status(404).json({ message: 'Orden de compra no encontrada' });
    }
  } catch (error) {
    console.error("Error al obtener orden de compra por id:", error);
    res.status(500).json({ message: 'Error al obtener orden de compra', error: error.message });
  }
};

// Crear una nueva orden de compra
export const createOrdenCompra = async (req, res) => {
  try {
    const nuevaOrden = await OrdenCompra.create(req.body);
    res.status(201).json(nuevaOrden);
  } catch (error) {
    console.error("Error al crear orden de compra:", error);
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Error de validación', errors: error.errors.map(e => e.message) });
    }
    res.status(500).json({ message: 'Error al crear orden de compra', error: error.message });
  }
};

// Actualizar una orden de compra existente
export const updateOrdenCompra = async (req, res) => {
  try {
    const { id } = req.params;
    const datosActualizar = req.body;

    const orden = await OrdenCompra.findByPk(id);

    if (orden) {
      const ordenActualizada = await orden.update(datosActualizar);
      res.status(200).json(ordenActualizada);
    } else {
      res.status(404).json({ message: 'Orden de compra no encontrada para actualizar' });
    }
  } catch (error) {
    console.error("Error al actualizar orden de compra:", error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        message: 'Error de validación',
        errors: error.errors.map(e => e.message)
      });
    }
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};

// Eliminar una orden de compra
export const deleteOrdenCompra = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await OrdenCompra.destroy({ where: { id } });
    if (resultado > 0) {
      res.status(200).json({ message: 'Orden de compra eliminada exitosamente' });
    } else {
      res.status(404).json({ message: 'Orden de compra no encontrada para eliminar' });
    }
  } catch (error) {
    console.error("Error al eliminar orden de compra:", error);
    res.status(500).json({ message: 'Error al eliminar orden de compra', error: error.message });
  }
};
