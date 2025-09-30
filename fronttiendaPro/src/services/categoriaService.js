import API from './api'; // API es la instancia de axios

/**
 * Servicio para gestionar las operaciones relacionadas con categorías
 */
const categoriaService = { 

  //======= Para el frontend público (tienda)=======
  obtenerCategoriasPublic: async () => { 
    try {
      const response = await API.get('/categorias/public'); 
      // Devolvemos todo el objeto { success, data, pagination }
      return response.data; 
    } catch (error) {
      console.error('Error al obtener las categorías públicas:', error);
      throw error;
    }
  },  

  obtenerProductosPorCategoriaPublic: async (id) => {
    try {
      const response = await API.get(`/categorias/public/${id}/productos`);
      // Devolvemos todo el objeto { success, data, pagination }
      return response.data; 
    } catch (error) {
      console.error(`Error al obtener productos de la categoría ${id}:`, error);
      throw error;
    }
  },

  //======= Para dashboard/admin (cuando uses login de admin)========
  obtenerCategoriasAdmin: async () => {
    try {
      const response = await API.get('/categorias'); 
      // Devolvemos todo el objeto { success, data, pagination } para poder paginar/filtrar en el panel
      return response.data; 
    } catch (error) {
      console.error('Error al obtener todas las categorías (admin):', error);
      throw error;
    }
  },

  obtenerCategoriaAdminPorId: async (id) => {
    try {
      const response = await API.get(`/categorias/${id}`);
      // Para detalle no hay paginación, devolvemos solo { success, data }
      return response.data; 
    } catch (error) {
      console.error(`Error al obtener categoría con ID ${id}:`, error);
      throw error;
    }
  }
};

export default categoriaService;


//Los archivos services definen una interfaz de comunicación del front con el backend usando axios (a través de API), y lo hace de forma ordenada, agrupando funciones relacionadas con categorias.
// centralizan la lógica de acceso a la API, para no tener axios.get(...) directamente en todos los componentes.

