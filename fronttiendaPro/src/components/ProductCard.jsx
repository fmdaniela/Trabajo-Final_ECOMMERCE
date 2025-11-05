import { Link } from "react-router-dom";
import useCupon from "../hooks/useCupon";
import { Eye, ShoppingBag  } from "lucide-react";

function ProductCard({ producto }) {
  const { nombre, imagenUrl, imagen, precio, descuento, destacado, oferta } = producto;
  const { cuponActivo } = useCupon();

  const imagenFinal = imagen || imagenUrl;
  const precioBase = parseFloat(precio) || 0;

  // === Variables de cálculo ===
  let mostrarPrecioFinal = precioBase;
  let mostrarDescuento = false;
  let porcentajeAplicado = 0;

  // === Aplica CUPÓN global si existe ===
  if (cuponActivo?.porcentajeDescuento > 0) {
    porcentajeAplicado = cuponActivo.porcentajeDescuento;
    mostrarPrecioFinal = precioBase - (precioBase * porcentajeAplicado) / 100;
    mostrarDescuento = true;
  } 
  // === Si no hay cupón, aplica DESCUENTO propio del producto ===
  else if (oferta && descuento > 0) {
    porcentajeAplicado = descuento;
    mostrarPrecioFinal = precioBase - (precioBase * porcentajeAplicado) / 100;
    mostrarDescuento = true;
  }

  return (
    <div className="bg-white w-[96%] rounded-xl shadow-sm hover:shadow-lg transition overflow-hidden flex flex-col">
      <div className="relative">
        <img  
          src={
            imagenFinal?.startsWith("http")
              ? imagenFinal
              : `http://localhost:3000${imagenFinal}`
          }
          alt={nombre}
          className="w-full h-60 object-cover transform hover:scale-110 transition duration-300"
        />

        {/* Badge de destacado */}
        {destacado && (
          <span className="absolute top-2 left-2 bg-emerald-500 text-white text-xs px-2 py-1 rounded-full uppercase font-semibold">
            ⭐ Destacado
          </span>
        )}

        {/* Badge de descuento u oferta */}
        {mostrarDescuento && (
          <span
            className={`absolute top-2 right-2 text-white text-xs px-2 py-1 rounded-full font-semibold ${
              cuponActivo ? "bg-blue-600" : "bg-red-600"
            }`}
          >
            -{porcentajeAplicado}%
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-grow justify-between">
        {/* Nombre + Iconos */}
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-sm text-gray-800">{nombre}</h3>

          <div className="flex gap-2 items-center">
            {/* Ver detalle */}
            <Link
              to={`/producto/${producto.id}`}
              className="text-emerald-500 hover:text-emerald-600"
              title="Ver detalle"
            >
              <Eye size={22} />
            </Link>

            {/* Ícono de carrito (decorativo / navegación) */}
            <Link
              to={`/producto/${producto.id}`}
              className="text-pink-500 hover:text-pink-600"
              title="Seleccionar talle y color"
            >
              <ShoppingBag  size={20} />
            </Link>
          </div>
        </div>

        {/* Precio */}
        <div className="text-lg font-bold text-gray-800">
          {mostrarDescuento ? (
            <>
              <span className="line-through text-sm text-gray-400 mr-2">
                ${precioBase.toFixed(2)}
              </span>
              <span
                className={`font-bold ${
                  cuponActivo ? "text-blue-600" : "text-green-600"
                }`}
              >
                ${mostrarPrecioFinal.toFixed(2)}
              </span>
            </>
          ) : (
            <span>${precioBase.toFixed(2)}</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
