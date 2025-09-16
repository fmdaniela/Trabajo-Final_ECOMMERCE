import API from './api';

/**
 * Servicio para gestionar las operaciones relacionadas con variantes
 */

const variantesService = {
  getVariantesPorProducto : async (idProducto) => {
    try {
      const response = await API.get(`/productos/${idProducto}/variantes`); // 0 http://localhost:3000/api/productos/1/variantes
      return response.data;
    } catch (error) {
      console.error('Error al obtener variantes del producto:', error);
      throw error;
    }
  }
};

export default variantesService;
