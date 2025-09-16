import MovimientoStock from '../models/MovimientoStock.js';

// Obtener todos los movimientos de stock
export const getMovimientosStock = async (req, res) => {
  try {
    const movimientos = await MovimientoStock.findAll();
    res.status(200).json(movimientos);
  } catch (error) {
    console.error("Error al obtener movimientos de stock:", error);
    res.status(500).json({ message: 'Error al obtener movimientos de stock', error: error.message });
  }
};

// Obtener un movimiento por ID
export const getMovimientoStockById = async (req, res) => {
  try {
    const { id } = req.params;
    const movimiento = await MovimientoStock.findByPk(id);
    if (movimiento) {
      res.status(200).json(movimiento);
    } else {
      res.status(404).json({ message: 'Movimiento de stock no encontrado' });
    }
  } catch (error) {
    console.error("Error al obtener movimiento de stock por id:", error);
    res.status(500).json({ message: 'Error al obtener movimiento de stock', error: error.message });
  }
};

// Crear un nuevo movimiento de stock
export const createMovimientoStock = async (req, res) => {
  try {
    const nuevoMovimiento = await MovimientoStock.create(req.body);
    res.status(201).json(nuevoMovimiento);
  } catch (error) {
    console.error("Error al crear movimiento de stock:", error);
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeDatabaseError') {
      return res.status(400).json({ message: 'Error de validación', errors: error.errors?.map(e => e.message) || [error.message] });
    }
    res.status(500).json({ message: 'Error al crear movimiento de stock', error: error.message });
  }
};

// Actualizar un movimiento de stock existente
export const updateMovimientoStock = async (req, res) => {
  try {
    const { id } = req.params;
    const datosActualizar = req.body;

    const movimiento = await MovimientoStock.findByPk(id);

    if (movimiento) {
      const movimientoActualizado = await movimiento.update(datosActualizar);
      res.status(200).json(movimientoActualizado);
    } else {
      res.status(404).json({ message: 'Movimiento de stock no encontrado para actualizar' });
    }
  } catch (error) {
    console.error("Error al actualizar movimiento de stock:", error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        message: 'Error de validación',
        errors: error.errors.map(e => e.message)
      });
    }
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};

// Eliminar un movimiento de stock
export const deleteMovimientoStock = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await MovimientoStock.destroy({ where: { id } });
    if (resultado > 0) {
      res.status(200).json({ message: 'Movimiento de stock eliminado exitosamente' });
    } else {
      res.status(404).json({ message: 'Movimiento de stock no encontrado para eliminar' });
    }
  } catch (error) {
    console.error("Error al eliminar movimiento de stock:", error);
    res.status(500).json({ message: 'Error al eliminar movimiento de stock', error: error.message });
  }
};
