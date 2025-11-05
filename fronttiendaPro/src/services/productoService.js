import API from './api'; 

/**
 * Servicio para gestionar las operaciones relacionadas con productos
 */
const productosService = {
  obtenerProductos: async (params = {}) => {
    try {
      // params puede incluir: page, limit, categoria, busqueda, orden
      const response = await API.get('/productos', { params });
      return response.data; // { productos: [...], pagination: {...} }
    } catch (error) {
      console.error('Error al obtener los productos:', error);
      throw error;
    }
  },

  // obtenerProductos: async () => {
  //   try {
  //     const response = await API.get('/productos'); 
  //     return response.data;
  //   } catch (error) {
  //     console.error('Error al obtener las productos:', error);
  //     throw error;
  //   }
  // },

  obtenerProductoPorId: async (id) => {
    try {
      const response = await API.get(`/productos/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener productos con ID ${id}:`, error);
      throw error;
    }
  },
  crearProducto: async (nuevoProducto) => {
    try {
      const response = await API.post('/productos', nuevoProducto);
      return response.data;
    } catch (error) {
      console.error('Error al crear producto:', error);
      throw error;
    }
  },

  modificarProducto: async (id, datosActualizados) => {
    try {
      const response = await API.put(`/productos/${id}`, datosActualizados);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar el producto con ID ${id}:`, error);
      throw error;
    }
  },

  eliminarProducto: async (id) => {
    try {
      const response = await API.delete(`/productos/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar el producto con ID ${id}:`, error);
      throw error;
    }
  },

  //Se incluye función de Productos relacionados en el servive de producto. No hacemos un archivo service nuevo en este caso
  obtenerProductosRelacionados: async (id) => { // podria ser getProductosRelacionados
    try {
      const response = await API.get(`/productos/${id}/relacionados`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener productos relacionados', error);
      throw error;
    }
  },

  // ✅ Nueva función para traer los destacados
  getDestacados: async () => {
    try {
      const response = await API.get('/productos/destacados');
      return response.data;
    } catch (error) {
      console.error('Error al obtener productos destacados:', error);
      throw error;
    }
  },
};

export default productosService;




