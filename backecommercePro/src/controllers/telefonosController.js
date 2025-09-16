import Telefono from '../models/Telefono.js';

// Obtener todos los teléfonos
export const getTelefonos = async (req, res) => {
  try {
    const telefonos = await Telefono.findAll();
    res.status(200).json(telefonos);
  } catch (error) {
    console.error("Error al obtener teléfonos:", error);
    res.status(500).json({ message: 'Error al obtener teléfonos', error: error.message });
  }
};

// Obtener un teléfono por id
export const getTelefonoById = async (req, res) => {
  try {
    const { id } = req.params;
    const telefono = await Telefono.findByPk(id);
    if (telefono) {
      res.status(200).json(telefono);
    } else {
      res.status(404).json({ message: 'Teléfono no encontrado' });
    }
  } catch (error) {
    console.error("Error al obtener teléfono por id:", error);
    res.status(500).json({ message: 'Error al obtener teléfono', error: error.message });
  }
};

// Crear un nuevo teléfono
export const createTelefono = async (req, res) => {
  try {
    const nuevoTelefono = await Telefono.create(req.body);
    res.status(201).json(nuevoTelefono);
  } catch (error) {
    console.error("Error al crear teléfono:", error);
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        message: 'Error de validación',
        errors: error.errors.map(e => e.message)
      });
    }
    res.status(500).json({ message: 'Error al crear teléfono', error: error.message });
  }
};

// Actualizar un teléfono existente
export const updateTelefono = async (req, res) => {
  try {
    const { id } = req.params;
    const datosActualizar = req.body;

    const telefono = await Telefono.findByPk(id);

    if (telefono) {
      const telefonoActualizado = await telefono.update(datosActualizar);
      res.status(200).json(telefonoActualizado);
    } else {
      res.status(404).json({ message: 'Teléfono no encontrado para actualizar' });
    }
  } catch (error) {
    console.error("Error al actualizar teléfono:", error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        message: 'Error de validación',
        errors: error.errors.map(e => e.message)
      });
    }
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};

// Eliminar un teléfono
export const deleteTelefono = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await Telefono.destroy({ where: { id } });
    if (resultado > 0) {
      res.status(200).json({ message: 'Teléfono eliminado exitosamente' });
    } else {
      res.status(404).json({ message: 'Teléfono no encontrado para eliminar' });
    }
  } catch (error) {
    console.error("Error al eliminar teléfono:", error);
    res.status(500).json({ message: 'Error al eliminar teléfono', error: error.message });
  }
};
