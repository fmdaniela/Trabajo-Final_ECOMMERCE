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





// import api from './api';

// const BASE_URL = '/roles';

// const rolService = {
//   /**
//    * Obtiene todos los roles con paginación, búsqueda y orden
//    * @param {Object} params - { page, limit, search, sort, direction }
//    * @param {string} token - Token de autorización (opcional)
//    * @returns {Promise} - Promesa con los datos de roles
//    */
//   getAll: async (params = {}, token) => {
//     return api.get(BASE_URL, {
//       params,
//       ...(token && { headers: { Authorization: `Bearer ${token}` } }),
//     });
//   },

//   /**
//    * Obtiene un rol por su ID
//    * @param {string|number} id - ID del rol
//    * @param {string} token - Token de autorización (opcional)
//    * @returns {Promise} - Promesa con los datos del rol
//    */
//   getById: async (id, token) => {
//     return api.get(`${BASE_URL}/${id}`, {
//       ...(token && { headers: { Authorization: `Bearer ${token}` } }),
//     });
//   },

//   /**
//    * Crea un nuevo rol
//    * @param {Object} data - Datos del rol
//    * @param {string} token - Token de autorización (opcional)
//    * @returns {Promise} - Promesa con la respuesta de la creación
//    */
//   create: async (data, token) => {
//     return api.post(BASE_URL, data, {
//       ...(token && { headers: { Authorization: `Bearer ${token}` } }),
//     });
//   },

//   /**
//    * Actualiza un rol existente
//    * @param {string|number} id - ID del rol
//    * @param {Object} data - Datos actualizados
//    * @param {string} token - Token de autorización (opcional)
//    * @returns {Promise} - Promesa con la respuesta de la actualización
//    */
//   update: async (id, data, token) => {
//     return api.put(`${BASE_URL}/${id}`, data, {
//       ...(token && { headers: { Authorization: `Bearer ${token}` } }),
//     });
//   },

//   /**
//    * Elimina un rol por su ID (soft delete: marca eliminado = true)
//    * @param {string|number} id - ID del rol
//    * @param {string} token - Token de autorización (opcional)
//    * @returns {Promise} - Promesa con la respuesta de la eliminación
//    */
//   delete: async (id, token) => {
//     return api.delete(`${BASE_URL}/${id}`, {
//       ...(token && { headers: { Authorization: `Bearer ${token}` } }),
//     });
//   },

//   /**
//    * Restaura un rol eliminado (pone eliminado = false)
//    * @param {string|number} id - ID del rol
//    * @param {string} token - Token de autorización (opcional)
//    * @returns {Promise} - Promesa con la respuesta de la restauración
//    */
//   restore: async (id, token) => {
//     return api.patch(`${BASE_URL}/${id}/restore`, null, {
//       ...(token && { headers: { Authorization: `Bearer ${token}` } }),
//     });
//   },
// };

// export default rolService;
