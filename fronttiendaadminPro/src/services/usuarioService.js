import api from './api';

const BASE_URL = '/usuarios';

const usuarioService = {
  /**
   * Obtiene todos los usuarios con paginación y filtros
   * @param {Object} options - Opciones de búsqueda y paginación
   * @param {string} token - Token de autorización (opcional)
   * @returns {Promise} - Promesa con los datos de los usuarios
   */
  getAll: async (options = {}, token) => {
    const { page = 1, limit = 10, search, activo, sort, direction } = options;

    const params = {
      page,
      limit,
      ...(search && { search }),
      ...(activo !== undefined && { activo }),
      ...(sort && { sort }),
      ...(direction && { direction }),
    };

    return api.get(BASE_URL, {
      params,
      ...(token && { headers: { Authorization: `Bearer ${token}` } }),
    });
  },

  /**
   * Obtiene un usuario por su ID
   * @param {string|number} id - ID del usuario
   * @param {string} token - Token de autorización (opcional)
   * @returns {Promise} - Promesa con los datos del usuario
   */
  getById: async (id, token) => {
    return api.get(`${BASE_URL}/${id}`, {
      ...(token && { headers: { Authorization: `Bearer ${token}` } }),
    });
  },

  /**
   * Crea un nuevo usuario
   * @param {Object} data - Datos del usuario a crear
   * @param {string} token - Token de autorización (opcional)
   * @returns {Promise} - Promesa con la respuesta de la creación
   */
  create: async (data, token) => {
    return api.post(BASE_URL, data, {
      ...(token && { headers: { Authorization: `Bearer ${token}` } }),
    });
  },

  /**
   * Actualiza un usuario existente
   * @param {string|number} id - ID del usuario
   * @param {Object} data - Datos actualizados del usuario
   * @param {string} token - Token de autorización (opcional)
   * @returns {Promise} - Promesa con la respuesta de la actualización
   */
  update: async (id, data, token) => {
    return api.put(`${BASE_URL}/${id}`, data, {
      ...(token && { headers: { Authorization: `Bearer ${token}` } }),
    });
  },

  /**
   * Elimina un usuario por su ID (soft delete)
   * @param {string|number} id - ID del usuario
   * @param {string} token - Token de autorización (opcional)
   * @returns {Promise} - Promesa con la respuesta de la eliminación
   */
  delete: async (id, token) => {
    return api.delete(`${BASE_URL}/${id}`, {
      ...(token && { headers: { Authorization: `Bearer ${token}` } }),
    });
  },

  /**
 * Restaura un usuario (soft delete)
 * @param {string|number} id - ID del usuario
 * @param {string} token - Token de autorización (opcional)
 * @returns {Promise} - Promesa con la respuesta de la restauración
 */
  restore: async (id, token) => {
    return api.post(`${BASE_URL}/${id}/restore`, null, {
      ...(token && { headers: { Authorization: `Bearer ${token}` } }),
    });
  }

};

export default usuarioService;
