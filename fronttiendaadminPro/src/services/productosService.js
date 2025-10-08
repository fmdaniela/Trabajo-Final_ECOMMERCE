// src/services/productoService.js
import api from './api';

const BASE_URL = '/productos';

const productoService = {
  /**
   * Obtiene todos los productos con paginación y filtros
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

    return api.get(`${BASE_URL}/admin`, { 
      params,
      headers: token && { Authorization: `Bearer ${token}` }
    });
  },

  /**
   * Obtiene un producto por ID
   */
  getById: async (id, token) => {
    return api.get(`${BASE_URL}/${id}`, {
      headers: token && { Authorization: `Bearer ${token}` }
    });
  },

  /**
   * Crea un producto
   */
  create: async (data, token) => {
    return api.post(BASE_URL, data, {
      headers: token && { Authorization: `Bearer ${token}` }
    });
  },

  /**
   * Actualiza un producto
   */
  update: async (id, data, token) => {
    return api.put(`${BASE_URL}/${id}`, data, {
      headers: token && { Authorization: `Bearer ${token}` }
    });
  },

  /**
   * Elimina un producto
   */
  delete: async (id, token) => {
    return api.delete(`${BASE_URL}/${id}`, {
      headers: token && { Authorization: `Bearer ${token}` }
    });
  },

  /**
   * Restaura o activa/desactiva un producto
   */
  restore: async (id, token) => {
    return api.patch(`${BASE_URL}/${id}/restore`, {}, {
      headers: token && { Authorization: `Bearer ${token}` }
    });
  },
  
  toggleActivo: async (id, token) => {
     return api.patch(`${BASE_URL}/${id}/toggle`, {}, {
       headers: token && { Authorization: `Bearer ${token}` }
     });
  }
};

export default productoService;




















// import API from './api';

// const BASE_URL = '/productos';

// const productosService = {
//   getAll: async (options = {}, token) => {
//     const { page = 1, limit = 10, search, activo, sort, direction } = options;

//     const params = {
//       page,
//       limit,
//       ...(search && { search }),
//       ...(activo !== undefined && { activo }),
//       ...(sort && { sort }),
//       ...(direction && { direction }),
//     };

//     return API.get(BASE_URL, {
//       params,
//       headers: token && { Authorization: `Bearer ${token}` }
//     });
//   },

//   getById: async (id, token) => {
//     return API.get(`${BASE_URL}/${id}`, {
//       headers: token && { Authorization: `Bearer ${token}` }
//     });
//   },

//   create: async (data, token) => {
//     return API.post(BASE_URL, data, {
//       headers: token && { Authorization: `Bearer ${token}` }
//     });
//   },

//   update: async (id, data, token) => {
//     return API.put(`${BASE_URL}/${id}`, data, {
//       headers: token && { Authorization: `Bearer ${token}` }
//     });
//   },

//   delete: async (id, token) => {
//     return API.delete(`${BASE_URL}/${id}`, {
//       headers: token && { Authorization: `Bearer ${token}` }
//     });
//   },

//   toggleActivo: async (id, token) => {
//     return API.patch(`${BASE_URL}/${id}/toggle`, {}, {
//       headers: token && { Authorization: `Bearer ${token}` }
//     });
//   }
// };

// export default productosService;