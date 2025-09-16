import API from './api';

const resenasService = {
  obtenerResenasPorProducto: async (idProducto) => {
    try {
      const response = await API.get(`/productos/${idProducto}/resenas`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener reseñas:', error);
      throw error;
    }
  },

  crearResenaPorProducto: async (idProducto, nuevaResena) => {
    try {
      const response = await API.post(`/productos/${idProducto}/resenas`, nuevaResena);
      return response.data;
    } catch (error) {
      console.error('Error al crear reseña:', error);
      throw error;
    }
  },
};

export default resenasService;
