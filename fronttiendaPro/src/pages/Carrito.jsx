import { useCarrito } from "../context/CarritoContext"; 
import { TrashIcon, PlusIcon, MinusIcon } from "@heroicons/react/24/solid";
import { TruckIcon, ArrowPathIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function Carrito() {
  const navigate = useNavigate();
  const {
    productosCarrito,
    actualizarCantidad,
    eliminarProducto,
  } = useCarrito();

  // Calcular total del carrito con redondeo
  const totalCarrito = productosCarrito.reduce((total, prod) => {
    const precio = prod.precioUnitario || prod.Producto?.precio || 100;
    return total + precio * prod.cantidad;
  }, 0);

  const totalRedondeado = totalCarrito.toFixed(2);

  // Calcular cantidad total de ítems
  const totalItems = productosCarrito.reduce(
    (acc, prod) => acc + prod.cantidad,
    0
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Tu Carrito</h1>

      {productosCarrito.length === 0 ? (
        <div className="flex flex-col md:flex-row items-start gap-6 mt-12">
          {/* Columna izquierda: mensaje carrito vacío */}
          <div className="flex-2 w-full border rounded-lg p-6 bg-gray-50 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-16 h-16 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m5-9v9m4-9v9m4-9l2 9"
                />
              </svg>
              <p className="text-gray-700 text-lg font-medium">
                Agregá productos y conseguí <span className="font-bold">envío gratis</span>.
              </p>
            </div>

            <button
              onClick={() => (window.location.href = "/")}
              className="px-5 py-2 bg-pink-600 text-white rounded-lg shadow hover:bg-pink-700 transition cursor-pointer"
            >
              Descubrir productos
            </button>
          </div>

          {/* Columna derecha: resumen de compra vacío */}
          <div className="flex-1 w-full border rounded-lg p-4 bg-gray-50">
            <h2 className="text-lg font-semibold mb-2">Resumen de Compra</h2>
            <hr className="mb-2" />
            <p className="text-sm text-gray-500">
              Acá verás los importes de tu compra una vez que agregues productos.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Columna izquierda: lista de productos */}
          <div className="md:col-span-2 space-y-4">
            {productosCarrito.map((prod) => {
              const precio = prod.precioUnitario || prod.Producto?.precio || 100;
              const subtotal = (precio * prod.cantidad).toFixed(2);

              return (
                <div
                  key={prod.id}
                  className="flex items-center justify-between p-4 border rounded"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={prod.Producto?.imagenUrl || "/placeholder.png"}
                      alt={prod.Producto?.nombre || prod.nombre}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium">{prod.Producto?.nombre || prod.nombre}</p>
                      <p className="text-gray-500 text-sm">Subtotal: ${subtotal}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        actualizarCantidad(prod.idProducto, Math.max(prod.cantidad - 1, 1))
                      }
                      className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      <MinusIcon className="w-4 h-4 text-gray-700" />
                    </button>

                    <span>{prod.cantidad}</span>

                    <button
                      onClick={() => actualizarCantidad(prod.idProducto, prod.cantidad + 1)}
                      className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      <PlusIcon className="w-4 h-4 text-gray-700" />
                    </button>

                    <button
                      onClick={() => eliminarProducto(prod.idProducto)}
                      className="p-1 bg-red-500 rounded hover:bg-red-600"
                    >
                      <TrashIcon className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Columna derecha: resumen de compra */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <h2 className="text-lg font-semibold mb-2">Resumen de Compra</h2>
            <hr className="mb-2" />

            {/* Subtotal */}
            <p className="text-sm text-gray-600 flex justify-between">
              <span>Subtotal ({totalItems} productos):</span>
              <span>${totalRedondeado}</span>
            </p>

            {/* Envío */}
            <p className="text-sm text-gray-600 flex justify-between">
              <span>Envío:</span>
              <span className="text-green-600 font-semibold">Gratis</span>
            </p>

            {/* Descuento */}
            <p className="text-sm text-gray-600 flex justify-between">
              <span>Descuento envío gratis:</span>
              <span>-$0</span>
            </p>

            <hr className="my-2" />

            {/* Total */}
            <p className="text-lg font-bold flex justify-between">
              <span>Total:</span>
              <span>${totalRedondeado}</span>
            </p>

            <button
              onClick={() =>
                Swal.fire({
                  title: "¡Gracias por tu compra!",
                  text: "Tu pedido está en proceso 🚚",
                  icon: "success",
                  confirmButtonText: "Aceptar",
                  confirmButtonColor: "#ec4899",
                }).then(() => {
                  navigate("/");
                })
              }
              className="w-full mt-4 bg-pink-600 text-white py-2 rounded hover:bg-pink-700 cursor-pointer"
            >
              Ir a Pagar
            </button>
            
            <Link
              to="/productos"
              className="block text-center mt-2 text-blue-600 hover:underline font-semibold"
            >
              Seguir comprando
            </Link>
            
            {/* Bloque de beneficios */}
            <div className="mt-6 space-y-3 text-gray-700">
              <div className="flex items-center space-x-2">
                <TruckIcon className="w-5 h-5 text-green-600" />
                <span className="text-green-600">
                  Envío gratis en compras mayores a $5.000
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <ArrowPathIcon className="w-5 h-5 text-cyan-600" />
                <span className="text-cyan-600">
                  Cambios y devoluciones sin costo
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <ShieldCheckIcon className="w-5 h-5 text-cyan-600" />
                <span className="text-cyan-600">Compra protegida</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Carrito;



// import { useCarrito } from "../context/CarritoContext";
// import { TrashIcon, PlusIcon, MinusIcon } from "@heroicons/react/24/solid";
// import { TruckIcon, ArrowPathIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";
// import { Link } from "react-router-dom";

// function Carrito() {
//   const {
//     productosCarrito,
//     actualizarCantidad,
//     eliminarProducto,
//   } = useCarrito();

//   // Calcular total del carrito con redondeo
//   const totalCarrito = productosCarrito.reduce((total, prod) => {
//     const precio = prod.precioUnitario || prod.Producto?.precio || 100;
//     return total + precio * prod.cantidad;
//   }, 0);

//   const totalRedondeado = totalCarrito.toFixed(2);

//   return (
//     <div className="p-6 max-w-6xl mx-auto">
//       <h1 className="text-2xl font-bold mb-4">Tu Carrito</h1>

//       {productosCarrito.length === 0 ? (
//         <div className="mt-12 border rounded-lg p-6 bg-gray-50 flex items-center justify-between">
//           {/* Mensaje con ícono */}
//           <div className="flex items-center space-x-4">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="w-16 h-16 text-gray-400"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m5-9v9m4-9v9m4-9l2 9"
//               />
//             </svg>
//             <p className="text-gray-700 text-lg font-medium">
//               Agregá productos y conseguí <span className="font-bold">envío gratis</span>.
//             </p>
//           </div>

//           {/* Botón */}
//           <button
//             onClick={() => (window.location.href = "/")}
//             className="px-5 py-2 bg-pink-600 text-white rounded-lg shadow hover:bg-pink-700 transition cursor-pointer"
//           >
//             Descubrir productos
//           </button>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {/* Columna izquierda: lista de productos */}
//           <div className="md:col-span-2 space-y-4">
//             {productosCarrito.map((prod) => {
//               const precio = prod.precioUnitario || prod.Producto?.precio || 100;
//               const subtotal = (precio * prod.cantidad).toFixed(2);

//               return (
//                 <div
//                   key={prod.id}
//                   className="flex items-center justify-between p-4 border rounded"
//                 >
//                   <div className="flex items-center space-x-4">
//                     <img
//                       src={prod.Producto?.imagenUrl || "/placeholder.png"}
//                       alt={prod.Producto?.nombre || prod.nombre}
//                       className="w-16 h-16 object-cover rounded"
//                     />
//                     <div>
//                       <p className="font-medium">{prod.Producto?.nombre || prod.nombre}</p>
//                       <p className="text-gray-500 text-sm">Subtotal: ${subtotal}</p>
//                     </div>
//                   </div>

//                   <div className="flex items-center space-x-2">
//                     <button
//                       onClick={() =>
//                         actualizarCantidad(prod.idProducto, Math.max(prod.cantidad - 1, 1))
//                       }
//                       className="p-1 bg-gray-200 rounded hover:bg-gray-300"
//                     >
//                       <MinusIcon className="w-4 h-4 text-gray-700" />
//                     </button>

//                     <span>{prod.cantidad}</span>

//                     <button
//                       onClick={() => actualizarCantidad(prod.idProducto, prod.cantidad + 1)}
//                       className="p-1 bg-gray-200 rounded hover:bg-gray-300"
//                     >
//                       <PlusIcon className="w-4 h-4 text-gray-700" />
//                     </button>

//                     <button
//                       onClick={() => eliminarProducto(prod.idProducto)}
//                       className="p-1 bg-red-500 rounded hover:bg-red-600"
//                     >
//                       <TrashIcon className="w-4 h-4 text-white" />
//                     </button>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>

//           {/* Columna derecha: resumen de compra */}
//           <div className="border rounded-lg p-4 bg-gray-50">
//             <h2 className="text-lg font-semibold mb-2">Resumen de Compra</h2>
//             <hr className="mb-2" />
//             <p className="text-sm text-gray-600">
//               Subtotal ({productosCarrito.length} productos): ${totalRedondeado}
//             </p>
//             <p className="text-sm text-gray-600">Envío: Gratis</p>
//             <p className="text-sm text-gray-600">Descuento envío gratis: -$0</p>
//             <hr className="my-2" />
//             <p className="text-lg font-bold">Total: ${totalRedondeado}</p>

//             <button
//               onClick={() => alert("Gracias por tu compra!")}
//               className="w-full mt-4 bg-pink-600 text-white py-2 rounded hover:bg-pink-700 cursor-pointer"
//             >
//               Ir a Pagar
//             </button>

//             <Link
//               to="/productos"
//               className="block text-center mt-2 text-blue-600 hover:underline"
//             >
//               Seguir comprando
//             </Link>

//             {/* Bloque de beneficios */}
//             <div className="mt-6 space-y-3 text-gray-700">
//               <div className="flex items-center space-x-2">
//                 <TruckIcon className="w-5 h-5 text-cyan-600" />
//                 <span>Envío gratis en compras mayores a $5.000</span>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <ArrowPathIcon className="w-5 h-5 text-cyan-600" />
//                 <span>Cambios y devoluciones sin costo</span>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <ShieldCheckIcon className="w-5 h-5 text-cyan-600" />
//                 <span>Compra protegida</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Carrito;










