import API from './api';

/**
 * Servicio para gestionar las operaciones relacionadas con imágenes de productos
 */

const imagenesService = {
  obtenerImagenesPorProducto: async (idProducto) => {
    try {
      const response = await API.get(`/productos/${idProducto}/imagenes`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener imágenes del producto:', error);
      throw error;
    }
  },

  agregarImagenPorProducto: async (idProducto, urlImagen) => {
    try {
      const response = await API.post(`/productos/${idProducto}/imagenes`, { urlImagen });
      return response.data;
    } catch (error) {
      console.error('Error al crear la imagen:', error);
      throw error;
    }
  }
};

export default imagenesService;
