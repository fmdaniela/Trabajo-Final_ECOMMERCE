import { createContext, useContext, useState, useEffect } from "react";
import {
  getCarritoActivo,
  agregarProductoCarrito,
  actualizarCantidadCarrito,
  eliminarProductoCarrito
} from "../services/carritoService";
import { useAuth } from "./AuthContext"; // <-- importamos hook de auth

const CarritoContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useCarrito = () => useContext(CarritoContext);

export function CarritoProvider({ children }) {
  const [productosCarrito, setProductosCarrito] = useState([]);
  const [productoAgregado, setProductoAgregado] = useState(null);

  const { usuario } = useAuth(); // <-- obtenemos usuario

  // Traer carrito activo cuando cambia el usuario
  useEffect(() => {
    const fetchCarrito = async () => {
      if (!usuario) {
        // Si no hay usuario, limpiar carrito
        setProductosCarrito([]);
        return;
      }
      try {
        const data = await getCarritoActivo();
        setProductosCarrito(data.items || []);
      } catch (error) {
        console.log("Error cargando carrito:", error);
      }
    };
    fetchCarrito();
  }, [usuario]); // <-- se ejecuta al cambiar usuario

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

  return (
    <CarritoContext.Provider
      value={{
        productosCarrito,
        cantidadTotal,
        productoAgregado,
        agregarProducto,
        actualizarCantidad,
        eliminarProducto
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
}






// //contexto, hook y provider.
// import { createContext, useContext, useState, useEffect } from "react";
// import {
//   getCarritoActivo,
//   agregarProductoCarrito,
//   actualizarCantidadCarrito,
//   eliminarProductoCarrito
// } from "../services/carritoService";

// // 1. Crear el contexto
// const CarritoContext = createContext(null);

// // 2. Hook personalizado para consumir el carrito
// // eslint-disable-next-line react-refresh/only-export-components
// export const useCarrito = () => useContext(CarritoContext);

// // 3. Provider
// export function CarritoProvider({ children }) {
//   const [productosCarrito, setProductosCarrito] = useState([]);
//   const [productoAgregado, setProductoAgregado] = useState(null); // <-- para mostrar aviso

//   // Traer carrito activo del backend al montar
//   useEffect(() => {
//     const fetchCarrito = async () => {
//       try {
//         const data = await getCarritoActivo();
//         console.log("Carrito activo:", data);
//         setProductosCarrito(data.items || []);
//       } catch (error) {
//         console.log("Error cargando carrito:", error);
//       }
//     };
//     fetchCarrito();
//   }, []);

//   // Cantidad total de unidades
//   const cantidadTotal = productosCarrito.reduce(
//     (acc, prod) => acc + prod.cantidad,
//     0
//   );

//   // Funciones sincronizadas con backend
//   const agregarProducto = async (productoId, cantidad = 1) => {
//     try {
//       const data = await agregarProductoCarrito(productoId, cantidad);
//       setProductosCarrito(data.items || []);

//       // Mostrar aviso del producto agregado
//       const producto = data.items.find(p => p.idProducto === productoId); 
//       if (producto) {
//         setProductoAgregado(producto);
//         setTimeout(() => setProductoAgregado(null), 3000);
//       }

//     } catch (error) {
//       console.log("Error agregando producto:", error);
//     }
//   };

//   const actualizarCantidad = async (productoId, cantidad) => {
//     try {
//       const data = await actualizarCantidadCarrito(productoId, cantidad);
//       setProductosCarrito(data.items || []);
//     } catch (error) {
//       console.log("Error actualizando cantidad:", error);
//     }
//   };

//   const eliminarProducto = async (productoId) => {
//     try {
//       const data = await eliminarProductoCarrito(productoId);
//       setProductosCarrito(data.items || []);
//     } catch (error) {
//       console.log("Error eliminando producto:", error);
//     }
//   };

//   // 🔹 Nueva función para limpiar el carrito al hacer logout
//   const resetCarrito = () => {
//     setProductosCarrito([]);
//     setProductoAgregado(null);
//   };

//   return (
//     <CarritoContext.Provider
//       value={{
//         productosCarrito,
//         cantidadTotal,
//         productoAgregado,   // <-- aviso disponible
//         agregarProducto,
//         actualizarCantidad,
//         eliminarProducto,
//         resetCarrito  // <-- exponemos la función
//       }}
//     >
//       {children}
//     </CarritoContext.Provider>
//   );
// }
