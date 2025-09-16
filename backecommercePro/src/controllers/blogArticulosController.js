import BlogArticulo from '../models/BlogArticulo.js';

// Obtener todos los artículos del blog
export const getBlogArticulos = async (req, res) => {
  try {
    const articulos = await BlogArticulo.findAll();
    res.status(200).json(articulos);
  } catch (error) {
    console.error("Error al obtener artículos del blog:", error);
    res.status(500).json({ message: 'Error al obtener artículos del blog', error: error.message });
  }
};

// Obtener un artículo por id
export const getBlogArticuloById = async (req, res) => {
  try {
    const { id } = req.params;
    const articulo = await BlogArticulo.findByPk(id);
    if (articulo) {
      res.status(200).json(articulo);
    } else {
      res.status(404).json({ message: 'Artículo no encontrado' });
    }
  } catch (error) {
    console.error("Error al obtener artículo por id:", error);
    res.status(500).json({ message: 'Error al obtener artículo', error: error.message });
  }
};

// Crear un nuevo artículo
export const createBlogArticulo = async (req, res) => {
  try {
    const nuevoArticulo = await BlogArticulo.create(req.body);
    res.status(201).json(nuevoArticulo);
  } catch (error) {
    console.error("Error al crear artículo:", error);
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Error de validación', errors: error.errors.map(e => e.message) });
    }
    res.status(500).json({ message: 'Error al crear artículo', error: error.message });
  }
};

// Actualizar un artículo existente
export const updateBlogArticulo = async (req, res) => {
  try {
    const { id } = req.params;
    const datosActualizar = req.body;

    const articulo = await BlogArticulo.findByPk(id);

    if (articulo) {
      const articuloActualizado = await articulo.update(datosActualizar);
      res.status(200).json(articuloActualizado);
    } else {
      res.status(404).json({ message: 'Artículo no encontrado para actualizar' });
    }
  } catch (error) {
    console.error("Error al actualizar artículo:", error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        message: 'Error de validación',
        errors: error.errors.map(e => e.message)
      });
    }
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};

// Eliminar un artículo
export const deleteBlogArticulo = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await BlogArticulo.destroy({ where: { id } });
    if (resultado > 0) {
      res.status(200).json({ message: 'Artículo eliminado exitosamente' });
    } else {
      res.status(404).json({ message: 'Artículo no encontrado para eliminar' });
    }
  } catch (error) {
    console.error("Error al eliminar artículo:", error);
    res.status(500).json({ message: 'Error al eliminar artículo', error: error.message });
  }
};
