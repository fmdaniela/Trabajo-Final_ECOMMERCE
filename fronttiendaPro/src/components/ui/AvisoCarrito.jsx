import { useCarrito } from "../../context/CarritoContext";

export default function AvisoCarrito() {
  const { productoAgregado } = useCarrito();

  if (!productoAgregado) return null;

  return (
    <div className="fixed top-4 right-4 bg-white shadow-lg rounded-lg p-4 border border-gray-200 w-80 z-50 animate-fade-in-out">
      <h4 className="text-green-600 font-semibold">¡Producto agregado!</h4>
      <div className="flex items-center mt-2">
        <img
          src={
            productoAgregado.Producto?.imagenUrl || productoAgregado.imagenUrl
          }
          alt={
            productoAgregado.Producto?.nombre || productoAgregado.nombre
          }
          className="w-16 h-16 object-cover rounded mr-3 border"
        />
        <div>
          <p className="font-medium">
            {productoAgregado.Producto?.nombre || productoAgregado.nombre}
          </p>
          <p className="text-sm text-gray-600">
            Cantidad: {productoAgregado.cantidad}
          </p>
          <p className="text-sm font-semibold text-gray-800">
            ${productoAgregado.Producto?.precio || productoAgregado.precioUnitario}
          </p>
        </div>
      </div>
      <div className="mt-3 text-right">
        <a
          href="/carrito"
          className="text-pink-600 hover:underline text-sm font-medium"
        >
          Ir al carrito →
        </a>
      </div>
    </div>
  );
}








