import API from './api';

/**
 * Servicio para gestionar las operaciones relacionadas con etiquedas de productos
 */

const etiquetasService = {
  obtenerEtiquetasPorProducto: async (idProducto) => {
    try {
      const response = await API.get(`/productos/${idProducto}/etiquetas`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener etiquetas del producto:', error);
      throw error;
    }
  },

  crearEtiquetaPorProducto: async (idProducto, texto) => {
    try {
      const response = await API.post(`/productos/${idProducto}/etiquetas`, { texto });
      return response.data;
    } catch (error) {
      console.error('Error al crear la etiqueta:', error);
      throw error;
    }
  }
};

export default etiquetasService;
