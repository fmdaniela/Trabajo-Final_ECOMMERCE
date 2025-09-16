import api from './api';

const BASE_URL = '/roles';

const rolService = {
  /**
   * Obtiene todos los roles con paginación, búsqueda y orden
   * @param {Object} params - { page, limit, search, sort, direction }
   * @param {string} token - Token de autorización (opcional)
   * @returns {Promise} - Promesa con los datos de roles
   */
  getAll: async (params = {}, token) => {
    return api.get(BASE_URL, {
      params,
      ...(token && { headers: { Authorization: `Bearer ${token}` } }),
    });
  },

  /**
   * Obtiene un rol por su ID
   * @param {string|number} id - ID del rol
   * @param {string} token - Token de autorización (opcional)
   * @returns {Promise} - Promesa con los datos del rol
   */
  getById: async (id, token) => {
    return api.get(`${BASE_URL}/${id}`, {
      ...(token && { headers: { Authorization: `Bearer ${token}` } }),
    });
  },

  /**
   * Crea un nuevo rol
   * @param {Object} data - Datos del rol
   * @param {string} token - Token de autorización (opcional)
   * @returns {Promise} - Promesa con la respuesta de la creación
   */
  create: async (data, token) => {
    return api.post(BASE_URL, data, {
      ...(token && { headers: { Authorization: `Bearer ${token}` } }),
    });
  },

  /**
   * Actualiza un rol existente
   * @param {string|number} id - ID del rol
   * @param {Object} data - Datos actualizados
   * @param {string} token - Token de autorización (opcional)
   * @returns {Promise} - Promesa con la respuesta de la actualización
   */
  update: async (id, data, token) => {
    return api.put(`${BASE_URL}/${id}`, data, {
      ...(token && { headers: { Authorization: `Bearer ${token}` } }),
    });
  },

  /**
   * Elimina un rol por su ID (soft delete: marca eliminado = true)
   * @param {string|number} id - ID del rol
   * @param {string} token - Token de autorización (opcional)
   * @returns {Promise} - Promesa con la respuesta de la eliminación
   */
  delete: async (id, token) => {
    return api.delete(`${BASE_URL}/${id}`, {
      ...(token && { headers: { Authorization: `Bearer ${token}` } }),
    });
  },

  /**
   * Restaura un rol eliminado (pone eliminado = false)
   * @param {string|number} id - ID del rol
   * @param {string} token - Token de autorización (opcional)
   * @returns {Promise} - Promesa con la respuesta de la restauración
   */
  restore: async (id, token) => {
    return api.patch(`${BASE_URL}/${id}/restore`, null, {
      ...(token && { headers: { Authorization: `Bearer ${token}` } }),
    });
  },
};

export default rolService;
