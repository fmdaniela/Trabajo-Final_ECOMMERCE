import API from './api';

/**
 * Servicio para gestionar las operaciones relacionadas con mensajes de
 */

const mensajesService = {
  obtenerMensajesPorProducto: async (idProducto) => {
    try {
      const response = await API.get(`/productos/${idProducto}/mensajes`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener mensajes del producto:', error);
      throw error;
    }
  },

  crearMensajePorProducto: async (idProducto, texto) => {
    try {
      const response = await API.post(`/productos/${idProducto}/mensajes`, { texto });
      return response.data;
    } catch (error) {
      console.error('Error al crear mensaje:', error);
      throw error;
    }
  }
};

export default mensajesService;
