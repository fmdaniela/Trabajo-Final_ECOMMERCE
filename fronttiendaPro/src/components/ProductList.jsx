import { useEffect, useState } from "react";
import productosService from "../services/productoService";
import ProductCard from "./ProductCard";
import LoadingSpinner from "./ui/LoadingSpinner";
import ErrorMessage from "./ui/ErrorMessage";

function ProductList({ filtros = { orden: "mayor_precio", busqueda: "" } }) {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const data = await productosService.getDestacados();
        setProductos(data);
      } catch (err) {
        console.error("Error al cargar productos destacados:", err);
        setError("No se pudieron cargar los productos destacados");
      } finally {
        setLoading(false);
      }
    };

    cargarProductos();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage mensaje={error} />;

  // ===============================
  // 🔍 APLICAR FILTROS EN FRONTEND
  // ===============================

  let productosFiltrados = [...productos];

  // 🔹 Filtro de búsqueda por nombre
  if (filtros.busqueda) {
    const termino = filtros.busqueda.toLowerCase();
    productosFiltrados = productosFiltrados.filter((p) =>
      p.nombre.toLowerCase().includes(termino)
    );
  }

  // 🔹 Ordenar por precio
  if (filtros.orden === "menor_precio") {
    productosFiltrados.sort((a, b) => a.precio - b.precio);
  } else if (filtros.orden === "mayor_precio") {
    productosFiltrados.sort((a, b) => b.precio - a.precio);
  } else if (filtros.orden === "destacado") {
    productosFiltrados.sort((a, b) => b.destacado - a.destacado);
  }

  return (
    <section className="py-10 px-4 max-w-screen-xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold mb-4 text-pink-600">DESTACADOS</h2>
        <p className="text-gray-600">Los favoritos de nuestra comunidad</p>
      </div>

      {productosFiltrados.length === 0 ? (
        <p className="text-center text-gray-500">
          No se encontraron productos que coincidan.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {productosFiltrados.map((producto) => (
            <ProductCard key={producto.id} producto={producto} />
          ))}
        </div>
      )}
    </section>
  );
}

export default ProductList;

