import useCupon from "../hooks/useCupon";
import { Link } from 'react-router-dom';
import { useCarrito } from "../context/CarritoContext";

function ProductCardFull({ producto }) {
  const { nombre, imagenUrl, precio, oferta, descuento } = producto;
  const { cuponActivo } = useCupon();

  const precioBase = parseFloat(precio) || 0;
  let mostrarPrecioFinal = precioBase;
  let mostrarDescuento = false;
  let porcentajeAplicado = 0;

  // Si hay cupón activo, aplica ese descuento global
  if (cuponActivo?.porcentajeDescuento > 0) {
    porcentajeAplicado = cuponActivo.porcentajeDescuento;
    mostrarPrecioFinal = precioBase - (precioBase * porcentajeAplicado) / 100;
    mostrarDescuento = true;
  } else if (oferta && descuento > 0) {
    // Si no hay cupón, pero sí oferta propia, Aplica descuento propio
    porcentajeAplicado = descuento;
    mostrarPrecioFinal = precioBase - (precioBase * porcentajeAplicado) / 100;
    mostrarDescuento = true;
  }

  return (
    <div className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-transform transform hover:scale-105 border">
      
      <img
        src={imagenUrl || "https://via.placeholder.com/300"}
        alt={nombre}
        className="w-full h-48 object-cover rounded-lg mb-4"
      />

      {/*Mostramos las etiquetas en las cards*/}
      {producto.etiquetas?.length > 0 && ( // evita errores si etiquetas está undefined (antes que cargue del fetch).
        <div className="flex flex-wrap gap-1 mb-2">
          {producto.etiquetas.slice(0, 3).map((etiqueta) => ( // con .slice(0, 3): mostramos solo las 3 primeras etiquetas. y con map(): recorremos y mostramos cada etiqueta con su texto.
            <span
              key={etiqueta.id}
              className="bg-pink-100 text-pink-600 text-xs font-medium px-2 py-1 rounded-full"
            >
              {etiqueta.texto}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">{nombre}</h3>
        <Link
          to={`/producto/${producto.id}`}
          className="text-sm text-blue-400 hover:underline"
        >
          Ver más
        </Link>
      </div>

      {/* Indicador de oferta visible solo si NO hay cupón activo */}
      {!cuponActivo && oferta && descuento > 0 && (
        <div className="mb-2">
          <span className="text-sm bg-red-100 text-red-600 px-2 py-1 rounded-full font-bold">
            ¡Oferta! -{descuento}%
          </span>
        </div>
      )}

      <div className="text-gray-800 text-lg">
        {mostrarDescuento ? (
          <>
            <span className="line-through text-sm text-gray-500 mr-2">
              ${precioBase.toFixed(2)}
            </span>
            <span className={`font-bold ${cuponActivo ? "text-blue-600" : "text-green-600"}`}>
              ${mostrarPrecioFinal.toFixed(2)}{" "}
              {cuponActivo && (
                <span className="text-xs">(-{porcentajeAplicado}%)</span>
              )}
            </span>
          </>
        ) : (
          <span className="font-bold">${precioBase.toFixed(2)}</span>
        )}
      </div>
    </div>
  );
}

export default ProductCardFull;

/*
↓  ← Usa useCupon() para acceder al cuponActivo
↓  ← Si hay cupón activo: aplica el descuento global
↓  ← Si no hay cupón pero hay oferta individual: aplica el descuento propio
↓  → Muestra precio final
*/