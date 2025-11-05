import api from './api';

const BASE_URL = '/roles';

const rolService = {
  /**
   * Obtiene todos los roles con paginación, búsqueda y orden
   * @param {Object} options - { page, limit, search, sort, direction }
   * @returns {Promise}
   */
  getAll: async (options = {}) => {
    const { page = 1, limit = 10, search, activo, sort, direction } = options;

    const params = {
      page,
      limit,
      ...(search && { search }),
      ...(activo !== undefined && { activo }),
      ...(sort && { sort }),
      ...(direction && { direction }),
    };

    return api.get(BASE_URL, { params });
  },

  /**
   * Obtiene un rol por su ID
   * @param {string|number} id
   * @returns {Promise}
   */
  getById: async (id) => {
    return api.get(`${BASE_URL}/${id}`);
  },

  /**
   * Crea un nuevo rol
   * @param {Object} data
   * @returns {Promise}
   */
  create: async (data) => {
    return api.post(BASE_URL, data);
  },

  /**
   * Actualiza un rol existente
   * @param {string|number} id
   * @param {Object} data
   * @returns {Promise}
   */
  update: async (id, data) => {
    return api.put(`${BASE_URL}/${id}`, data);
  },

  /**
   * Elimina un rol por su ID (soft delete: marca eliminado = true)
   * @param {string|number} id
   * @returns {Promise}
   */
  delete: async (id) => {
    return api.delete(`${BASE_URL}/${id}`);
  },

  /**
   * Restaura un rol eliminado (pone eliminado = false)
   * @param {string|number} id
   * @returns {Promise}
   */
  restore: async (id) => {
    return api.patch(`${BASE_URL}/${id}/restore`);
  },
};

export default rolService;
