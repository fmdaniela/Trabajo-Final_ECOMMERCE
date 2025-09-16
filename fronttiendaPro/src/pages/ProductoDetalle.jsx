import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import productoService from '../services/productoService';
import mensajesService from '../services/mensajesService';
import variantesService from '../services/variantesService';
import resenasService from '../services/resenasService';
import etiquetasService from '../services/etiquetasService';
import GaleriaImagenes from '../components/GaleriaImagenes';
import ProductCard from '../components/ProductCard';



// Obtener datos del producto y mensajes al montar
function ProductoDetalle() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [variantes, setVariantes] = useState([]);
  const [relacionados, setRelacionados] = useState([]);
  const [resenas, setResenas] = useState([]);
  const [loadingResenas, setLoadingResenas] = useState(true);
  const [nuevaCalificacion, setNuevaCalificacion] = useState(0);
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [etiquetas, setEtiquetas] = useState([]);
  const [nuevaEtiqueta, setNuevaEtiqueta] = useState('');
  

  useEffect(() => {
    const traerProducto = async () => {
      try {
        const dataProducto = await productoService.obtenerProductoPorId(id);
        setProducto(dataProducto);
      } catch (error) {
        console.error('Error al cargar producto', error);
      }
    };

    const traerMensajes = async () => {
      try {
        const dataMensajes = await mensajesService.obtenerMensajesPorProducto(id);
        setMensajes(dataMensajes);
      } catch (error) {
        console.error('Error al cargar mensajes', error);
      }
    };

    const traerVariantes = async () => {
      try {
        const dataVariantes = await variantesService.getVariantesPorProducto(id);
        setVariantes(dataVariantes);
      } catch (error) {
        console.error('Error al cargar variantes', error);
      }
    };

    const traerRelacionados = async () => {
      try {
        const productosRelacionados = await productoService.obtenerProductosRelacionados(id);
        setRelacionados(productosRelacionados);
      } catch (error) {
        console.error('Error al cargar productos relacionados', error);
      }
    };

    const traerResenas = async () => {
      try {
        const dataResenas = await resenasService.obtenerResenasPorProducto(id);
        setResenas(dataResenas);
      } catch (error) {
        console.error('Error al cargar reseñas', error);
      } finally {
        setLoadingResenas(false);
      }
    };

    const traerEtiquetas = async () => {
  try {
    const dataEtiquetas = await etiquetasService.obtenerEtiquetasPorProducto(id);
    setEtiquetas(dataEtiquetas);
  } catch (error) {
    console.error('Error al cargar etiquetas', error);
  }
};


    traerProducto();
    traerMensajes();
    traerVariantes();
    traerRelacionados();
    traerResenas();
    traerEtiquetas();
  }, [id]);

  const enviarMensaje = async (e) => { //La funcion podria llamarse tambien handleSubmit en vez de enviarMansaje
    e.preventDefault();
    if (!nuevoMensaje.trim()) return;

    try {
      const mensajeCreado  = await mensajesService.crearMensajePorProducto(id, nuevoMensaje);
      setMensajes([...mensajes, mensajeCreado]);
      setNuevoMensaje('');
    } catch (error) {
      console.error('Error al enviar mensaje', error);
    }
  };

  if (!producto) return <p className="p-4">Cargando producto...</p>;

  const enviarResena = async (e) => {
    e.preventDefault();
    if (!nuevaCalificacion || !nuevoComentario.trim()) return;

    try {
      const resenaCreada = await resenasService.crearResenaPorProducto(id, {
        calificacion: nuevaCalificacion,
        comentario: nuevoComentario,
        idUsuario: 1, // ⚠️ por ahora simulado con cliente fijo
      });

      setResenas([...resenas, resenaCreada]);
      setNuevaCalificacion(0);
      setNuevoComentario('');
    } catch (error) {
      console.error('Error al enviar reseña', error);
    }
  };

  const enviarEtiqueta = async (e) => {
    e.preventDefault();
    if (!nuevaEtiqueta.trim()) return;
    
    try {
      const etiquetaCreada = await etiquetasService.crearEtiquetaPorProducto(id, nuevaEtiqueta);
      setEtiquetas([...etiquetas, etiquetaCreada]);
      setNuevaEtiqueta('');
    } catch (error) {
      console.error('Error al agregar etiqueta', error);
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto p-4">
      <Link
        to="/productos"
        className="inline-block mb-4 text-sm text-blue-600 hover:underline"
      >
        ← Volver a Productos
    </Link>
      <h1 className="text-3xl font-bold mb-4 text-center">Detalle del producto</h1>
      <h2 className="text-2xl font-bold mb-2">{producto.nombre}</h2>
      
      {/* etiquetas destacadas para clientes: Mostramos solo las primeras 3 etiquetas */}
      {etiquetas.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {etiquetas.slice(0, 3).map((etiqueta) => (
            <span
              key={etiqueta.id}
              className="bg-pink-100 text-pink-600 text-xs font-medium px-2 py-1 rounded-full"
            >
              {etiqueta.texto}
            </span>
          ))}
        </div>
      )}

      <p className="text-lg text-gray-700 mb-4">${producto.precio}</p>

      {/* Variantes */}
      <hr className="my-4" />
      <h3 className="text-xl font-semibold mb-2">Variantes disponibles</h3>
      {variantes.length > 0 ? (
        <ul className="space-y-2">
          {variantes.map((variante) => (
            <li
              key={variante.id}
              className={`p-2 rounded ${variante.stock === 0 ? 'text-red-600' : 'text-gray-800'}`}
            >
              {variante.talla} - {variante.color} | Precio: ${variante.precio} | Stock: {variante.stock}{' '}
              {variante.stock === 0 && '(No disponible)'}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 mb-4">Este producto no tiene variantes.</p>
      )}

      {/* Galería de Imágenes */}
      <hr className="my-4" />
      <h3 className="text-xl font-semibold mb-2">Galería de Imágenes del Producto</h3>
      <GaleriaImagenes
        idProducto={id}
        imagenFallback={producto.imagenUrl}
      />

      {/* Mensajes */}
      <hr className="my-4" />
      <h3 className="text-xl font-semibold mb-2">Mensajes</h3>
      {mensajes.length > 0 ? (
        <ul className="mb-4 space-y-2">
          {mensajes.map((mensaje) => (
            <li key={mensaje.id} className="bg-gray-100 p-2 rounded">
              {mensaje.texto}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 mb-4">No hay mensajes aún.</p>
      )}

      <form onSubmit={enviarMensaje} className="space-y-2">
        <textarea
          className="w-full border border-gray-300 rounded p-2"
          rows="3"
          placeholder="Escribí tu mensaje..."
          value={nuevoMensaje}
          onChange={(e) => setNuevoMensaje(e.target.value)}
        />
        <button
          type="submit"
          className="bg-[#E91E63] text-white px-4 py-2 rounded hover:bg-pink-700 transition cursor-pointer"
        >
          Enviar Mensaje
        </button>
      </form>

      {/* Productos relacionados */}
      <hr className="my-6" />
      <h3 className="text-xl font-semibold mb-2">También te podría interesar</h3>

      {relacionados.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {relacionados.map((prod) => (
            <ProductCard key={prod.id} producto={prod} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 mb-4">No hay productos relacionados.</p>
      )}

      {/* Resenas */}  
      <hr className="my-6" />
      <h3 className="text-xl font-semibold mb-2">Reseñas de clientes</h3>

      {loadingResenas ? (
        <p>Cargando reseñas...</p>
      ) : resenas.length === 0 ? (
        <p className="text-gray-500 mb-4">Todavía no hay reseñas para este producto.</p>
      ) : (
        <>
          <p className="text-yellow-500 font-bold text-lg mb-2">
            Promedio: {(
              resenas.reduce((sum, r) => sum + r.calificacion, 0) / resenas.length
            ).toFixed(1)} ⭐
          </p>
          <ul className="space-y-3">
            {resenas.map((resena) => (
              <li key={resena.id} className="border p-3 rounded shadow-sm">
                <p className="text-yellow-600 font-medium">Calificación: {resena.calificacion} ⭐</p>
                <p className="italic text-gray-700">"{resena.comentario}"</p>
                <p className="text-xs text-gray-500">
                  Fecha: {new Date(resena.fechaResena).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Formulario para enviar nueva reseña */}
      <form onSubmit={enviarResena} className="space-y-2 mt-4">
        <label className="block font-semibold">Tu calificación:</label>
        <select
          className="border rounded px-3 py-2"
          value={nuevaCalificacion}
          onChange={(e) => setNuevaCalificacion(Number(e.target.value))}
        >
          <option value={0}>Seleccioná una calificación</option>
          <option value={1}>1 ⭐</option>
          <option value={2}>2 ⭐⭐</option>
          <option value={3}>3 ⭐⭐⭐</option>
          <option value={4}>4 ⭐⭐⭐⭐</option>
          <option value={5}>5 ⭐⭐⭐⭐⭐</option>
        </select>

        <textarea
          className="w-full border border-gray-300 rounded p-2"
          rows="3"
          placeholder="Escribí tu comentario..."
          value={nuevoComentario}
          onChange={(e) => setNuevoComentario(e.target.value)}
        />

        <button
          type="submit"
          className="bg-[#E91E63] text-white px-4 py-2 rounded hover:bg-pink-700 transition cursor-pointer"
        >
          Enviar reseña
        </button>
      </form>

      {/* Etiquetas simulando admin: mostramos todas */}
      <hr className="my-4" />
      <h3 className="text-xl font-semibold mb-2">Etiquetas del producto</h3>

      <p className="text-sm text-gray-500 italic mb-2">
        *Sección exclusiva para administración del producto
      </p>

      {etiquetas.length > 0 ? (
        <ul className="flex flex-wrap gap-2 mb-4">
          {etiquetas.map((etiqueta) => (
            <li key={etiqueta.id} className="bg-pink-200 text-pink-800 px-3 py-1 rounded-full text-sm">
              #{etiqueta.texto}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 mb-4">Este producto aún no tiene etiquetas.</p>
      )}

      <form onSubmit={enviarEtiqueta} className="flex gap-2 items-center">
        <input
          type="text"
          placeholder="Agregar etiqueta (solo texto)"
          className="border rounded px-3 py-1"
          value={nuevaEtiqueta}
          onChange={(e) => setNuevaEtiqueta(e.target.value)}
        />
        <button
          type="submit"
          className="bg-pink-600 text-white px-3 py-1 rounded hover:bg-pink-700 transition"
        >
          Agregar
        </button>
      </form>  

    </div>
  );
}

export default ProductoDetalle;


//USANDO LOS COMPONENTES REUTILIZABLES: LoadingSpinner y ErrorMessage

// import { useEffect, useState } from 'react';
// import { Link, useParams } from 'react-router-dom';
// import productoService from '../services/productoService';
// import mensajesService from '../services/mensajesService';
// import variantesService from '../services/variantesService';
// import GaleriaImagenes from '../components/GaleriaImagenes';
// import LoadingSpinner from '../components/ui/LoadingSpinner';
// import ErrorMessage from '../components/ui/ErrorMessage';

// function ProductoDetalle() {
//   const { id } = useParams();
//   const [producto, setProducto] = useState(null);
//   const [mensajes, setMensajes] = useState([]);
//   const [nuevoMensaje, setNuevoMensaje] = useState('');
//   const [variantes, setVariantes] = useState([]);

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const traerTodo = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         const [dataProducto, dataMensajes, dataVariantes] = await Promise.all([
//           productoService.obtenerProductoPorId(id),
//           mensajesService.obtenerMensajesPorProducto(id),
//           variantesService.getVariantesPorProducto(id),
//         ]);

//         setProducto(dataProducto);
//         setMensajes(dataMensajes);
//         setVariantes(dataVariantes);
//       } catch (err) {
//         console.error('Error al cargar datos del producto:', err);
//         setError('Error al cargar los datos del producto.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     traerTodo();
//   }, [id]);

//   const enviarMensaje = async (e) => {
//     e.preventDefault();
//     if (!nuevoMensaje.trim()) return;

//     try {
//       const mensajeCreado = await mensajesService.crearMensaje(id, nuevoMensaje);
//       setMensajes([...mensajes, mensajeCreado]);
//       setNuevoMensaje('');
//     } catch (error) {
//       console.error('Error al enviar mensaje', error);
//     }
//   };

//   if (loading) return <LoadingSpinner />;
//   if (error) return <ErrorMessage message={error} />;
//   if (!producto) return <ErrorMessage message="No se encontró el producto." />;

//   return (
//     <div className="max-w-3xl mx-auto p-4">
//       <Link
//         to="/productos"
//         className="inline-block mb-4 text-sm text-blue-600 hover:underline"
//       >
//         ← Volver a Productos
//       </Link>

//       <h1 className="text-3xl font-bold mb-4 text-center">Detalle del producto</h1>
//       <h2 className="text-2xl font-bold mb-2">{producto.nombre}</h2>
//       <p className="text-lg text-gray-700 mb-4">${producto.precio}</p>

//       {/* Variantes */}
//       <hr className="my-4" />
//       <h3 className="text-xl font-semibold mb-2">Variantes disponibles</h3>
//       {variantes.length > 0 ? (
//         <ul className="space-y-2">
//           {variantes.map((variante) => (
//             <li
//               key={variante.id}
//               className={`p-2 rounded ${variante.stock === 0 ? 'text-red-600' : 'text-gray-800'}`}
//             >
//               {variante.talla} - {variante.color} | Precio: ${variante.precio} | Stock: {variante.stock}{' '}
//               {variante.stock === 0 && '(No disponible)'}
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p className="text-gray-500 mb-4">Este producto no tiene variantes.</p>
//       )}

//       {/* Galería de Imágenes */}
//       <GaleriaImagenes
//         idProducto={id}
//         imagenFallback={producto.imagenUrl}
//       />

//       {/* Mensajes */}
//       <hr className="my-4" />
//       <h3 className="text-xl font-semibold mb-2">Mensajes</h3>
//       {mensajes.length > 0 ? (
//         <ul className="mb-4 space-y-2">
//           {mensajes.map((mensaje) => (
//             <li key={mensaje.id} className="bg-gray-100 p-2 rounded">
//               {mensaje.texto}
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p className="text-gray-500 mb-4">No hay mensajes aún.</p>
//       )}

//       <form onSubmit={enviarMensaje} className="space-y-2">
//         <textarea
//           className="w-full border border-gray-300 rounded p-2"
//           rows="3"
//           placeholder="Escribí tu mensaje..."
//           value={nuevoMensaje}
//           onChange={(e) => setNuevoMensaje(e.target.value)}
//         />
//         <button
//           type="submit"
//           className="bg-[#E91E63] text-white px-4 py-2 rounded hover:bg-pink-700 transition"
//         >
//           Enviar Mensaje
//         </button>
//       </form>
//     </div>
//   );
// }

// export default ProductoDetalle;
