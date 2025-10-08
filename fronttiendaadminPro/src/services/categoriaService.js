import api from './api';

const BASE_URL = '/categorias';

const categoriaService = {
  /**
   * Obtiene todas las categorías con paginación y filtros
   * @param {Object} options - Opciones de búsqueda y paginación
   * @param {string} token - Token JWT para autorización
   * @returns {Promise} - Promesa con los datos de las categorías
   */
  getAll: async (options = {}, token) => {
    const { page = 1, limit = 10, search, activa, sort, direction } = options;

    const params = {
      page,
      limit,
      ...(search && { search }),
      ...(activa !== undefined && { activa }),
      ...(sort && { sort }),
      ...(direction && { direction }),
    };

    return api.get(BASE_URL, { 
      params,
      headers: token && { Authorization: `Bearer ${token}` } // Enviar token solo si existe
    });
  },

  /**
   * Obtiene una categoría por su ID
   * @param {string|number} id - ID de la categoría
   * @param {string} token - Token JWT para autorización
   * @returns {Promise} - Promesa con los datos de la categoría
   */
  getById: async (id, token) => {
    return api.get(`${BASE_URL}/${id}`, {
      headers: token && { Authorization: `Bearer ${token}` }
    });
  },

  /**
   * Crea una nueva categoría
   * @param {Object} data - Datos de la categoría a crear
   * @param {string} token - Token JWT para autorización
   * @returns {Promise} - Promesa con la respuesta de la creación
   */
  create: async (data, token) => {  
    return api.post(BASE_URL, data, {
      headers: token && { Authorization: `Bearer ${token}` }
    });
  },

  /**
   * Actualiza una categoría existente
   * @param {string|number} id - ID de la categoría a actualizar
   * @param {Object} data - Datos actualizados de la categoría
   * @param {string} token - Token JWT para autorización
   * @returns {Promise} - Promesa con la respuesta de la actualización
   */
  update: async (id, data, token) => {
    return api.put(`${BASE_URL}/${id}`, data, {
      headers: token && { Authorization: `Bearer ${token}` }
    });
  },

  /**
   * Elimina una categoría por su ID
   * @param {string|number} id - ID de la categoría a eliminar
   * @param {string} token - Token JWT para autorización
   * @returns {Promise} - Promesa con la respuesta de la eliminación
   */
  delete: async (id, token) => {
    return api.delete(`${BASE_URL}/${id}`, {
      headers: token && { Authorization: `Bearer ${token}` }
    });
  },

  /**
   * Obtiene todos los productos asociados a una categoría
   * @param {string|number} id - ID de la categoría
   * @param {Object} options - Opciones de búsqueda y paginación
   * @param {string} token - Token JWT para autorización
   * @returns {Promise} - Promesa con los productos de la categoría
   */
  getProductosByCategoria: async (id, options = {}, token) => {
    const { page = 1, limit = 10 } = options;

    const params = {
      page,
      limit
    };

    return api.get(`${BASE_URL}/${id}/productos`, {
      params,
      headers: token && { Authorization: `Bearer ${token}` } // Enviar token solo si existe
    });
  },

    /**
   * Restaura una categoría (cambia de inactiva a activa)
   * @param {string|number} id - ID de la categoría a restaurar
   * @param {string} token - Token JWT para autorización
   * @returns {Promise} - Promesa con la respuesta de la restauración
   */
  restore: async (id, token) => {
    return api.patch(`${BASE_URL}/${id}/restore`, {}, {
      headers: token && { Authorization: `Bearer ${token}` }
    });
  }

};

export default categoriaService;
  