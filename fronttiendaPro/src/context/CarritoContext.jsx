import { createContext, useContext, useState, useEffect } from "react";
import {
  getCarritoActivo,
  agregarProductoCarrito,
  actualizarCantidadCarrito,
  eliminarProductoCarrito
} from "../services/carritoService";
import { useAuth } from "./AuthContext";

const CarritoContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useCarrito = () => useContext(CarritoContext);

export function CarritoProvider({ children }) {
  const [productosCarrito, setProductosCarrito] = useState([]);
  const [productoAgregado, setProductoAgregado] = useState(null);

  const { usuario } = useAuth();

  // Traer carrito activo cuando cambia el usuario
  useEffect(() => {
    const fetchCarrito = async () => {
      if (!usuario) {
        setProductosCarrito([]);
        return;
      }
      try {
        const data = await getCarritoActivo();
        console.log("🛒 ITEM CARRITO:", data.items[0]);
        setProductosCarrito(data.items || []);
      } catch (error) {
        console.log("Error cargando carrito:", error);
      }
    };
    fetchCarrito();
  }, [usuario]);

  const cantidadTotal = productosCarrito.reduce(
    (acc, prod) => acc + prod.cantidad,
    0
  );

  const agregarProducto = async (productoId, cantidad = 1) => {
    try {
      const data = await agregarProductoCarrito(productoId, cantidad);
      setProductosCarrito(data.items || []);

      const producto = data.items.find(p => p.idProducto === productoId);
      if (producto) {
        setProductoAgregado(producto);
        setTimeout(() => setProductoAgregado(null), 3000);
      }
    } catch (error) {
      console.log("Error agregando producto:", error);
    }
  };

  const actualizarCantidad = async (productoId, cantidad) => {
    try {
      const data = await actualizarCantidadCarrito(productoId, cantidad);
      setProductosCarrito(data.items || []);
    } catch (error) {
      console.log("Error actualizando cantidad:", error);
    }
  };

  const eliminarProducto = async (productoId) => {
    try {
      const data = await eliminarProductoCarrito(productoId);
      setProductosCarrito(data.items || []);
    } catch (error) {
      console.log("Error eliminando producto:", error);
    }
  };

  // 🧹 Vaciar carrito completamente (para usar al pagar)
  const vaciarCarrito = () => {
    setProductosCarrito([]);
  };

  return (
    <CarritoContext.Provider
      value={{
        productosCarrito,
        cantidadTotal,
        productoAgregado,
        agregarProducto,
        actualizarCantidad,
        eliminarProducto,
        vaciarCarrito, // exportamos la nueva función
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
}


