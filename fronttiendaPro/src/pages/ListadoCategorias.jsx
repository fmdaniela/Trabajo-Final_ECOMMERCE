import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import categoriaService from "../services/categoriaService";
import CategoriaCard from "../components/CategoriaCard";

function ListadoCategorias() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const result = await categoriaService.obtenerCategoriasPublic();
        setCategorias(result.data || []); // solo los registros
        setLoading(false);
      } catch (err) {
        setError("Error al cargar las categorías");
        setLoading(false);
        console.error("Error al cargar las categorías:", err);
      }
    };

    fetchCategorias();
  }, []);

  // 🔹 Ir a ListadoProductos con el nombre de la categoría
  const handleCategoriaClick = (categoria) => {
    // pasamos el nombre en minúscula para que coincida con FiltersBar
    navigate(`/productos?categoria=${categoria.nombre.toLowerCase()}`);
  };

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
    <div className=" mt-4 px-4 sm:px-6 mb-10 w-[100%] flex justify-center flex-col items-center">
      <h1 className="text-3xl font-bold mb-4 text-pink-600">Categorías</h1>
      <br />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categorias.length === 0 ? (
          <p className="text-gray-500">No hay categorías disponibles</p>
        ) : (
          categorias.map((categoria) => (
            <CategoriaCard
              key={categoria.id}
              categoria={categoria}
              onClick={() => handleCategoriaClick(categoria)}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default ListadoCategorias;









