import api from './api';

const imagenService = {
  getPorProducto: async (idProducto) => {
    const res = await api.get(`/productos/${idProducto}/imagenes`);
    return res.data;
  },
  eliminarImagen: async (id, token) => {
    const res = await api.delete(`/${id}`, {  
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  }
};

export default imagenService;



//No usamos const BASE_URL = '/imagenes' porque en routes tenemos montado sin sufijo las imagenes.
//Asi ya lo teniamos definido en el front de la tienda 

// import api from './api';

// const BASE_URL = '/imagenes';

// const imagenService = {
//   getPorProducto: async (idProducto) => {
//     const res = await api.get(`${BASE_URL}/productos/${idProducto}/imagenes`);
//     return res.data;
//   },
//   eliminarImagen: async (id, token) => {
//     const res = await api.delete(`${BASE_URL}/${id}`, {
//       headers: { Authorization: `Bearer ${token}` }
//     });
//     return res.data;
//   }
// };

// export default imagenService;

