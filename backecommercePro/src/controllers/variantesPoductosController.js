import VarianteProducto from '../models/VarianteProducto.js';

// Obtener todas las variantes
export const getVariantesProducto = async (req, res) => {
  try {
    const variantes = await VarianteProducto.findAll();
    res.status(200).json(variantes);
  } catch (error) {
    console.error("Error al obtener variantes de producto:", error);
    res.status(500).json({ message: 'Error al obtener variantes', error: error.message });
  }
};

// Obtener una variante por id
export const getVarianteProductoById = async (req, res) => {
  try {
    const { id } = req.params;
    const variante = await VarianteProducto.findByPk(id);
    if (variante) {
      res.status(200).json(variante);
    } else {
      res.status(404).json({ message: 'Variante no encontrada' });
    }
  } catch (error) {
    console.error("Error al obtener variante por id:", error);
    res.status(500).json({ message: 'Error al obtener variante', error: error.message });
  }
};

// Crear una nueva variante
export const createVarianteProducto = async (req, res) => {
  try {
    const nuevaVariante = await VarianteProducto.create(req.body);
    res.status(201).json(nuevaVariante);
  } catch (error) {
    console.error("Error al crear variante:", error);
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        message: 'Error de validación',
        errors: error.errors.map(e => e.message)
      });
    }
    res.status(500).json({ message: 'Error al crear variante', error: error.message });
  }
};

// Actualizar una variante existente
export const updateVarianteProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const datosActualizar = req.body;

    const variante = await VarianteProducto.findByPk(id);

    if (variante) {
      const varianteActualizada = await variante.update(datosActualizar);
      res.status(200).json(varianteActualizada);
    } else {
      res.status(404).json({ message: 'Variante no encontrada para actualizar' });
    }
  } catch (error) {
    console.error("Error al actualizar variante:", error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        message: 'Error de validación',
        errors: error.errors.map(e => e.message)
      });
    }
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};

// Eliminar una variante
export const deleteVarianteProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await VarianteProducto.destroy({ where: { id } });
    if (resultado > 0) {
      res.status(200).json({ message: 'Variante eliminada exitosamente' });
    } else {
      res.status(404).json({ message: 'Variante no encontrada para eliminar' });
    }
  } catch (error) {
    console.error("Error al eliminar variante:", error);
    res.status(500).json({ message: 'Error al eliminar variante', error: error.message });
  }
};

// Obtener todas las variantes de un producto específico
export const getVariantesPorProducto = async (req, res) => {
  try {
    const { productoId } = req.params;
    const variantes = await VarianteProducto.findAll({
      where: { idProducto: productoId}
    })
    res.status(200).json(variantes);
  } catch (error) {
    console.error("Error al obtener variantes por productoId", error);
    res.status(500).json({message: 'Error al obtener variantes por productoId', error: error.message });
  }
};