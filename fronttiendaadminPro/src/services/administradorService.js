import api from './api';

const BASE_URL = '/administradores';

const administradorService = {
  /**
   * Obtiene todos los administradores con paginación, búsqueda y orden
   * @param {Object} params - { page, limit, search, activo, sort, direction }
   * @param {string} token - Token de autorización (opcional)
   * @returns {Promise} - Promesa con los datos de administradores
   */
  getAll: async (params = {}, token) => {
    return api.get(BASE_URL, {
      params,
      ...(token && { headers: { Authorization: `Bearer ${token}` } }),
    });
  },

  /**
   * Obtiene un administrador por su ID
   * @param {string|number} id - ID del administrador
   * @param {string} token - Token de autorización (opcional)
   * @returns {Promise} - Promesa con los datos del administrador
   */
  getById: async (id, token) => {
    return api.get(`${BASE_URL}/${id}`, {
      ...(token && { headers: { Authorization: `Bearer ${token}` } }),
    });
  },

  /**
   * Crea un nuevo administrador
   * @param {Object} data - Datos del administrador { nombre, apellido, email, password, idRol, activo }
   * @param {string} token - Token de autorización (opcional)
   * @returns {Promise} - Promesa con la respuesta de la creación
   */
  create: async (data, token) => {
    return api.post(BASE_URL, data, {
      ...(token && { headers: { Authorization: `Bearer ${token}` } }),
    });
  },

  /**
   * Actualiza un administrador existente
   * @param {string|number} id - ID del administrador
   * @param {Object} data - Datos a actualizar
   * @param {string} token - Token de autorización (opcional)
   * @returns {Promise} - Promesa con la respuesta de la actualización
   */
  update: async (id, data, token) => {
    return api.put(`${BASE_URL}/${id}`, data, {
      ...(token && { headers: { Authorization: `Bearer ${token}` } }),
    });
  },

  /**
   * Elimina (soft delete) un administrador por su ID
   * @param {string|number} id - ID del administrador
   * @param {string} token - Token de autorización (opcional)
   * @returns {Promise} - Promesa con la respuesta de la eliminación
   */
  delete: async (id, token) => {
    return api.delete(`${BASE_URL}/${id}`, {
      ...(token && { headers: { Authorization: `Bearer ${token}` } }),
    });
  },

  /**
 * Restaura un administrador inactivo
 * @param {string|number} id - ID del administrador
 * @param {string} token - Token de autorización (opcional)
 * @returns {Promise} - Promesa con la respuesta de la restauración
 */
 restore: async (id, token) => {
  return api.patch(`${BASE_URL}/${id}/restore`, null, {
    ...(token && { headers: { Authorization: `Bearer ${token}` } }),
    });
  },

};

export default administradorService;
