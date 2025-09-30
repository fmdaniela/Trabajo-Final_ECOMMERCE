import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import categoriaService from '../services/categoriaService';
import CategoriaCard from '../components/CategoriaCard';

function ListadoCategorias() {
  const [categorias, setCategorias] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        // obtenemos el objeto completo con data + pagination
        const result = await categoriaService.obtenerCategoriasPublic();
        setCategorias(result.data || []); // solo los registros
        setLoading(false);
      } catch (err) {
        setError('Error al cargar las categorías');
        setLoading(false);
        console.error('Error al cargar las categorías:', err);
      }
    };

    fetchCategorias();
  }, []);

  const handleCategoriaClick = (id) => {
    navigate(`/categoria/${id}`);
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
    <div className="mt-10 px-4 sm:px-6">
      <h1 className="text-2xl text-[#E91E63] font-bold mb-6">Listado de Categorías</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categorias.length === 0 ? (
          <p className="text-gray-500">No hay categorías disponibles</p>
        ) : (
          categorias.map((categoria) => (
            <CategoriaCard
              key={categoria.id}
              categoria={categoria}
              onClick={handleCategoriaClick}
            />
          ))
        )}
      </div>
    </div>
    
  );
};

export default ListadoCategorias;
































// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import categoriaService from '../services/categoriaService';
// import CategoriaCard from '../components/CategoriaCard';

// function ListadoCategorias() {
//   const [categorias, setCategorias] = useState([]); //categorias: guarda la lista que viene del backend.
//   const [loading, setLoading] = useState(true); //loading: indica si estamos esperando la respuesta.
//   const [error, setError] = useState(null); //error: guarda si hubo un error durante el fetch.
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchCategorias = async () => {
//       try {
//         const data = await categoriaService.obtenerCategorias();
//         setCategorias(Array.isArray(data) ? data : []);
//         setLoading(false);
//       } catch (err) {
//         setError('Error al cargar las categorías');
//         setLoading(false);
//         console.error('Error al cargar las categorías:', err);
//       }
//     };

//     fetchCategorias();
//   }, []);

//   const handleCategoriaClick = (id) => {
//     navigate(`/categoria/${id}`);
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center p-10">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-600"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return <div className="text-red-500 p-4 text-center">{error}</div>;
//   }

//   return (
//     <div className="mt-10 px-4 sm:px-6">
//       <h1 className="text-2xl text-[#E91E63] font-bold mb-6">Listado de Categorías</h1>
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//         {categorias.length === 0 ? (
//           <p className="text-gray-500">No hay categorías disponibles</p>
//         ) : (
//           categorias.map((categoria) => (
//             <CategoriaCard
//               key={categoria.id}
//               categoria={categoria}
//               onClick={handleCategoriaClick}
//             />
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default ListadoCategorias;
