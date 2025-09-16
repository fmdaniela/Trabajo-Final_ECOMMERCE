import API from './api'; 

/**
 * Servicio para cupones de descuento
 */
const cuponDescuentoService = {
  obtenerCupones: async () => {
    try {
      const response = await API.get('/cuponesdescuentos');
      return response.data;
    } catch (error) {
      console.error('Error al obtener cupones:', error);
      throw error;
    }
  },

  obtenerCuponPorId: async (id) => {
    try {
      const response = await API.get(`/cuponesdescuentos/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener cupón con ID ${id}:`, error);
      throw error;
    }
  },

  crearCupon: async (cuponData) => {
    try {
      const response = await API.post('/cuponesdescuentos', cuponData);
      return response.data;
    } catch (error) {
      console.error('Error al crear cupón:', error);
      throw error;
    }
  },

  actualizarCupon: async (id, cuponData) => {
    try {
      const response = await API.put(`/cuponesdescuentos/${id}`, cuponData);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar cupón con ID ${id}:`, error);
      throw error;
    }
  },

  eliminarCupon: async (id) => {
    try {
      const response = await API.delete(`/cuponesdescuentos/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar cupón con ID ${id}:`, error);
      throw error;
    }
  },

  validarCuponPorCodigo: async (codigoCupon) => {
    try {
      const response = await API.get(`/cuponesdescuentos/validar/${codigoCupon}`);
      return response.data;
    } catch (error) {
      console.error(`Error al validar cupón con código ${codigoCupon}:`, error);
      throw error;
    }
  }
};

export default cuponDescuentoService;
