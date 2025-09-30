import api from './api'; // tu instancia de Axios con baseURL

// Traer carrito activo
export const getCarritoActivo = async () => {
  const response = await api.get('/carritos/activo');
  return response.data;
};

// Agregar producto al carrito
export const agregarProductoCarrito = async (productoId, cantidad = 1) => {
  const response = await api.post('/carritos/productos', { productoId, cantidad });
  return response.data;
};

// Actualizar cantidad de producto
export const actualizarCantidadCarrito = async (productoId, cantidad) => {
  const response = await api.put(`/carritos/productos/${productoId}`, { cantidad });
  return response.data;
};

// Eliminar producto del carrito
export const eliminarProductoCarrito = async (productoId) => {
  const response = await api.delete(`/carritos/productos/${productoId}`);
  return response.data;
};











// // src/services/carritoService.js
// import api from "./api";

// // Traer carrito activo
// export const getCarritoActivo = async () => {
//   const { data } = await api.get("/carritos/activo");
//   return data;
// };

// // Agregar producto al carrito
// export const agregarProductoCarrito = async (productoId, cantidad) => {
//   const { data } = await api.post("/carritos/productos", {
//     productoId,
//     cantidad
//   });
//   return data;
// };

// // Actualizar cantidad de un producto
// export const actualizarCantidadCarrito = async (productoId, cantidad) => {
//   const { data } = await api.put(`/carritos/productos/${productoId}`, {
//     cantidad
//   });
//   return data;
// };

// // Eliminar producto del carrito
// export const eliminarProductoCarrito = async (productoId) => {
//   const { data } = await api.delete(`/carritos/productos/${productoId}`);
//   return data;
// };

// // Finalizar compra
// export const finalizarCarrito = async (idDireccion) => {
//   const { data } = await api.post("/carritos/finalizar", { idDireccion });
//   return data;
// };
