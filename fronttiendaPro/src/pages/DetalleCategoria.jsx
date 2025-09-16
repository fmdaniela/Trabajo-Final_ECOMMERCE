import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import categoriaService from '../services/categoriaService';

const DetalleCategoria = () => {
  const { id } = useParams();
  const [categoria, setCategoria] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategoria = async () => {
      try {
        const data = await categoriaService.obtenerCategoriaPorId(id);
        setCategoria(data);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar la categoría');
        setLoading(false);
        console.error('Error al cargar la categoría:', err);
      }
    };

    fetchCategoria();
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

  if (!categoria) {
    return <div className="text-center p-4">No se encontró la categoría</div>;
  }

  return (
    <div className="mt-20 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">{categoria.nombre}</h1>
          <div className="mb-6">
            <img 
              src={categoria.imagenUrl} 
              alt={categoria.nombre} 
              className="w-full h-64 object-cover rounded-md"
            />
          </div>
          <div className="space-y-2">
            <p className="text-gray-700">
              <span className="font-semibold">Estado:</span> 
              <span className={`ml-2 px-2 py-1 rounded text-sm ${categoria.activa ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {categoria.activa ? 'Activa' : 'Inactiva'}
              </span>
            </p>
          </div>
          <div className="mt-6">
            <Link to="/categorias" className="inline-block bg-[#E91E63] hover:bg-[#d81b60] text-white font-medium py-2 px-4 rounded transition-colors">
              Volver a categorías
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalleCategoria;
