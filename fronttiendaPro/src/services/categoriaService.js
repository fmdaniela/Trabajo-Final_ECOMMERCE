import API from './api'; // API es la instancia de axios 

/**
 * Servicio para gestionar las operaciones relacionadas con categorías
 */
const categoriaService = { 
  obtenerCategorias: async () => { 
    try {
      const response = await API.get('/categorias'); // o 'http://localhost:3001/api/categorias'
      return response.data;
    } catch (error) {
      console.error('Error al obtener las categorías:', error);
      throw error;
    }
  },

  obtenerCategoriaPorId: async (id) => {
    try {
      const response = await API.get(`/categorias/${id}`);
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

