import Carrito from '../models/Carrito.js';

// Obtener todos los carritos
export const getCarritos = async (req, res) => {
  try {
    const carritos = await Carrito.findAll();
    res.status(200).json(carritos);
  } catch (error) {
    console.error("Error al obtener carritos:", error);
    res.status(500).json({ message: 'Error al obtener carritos', error: error.message });
  }
};

// Obtener un carrito por id
export const getCarritoById = async (req, res) => {
  try {
    const { id } = req.params;
    const carrito = await Carrito.findByPk(id);
    if (carrito) {
      res.status(200).json(carrito);
    } else {
      res.status(404).json({ message: 'Carrito no encontrado' });
    }
  } catch (error) {
    console.error("Error al obtener carrito por id:", error);
    res.status(500).json({ message: 'Error al obtener carrito', error: error.message });
  }
};

// Crear un nuevo carrito
export const createCarrito = async (req, res) => {
  try {
    const nuevoCarrito = await Carrito.create(req.body);
    res.status(201).json(nuevoCarrito);
  } catch (error) {
    console.error("Error al crear carrito:", error);
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Error de validación', errors: error.errors.map(e => e.message) });
    }
    res.status(500).json({ message: 'Error al crear carrito', error: error.message });
  }
};

// Actualizar un carrito existente
export const updateCarrito = async (req, res) => {
  try {
    const { id } = req.params;
    const datosActualizar = req.body;

    const carrito = await Carrito.findByPk(id);

    if (carrito) {
      const carritoActualizado = await carrito.update(datosActualizar);
      res.status(200).json(carritoActualizado);
    } else {
      res.status(404).json({ message: 'Carrito no encontrado para actualizar' });
    }
  } catch (error) {
    console.error("Error al actualizar carrito:", error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        message: 'Error de validación',
        errors: error.errors.map(e => e.message)
      });
    }
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};

// Eliminar un carrito
export const deleteCarrito = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await Carrito.destroy({ where: { id } });
    if (resultado > 0) {
      res.status(200).json({ message: 'Carrito eliminado exitosamente' });
    } else {
      res.status(404).json({ message: 'Carrito no encontrado para eliminar' });
    }
  } catch (error) {
    console.error("Error al eliminar carrito:", error);
    res.status(500).json({ message: 'Error al eliminar carrito', error: error.message });
  }
};
