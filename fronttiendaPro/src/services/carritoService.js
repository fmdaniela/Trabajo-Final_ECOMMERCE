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


