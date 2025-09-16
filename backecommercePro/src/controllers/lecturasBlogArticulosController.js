import LecturaBlogArticulo from '../models/LecturaBlogArticulo.js';

// Obtener todas las lecturas
export const getLecturas = async (req, res) => {
  try {
    const lecturas = await LecturaBlogArticulo.findAll();
    res.status(200).json(lecturas);
  } catch (error) {
    console.error("Error al obtener lecturas:", error);
    res.status(500).json({ message: 'Error al obtener lecturas', error: error.message });
  }
};

// Obtener lectura por id
export const getLecturaById = async (req, res) => {
  try {
    const { id } = req.params;
    const lectura = await LecturaBlogArticulo.findByPk(id);
    if (lectura) {
      res.status(200).json(lectura);
    } else {
      res.status(404).json({ message: 'Lectura no encontrada' });
    }
  } catch (error) {
    console.error("Error al obtener lectura por id:", error);
    res.status(500).json({ message: 'Error al obtener lectura', error: error.message });
  }
};

// Crear una nueva lectura
export const createLectura = async (req, res) => {
  try {
    const nuevaLectura = await LecturaBlogArticulo.create(req.body);
    res.status(201).json(nuevaLectura);
  } catch (error) {
    console.error("Error al crear lectura:", error);
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({ message: 'Error de validación', errors: error.errors?.map(e => e.message) || [error.message] });
    }
    res.status(500).json({ message: 'Error al crear lectura', error: error.message });
  }
};

// Actualizar lectura existente
export const updateLectura = async (req, res) => {
  try {
    const { id } = req.params;
    const datosActualizar = req.body;

    const lectura = await LecturaBlogArticulo.findByPk(id);

    if (lectura) {
      const lecturaActualizada = await lectura.update(datosActualizar);
      res.status(200).json(lecturaActualizada);
    } else {
      res.status(404).json({ message: 'Lectura no encontrada para actualizar' });
    }
  } catch (error) {
    console.error("Error al actualizar lectura:", error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        message: 'Error de validación',
        errors: error.errors.map(e => e.message)
      });
    }
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};

// Eliminar lectura
export const deleteLectura = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await LecturaBlogArticulo.destroy({ where: { id } });
    if (resultado > 0) {
      res.status(200).json({ message: 'Lectura eliminada exitosamente' });
    } else {
      res.status(404).json({ message: 'Lectura no encontrada para eliminar' });
    }
  } catch (error) {
    console.error("Error al eliminar lectura:", error);
    res.status(500).json({ message: 'Error al eliminar lectura', error: error.message });
  }
};
