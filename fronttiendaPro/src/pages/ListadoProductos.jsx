import { useEffect, useState } from "react";
import productoService from "../services/productoService";
import ProductCardFull from "../components/ProductCardFull";
import CuponForm from "../components/CuponForm";

function ListadoProductos() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const data = await productoService.obtenerProductos();
        console.log('Productos con etiquetas:', data); 
        setProductos(data);
      } catch (error) {
        console.error("Error al cargar productos:", error);
        setError("No se pudieron cargar los productos.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  if (loading) return <div className="p-4 text-center">Cargando productos...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  // 🔹 Filtrar productos activos antes del return
  const productosActivos = productos.filter(p => p.activo);

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <CuponForm />
      <h1 className="text-2xl font-bold text-center mb-6 text-[#E91E63]">Todos nuestros productos</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {productosActivos.map((producto) => ( //Acceder al array directamente al map
          <ProductCardFull key={producto.id} producto={producto} />
        ))}
      </div>
    </div>
  );
}

export default ListadoProductos;

/*
↓  ← Llama al backend para obtener productos
↓  ← Muestra <CuponForm /> y todas las <ProductCardFull />
*/