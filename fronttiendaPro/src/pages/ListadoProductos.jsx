import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom"; 
import productoService from "../services/productoService";
import ProductCard from "../components/ProductCard";
import CuponForm from "../components/CuponForm";
import FiltersBar from "../components/FiltersBar";
import { MoveLeft, MoveRight } from "lucide-react";
import LoadingSpinner from "../components/ui/LoadingSpinner"; 

function ListadoProductos() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estado de filtros
  const [filtros, setFiltros] = useState({
    orden: "",
    busqueda: "",
    categoria: "",
  });

  // Estado de paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  // Query params
  const [searchParams, setSearchParams] = useSearchParams();

  // Leer query params y actualizar filtros
  useEffect(() => {
    const cat = searchParams.get("categoria") || "";
    const busqueda = searchParams.get("busqueda") || "";
    const orden = searchParams.get("orden") || "";

    setFiltros({ categoria: cat, busqueda, orden });
    setPaginaActual(1);
  }, [searchParams.toString()]);

  // Cargar productos del backend (paginados)
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setLoading(true);
        const data = await productoService.obtenerProductos({
          page: paginaActual,
          limit: 8,
          categoria: filtros.categoria,
          busqueda: filtros.busqueda,
          orden: filtros.orden,
        });

        setProductos(data.productos || []);
        setTotalPaginas(data.pagination?.totalPages || 1);
      } catch (error) {
        console.error("Error al cargar productos:", error);
        setError("No se pudieron cargar los productos.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, [paginaActual, filtros]);

  // Manejar cambio de filtros desde la barra
  const handleFiltrosChange = (nuevosFiltros) => {
    setFiltros((prev) => ({ ...prev, ...nuevosFiltros }));
    setPaginaActual(1);

    // Actualizar query params completos
    const params = new URLSearchParams(searchParams);
    if (nuevosFiltros.categoria !== undefined) {
      if (nuevosFiltros.categoria) params.set("categoria", nuevosFiltros.categoria);
      else params.delete("categoria");
    }
    if (nuevosFiltros.busqueda !== undefined) {
      if (nuevosFiltros.busqueda) params.set("busqueda", nuevosFiltros.busqueda);
      else params.delete("busqueda");
    }
    if (nuevosFiltros.orden !== undefined) {
      if (nuevosFiltros.orden) params.set("orden", nuevosFiltros.orden);
      else params.delete("orden");
    }
    setSearchParams(params);
  };

  // 🔹 Generar array de páginas
  const paginas = Array.from({ length: totalPaginas }, (_, i) => i + 1);

  // ==========================
  // Renderizado
  // ==========================
  if (loading) return <LoadingSpinner />; 
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <CuponForm />

      {/* Barra de filtros */}
      <FiltersBar
        onChange={handleFiltrosChange}
        categoriaInicial={filtros.categoria}
        ordenInicial={filtros.orden}
      />

      <h1 className="text-2xl font-bold text-center mb-6 text-[#E91E63]">
        Todos nuestros productos
      </h1>

      {productos.length === 0 ? (
        <p className="text-center text-gray-500">
          No se encontraron productos que coincidan.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productos.map((producto) => (
              <ProductCard key={producto.id} producto={producto} />
            ))}
          </div>

          {/* Paginación */}
          {totalPaginas > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
              <button
                onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
                disabled={paginaActual === 1 || loading}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                <MoveLeft className="text-pink-600" />
              </button>

              {paginas.map((num) => (
                <button
                  key={num}
                  onClick={() => setPaginaActual(num)}
                  disabled={loading}
                  className={`px-3 py-1 rounded ${
                    num === paginaActual
                      ? "bg-pink-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {num}
                </button>
              ))}

              <button
                onClick={() => setPaginaActual((prev) => Math.min(prev + 1, totalPaginas))}
                disabled={paginaActual === totalPaginas || loading}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                <MoveRight className="text-pink-600" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ListadoProductos;



