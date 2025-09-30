import { StarIcon, HeartIcon, ShoppingCartIcon } from '@heroicons/react/24/solid';
import { useCarrito } from "../context/CarritoContext";

function ProductCard({ producto }) {
  const { agregarProducto } = useCarrito(); // ✅ traemos la función del contexto

  const { nombre, imagenUrl, imagen, precio, descuento, destacado } = producto;

  const imagenFinal = imagen || imagenUrl;

  const precioNum = Number(precio);
  const precioFinal =
    descuento > 0
      ? (precioNum * (1 - descuento / 100)).toFixed(2)
      : precioNum.toFixed(2);

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition overflow-hidden flex flex-col">
      <div className="relative">
        <img
          src={imagenFinal}
          alt={nombre}
          className="w-full h-60 object-cover transform hover:scale-105 transition duration-300"
        />
        {destacado && (
          <span className="absolute top-2 left-2 bg-emerald-500 text-white text-xs px-2 py-1 rounded-full uppercase font-semibold">
            {destacado}
          </span>
        )}
        {descuento > 0 && (
          <span className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full font-semibold">
            {descuento}% OFF
          </span>
        )}
        <button className="absolute bottom-2 right-2 bg-white p-1 rounded-full shadow-md hover:bg-pink-100 cursor-pointer">
          <HeartIcon className="w-5 h-5 text-pink-300" />
        </button>
      </div>

      <div className="p-4 flex flex-col flex-grow justify-between">
        <h3 className="font-semibold text-sm text-gray-800 mb-1">{nombre}</h3>

        <div className="text-pink-600 font-bold text-lg mb-3">${precioFinal}</div>

        <button
          onClick={() => agregarProducto(producto.id, 1)}
          className="flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-[#E91E63] text-sm font-semibold px-4 py-2 rounded cursor-pointer"
        >
          <ShoppingCartIcon className="w-5 h-5" />
          AÑADIR AL CARRITO
        </button>

      </div>
    </div>
  );
}

export default ProductCard;




























// import { StarIcon, HeartIcon, ShoppingCartIcon } from '@heroicons/react/24/solid';
// import { useCarrito } from "../context/CarritoContext";

// function ProductCard({ producto }) {
//   const { nombre, imagenUrl, imagen, precio, descuento, destacado,} = producto; //Saqué el siguiente atributo:  rating 

//   const imagenFinal = imagen || imagenUrl;

//   const precioNum = Number(precio); //Lo incluimos xq daba error: precio.toFixed is not a function. Esto significa que el campo precio no es un número, y por lo tanto no se puede aplicar toFixed() sobre él. Si producto.precio llega como un string (por ejemplo "12000" en vez de 12000), eso rompe.
//   const precioFinal = descuento > 0
//     ? (precioNum * (1 - descuento / 100)).toFixed(2) //antes decia precio y lo cambiamos por precioNum
//     : precioNum.toFixed(2);
    
//   // const ratingNum = Number(rating) || 0; //Asegura que rating sea un número. Si no hay rating, asumimos 0. Lo usamos en el render. Antes decía rating no ratingNum

//   return (
//     <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition overflow-hidden flex flex-col">
//       <div className="relative">
//         <img
//           src={imagenFinal}
//           alt={nombre}
//           className="w-full h-60 object-cover transform hover:scale-105 transition duration-300"
//         />
//         {destacado && (
//           <span className="absolute top-2 left-2 bg-emerald-500 text-white text-xs px-2 py-1 rounded-full uppercase font-semibold">
//             {destacado}
//           </span>
//         )}
//         {descuento > 0 && (
//           <span className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full font-semibold">
//             {descuento}% OFF
//           </span>
//         )}
//         <button className="absolute bottom-2 right-2 bg-white p-1 rounded-full shadow-md hover:bg-pink-100 cursor-pointer">
//           <HeartIcon className="w-5 h-5 text-pink-300" />
//         </button>
//       </div>

//       <div className="p-4 flex flex-col flex-grow justify-between">
//         <h3 className="font-semibold text-sm text-gray-800 mb-1">{nombre}</h3>
        
//         {/* <div className="flex items-center text-sm text-gray-600 mb-2">
//           {[...Array(5)].map((_, i) => (
//             <StarIcon
//               key={i}
//               className={`w-4 h-4 mr-1 ${
//                 i < Math.round(ratingNum) ? 'text-yellow-400' : 'text-gray-300'
//               }`}
//             />
//           ))}
//           <span className="ml-1 text-xs text-gray-500">({ratingNum})</span>
//         </div> */}

//         <div className="text-pink-600 font-bold text-lg mb-3">${precioFinal}</div>

//         <button
//           onClick={() => agregarProducto({ id: producto.id, cantidad: 1 })}
//           className="flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-[#E91E63] text-sm font-semibold px-4 py-2 rounded cursor-pointer"
//         >
//           <ShoppingCartIcon className="w-5 h-5" />
//           AÑADIR AL CARRITO
//         </button>
//       </div>
//     </div>
//   );
// }

// export default ProductCard;

