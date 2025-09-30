import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import categoriaService from "../services/categoriaService";
import ProductCard from "../components/ProductCard";

const ListadoProductosPorCategoria = () => {
  const { id } = useParams(); // id de la categoría
  const [productos, setProductos] = useState([]);
  const [categoria, setCategoria] = useState(null);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategoria = async () => {
    try {
      const response = await categoriaService.obtenerCategoriasPublic();
      const cat = response.data.find((c) => c.id === parseInt(id));
      if (!cat) {
        setError("Categoría no encontrada o inactiva");
        setLoading(false);
        return;
      }
      setCategoria(cat);
    } catch (err) {
      console.error("Error al cargar la categoría:", err);
      setError("Error al cargar la categoría");
    }
  };

  const fetchProductos = async () => {
    try {
      setLoading(true);
      const response = await categoriaService.obtenerProductosPorCategoriaPublic(id);
      setProductos(response.data);
      setPagination(response.pagination);
      setLoading(false);
    } catch (err) {
      console.error(`Error al obtener productos de la categoría ${id}:`, err);
      setError("Error al cargar los productos");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoria();
    fetchProductos();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-4 text-center">{error}</div>;
  }

  return (
    <div className="mt-10 px-4 sm:px-6">
      <h1 className="text-2xl text-[#E91E63] font-bold mb-6">
        {categoria?.nombre || "Categoría"}
      </h1>

      {productos.length === 0 ? (
        <p className="text-gray-500">No hay productos disponibles en esta categoría</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {productos.map((producto) => (
            <ProductCard key={producto.id} producto={producto} />
          ))}
        </div>
      )}

      {/* Paginación básica */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: pagination.totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={`px-3 py-1 rounded border ${
                pagination.currentPage === i + 1
                  ? "bg-pink-600 text-white"
                  : "bg-white text-pink-600"
              }`}
              onClick={() => fetchProductos(i + 1)} // Para paginar necesitarías modificar el service para aceptar `page`
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      <div className="mt-6">
        <Link
          to="/categorias"
          className="inline-block bg-[#E91E63] hover:bg-[#d81b60] text-white font-medium py-2 px-4 rounded transition-colors"
        >
          Volver a categorías
        </Link>
      </div>
    </div>
  );
};

export default ListadoProductosPorCategoria;

