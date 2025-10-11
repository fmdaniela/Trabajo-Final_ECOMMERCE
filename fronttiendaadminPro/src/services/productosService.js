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
   * Soporta archivos con FormData (Multer)
   */
  create: async (data, token, isMultipart = false) => {
    const headers = { ...(token && { Authorization: `Bearer ${token}` }) };
    if (isMultipart) headers["Content-Type"] = "multipart/form-data";

    return api.post(BASE_URL, data, { headers });
  },

  /**
   * Actualiza un producto
   * Soporta archivos con FormData (Multer)
   */
  update: async (id, data, token, isMultipart = false) => {
    const headers = { ...(token && { Authorization: `Bearer ${token}` }) };
    if (isMultipart) headers["Content-Type"] = "multipart/form-data";

    return api.put(`${BASE_URL}/${id}`, data, { headers });
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
  
  // toggleActivo: async (id, token) => {
  //    return api.patch(`${BASE_URL}/${id}/toggle`, {}, {
  //      headers: token && { Authorization: `Bearer ${token}` }
  //    });
  // }
};

export default productoService;











// // src/services/productoService.js
// import api from './api';

// const BASE_URL = '/productos';

// const productoService = {
//   /**
//    * Obtiene todos los productos con paginación y filtros
//    */
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

//     return api.get(`${BASE_URL}/admin`, { 
//       params,
//       headers: token && { Authorization: `Bearer ${token}` }
//     });
//   },

//   /**
//    * Obtiene un producto por ID
//    */
//   getById: async (id, token) => {
//     return api.get(`${BASE_URL}/${id}`, {
//       headers: token && { Authorization: `Bearer ${token}` }
//     });
//   },

//   /**
//    * Crea un producto
//    */
//   create: async (data, token) => {
//     return api.post(BASE_URL, data, {
//       headers: token && { Authorization: `Bearer ${token}` }
//     });
//   },

//   /**
//    * Actualiza un producto
//    */
//   update: async (id, data, token) => {
//     return api.put(`${BASE_URL}/${id}`, data, {
//       headers: token && { Authorization: `Bearer ${token}` }
//     });
//   },

//   /**
//    * Elimina un producto
//    */
//   delete: async (id, token) => {
//     return api.delete(`${BASE_URL}/${id}`, {
//       headers: token && { Authorization: `Bearer ${token}` }
//     });
//   },

//   /**
//    * Restaura o activa/desactiva un producto
//    */
//   restore: async (id, token) => {
//     return api.patch(`${BASE_URL}/${id}/restore`, {}, {
//       headers: token && { Authorization: `Bearer ${token}` }
//     });
//   },
  
//   toggleActivo: async (id, token) => {
//      return api.patch(`${BASE_URL}/${id}/toggle`, {}, {
//        headers: token && { Authorization: `Bearer ${token}` }
//      });
//   }
// };

// export default productoService;




















