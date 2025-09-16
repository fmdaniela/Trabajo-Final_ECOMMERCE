import Resena from '../models/Resena.js';

// Obtener todas las reseñas
export const getResenas = async (req, res) => {
  try {
    const resenas = await Resena.findAll();
    res.status(200).json(resenas);
  } catch (error) {
    console.error("Error al obtener reseñas:", error);
    res.status(500).json({ message: 'Error al obtener reseñas', error: error.message });
  }
};

// Obtener una reseña por id
export const getResenaById = async (req, res) => {
  try {
    const { id } = req.params;
    const resena = await Resena.findByPk(id);
    if (resena) {
      res.status(200).json(resena);
    } else {
      res.status(404).json({ message: 'Reseña no encontrada' });
    }
  } catch (error) {
    console.error("Error al obtener reseña por id:", error);
    res.status(500).json({ message: 'Error al obtener reseña', error: error.message });
  }
};

// Crear una nueva reseña
export const createResena = async (req, res) => {
  try {
    const nuevaResena = await Resena.create(req.body);
    res.status(201).json(nuevaResena);
  } catch (error) {
    console.error("Error al crear reseña:", error);
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        message: 'Error de validación',
        errors: error.errors.map(e => e.message)
      });
    }
    res.status(500).json({ message: 'Error al crear reseña', error: error.message });
  }
};

// Actualizar una reseña existente
export const updateResena = async (req, res) => {
  try {
    const { id } = req.params;
    const datosActualizar = req.body;

    const resena = await Resena.findByPk(id);

    if (resena) {
      const resenaActualizada = await resena.update(datosActualizar);
      res.status(200).json(resenaActualizada);
    } else {
      res.status(404).json({ message: 'Reseña no encontrada para actualizar' });
    }
  } catch (error) {
    console.error("Error al actualizar reseña:", error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        message: 'Error de validación',
        errors: error.errors.map(e => e.message)
      });
    }
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};

// Eliminar una reseña
export const deleteResena = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await Resena.destroy({ where: { id } });
    if (resultado > 0) {
      res.status(200).json({ message: 'Reseña eliminada exitosamente' });
    } else {
      res.status(404).json({ message: 'Reseña no encontrada para eliminar' });
    }
  } catch (error) {
    console.error("Error al eliminar reseña:", error);
    res.status(500).json({ message: 'Error al eliminar reseña', error: error.message });
  }
};
