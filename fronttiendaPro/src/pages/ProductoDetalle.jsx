import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import productosService from "../services/productoService";
import variantesService from "../services/variantesService";
import resenasService from "../services/resenasService";
import GaleriaImagenes from "../components/GaleriaImagenes";
import ProductCard from "../components/ProductCard";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import ErrorMessage from "../components/ui/ErrorMessage";
import { useCarrito } from "../context/CarritoContext";

// Componente para características
const Caracteristicas = ({ caracteristicas }) => {
  if (!caracteristicas || caracteristicas.length === 0) return null;
  return (
    <ul className="list-disc list-inside text-gray-700">
      {caracteristicas.map((c, i) => (
        <li key={i}>{c}</li>
      ))}
    </ul>
  );
};

const ProductoDetalle = () => {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [variantes, setVariantes] = useState([]);
  const [selectedVariante, setSelectedVariante] = useState({});
  const [varianteActiva, setVarianteActiva] = useState(null);
  const [productosRelacionados, setProductosRelacionados] = useState([]);
  const [resenas, setResenas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [nuevaCalificacion, setNuevaCalificacion] = useState(0);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [activeTab, setActiveTab] = useState("descripcion");

  const { agregarProducto } = useCarrito();

  // Traer datos al montar
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [dataProducto, dataVariantes, dataRelacionados, dataResenas] =
          await Promise.all([
            productosService.obtenerProductoPorId(id),
            variantesService.getVariantesPorProducto(id),
            productosService.obtenerProductosRelacionados(id),
            resenasService.obtenerResenasPorProducto(id),
          ]);

        setProducto(dataProducto.data);
        setVariantes(dataVariantes);
        setProductosRelacionados(dataRelacionados);
        setResenas(dataResenas);
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar el producto.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // 🔹 Detectar variante seleccionada (talle + color)
  useEffect(() => {
    if (selectedVariante.talla && selectedVariante.color) {
      const encontrada = variantes.find(
        (v) => v.talla === selectedVariante.talla && v.color === selectedVariante.color
      );
      setVarianteActiva(encontrada || null);
      setCantidad(1); // reiniciar cantidad al cambiar variante
    }
  }, [selectedVariante, variantes]);

  // Enviar nueva reseña
  const enviarResena = async (e) => {
    e.preventDefault();
    if (!nuevaCalificacion || !nuevoComentario.trim()) return;
    try {
      const resenaCreada = await resenasService.crearResenaPorProducto(id, {
        calificacion: nuevaCalificacion,
        comentario: nuevoComentario,
        idUsuario: 1, // simulado
      });
      setResenas([...resenas, resenaCreada]);
      setNuevaCalificacion(0);
      setNuevoComentario("");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!producto) return <ErrorMessage message="Producto no encontrado." />;

  return (
    
    <div className="container mx-auto px-4 py-8 space-y-12">
      
      {/* === ENCABEZADO: Galería + Info principal === */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Columna izquierda: Galería */}
        <div>
          <GaleriaImagenes idProducto={id} />
        </div>

        {/* Columna derecha: Información principal */}
        <div className="flex flex-col items-start space-y-4">
          {/* Nombre del producto */}
          <h2 className="text-3xl font-bold">{producto.nombre}</h2>

          {/* Precio */}
          <p className="text-xl font-semibold text-green-600">
            ${Number(producto.precio).toLocaleString("es-AR", { minimumFractionDigits: 2 })}
          </p>

          {/* Variantes: Talles */}
          <div className="mb-2">
            <h3 className="font-semibold mb-2">Talle</h3>
            <div className="flex flex-wrap gap-2">
              {variantes
                .filter((v) => v.talla)
                .map((v) => (
                  <button
                    key={`talle-${v.id}`}
                    onClick={() => setSelectedVariante((prev) => ({ ...prev, talla: v.talla }))}
                    className={`px-3 py-1 border rounded ${
                      selectedVariante?.talla === v.talla
                        ? "bg-pink-600 text-white border-pink-600"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {v.talla}
                  </button>
                ))}
            </div>
          </div>
              
          {/* Variantes: Colores */}
          <div className="mb-2">
            <h3 className="font-semibold mb-2">Color</h3>
            <div className="flex flex-wrap gap-2">
              {variantes
                .filter((v) => v.color)
                .map((v) => (
                  <button
                    key={`color-${v.id}`}
                    onClick={() => setSelectedVariante((prev) => ({ ...prev, color: v.color }))}
                    className={`px-3 py-1 border rounded ${
                      selectedVariante?.color === v.color
                        ? "bg-pink-600 text-white border-pink-600"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {v.color}
                  </button>
                ))}
            </div>
          </div>
              
          {/* Variante seleccionada */}
          {selectedVariante.talla || selectedVariante.color ? (
            <p className="text-sm text-gray-600">
              Variante seleccionada:
              {selectedVariante.talla ? ` Talle ${selectedVariante.talla}` : ""}
              {selectedVariante.color ? ` Color ${selectedVariante.color}` : ""}
            </p>
          ) : (
            <p className="text-sm text-gray-400">Seleccioná talle y color para ver stock disponible</p>
          )}

          {/* Cantidad */}
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Cantidad</h3>
            <div className="flex items-center gap-2">
              {/* Botón menos */}
              <button
                onClick={() => setCantidad(prev => Math.max(1, prev - 1))}
                disabled={!varianteActiva}
                className="px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                -
              </button>
                  
              {/* Número seleccionado */}
              <span className="px-4 py-1 border rounded text-center w-12">{cantidad}</span>
                  
              {/* Botón más */}
              <button
                onClick={() =>
                  setCantidad(prev =>
                    Math.min(varianteActiva?.stock ?? 1, prev + 1)
                  )
                }
                disabled={!varianteActiva}
                className="px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                +
              </button>
              
              {/* Disponibilidad + Estado */}
              {varianteActiva && (
                <span className="text-gray-500 ml-2 flex items-center gap-2">
                  {varianteActiva.stock} disponibles
                  {varianteActiva.stock > 0 ? (
                    <span className="text-green-600 font-semibold">✅ En stock</span>
                  ) : (
                    <span className="text-red-600 font-semibold">❌ Sin stock</span>
                  )}
                </span>
              )}
            </div>
          </div>
            
          {/* Botón agregar al carrito */}
          <button
            disabled={!varianteActiva || varianteActiva.stock === 0}
            onClick={() => agregarProducto(producto.id, cantidad)}
            className="bg-pink-600 text-white px-6 py-2 rounded hover:bg-pink-700 w-auto disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Agregar al carrito
          </button>


          </div>
        </div>

      {/* Pestañas */}
      <div className="mt-8">
        <div className="flex border-b border-gray-300 mb-4">
          <button
            className={`px-4 py-2 font-semibold ${
              activeTab === "descripcion" ? "border-b-2 border-pink-600 text-pink-600" : "text-gray-600"
            }`}
            onClick={() => setActiveTab("descripcion")}
          >
            Descripción
          </button>
          <button
            className={`px-4 py-2 font-semibold ${
              activeTab === "resenas" ? "border-b-2 border-pink-600 text-pink-600" : "text-gray-600"
            }`}
            onClick={() => setActiveTab("resenas")}
          >
            Reseñas
          </button>
          <button
            className={`px-4 py-2 font-semibold ${
              activeTab === "relacionados" ? "border-b-2 border-pink-600 text-pink-600" : "text-gray-600"
            }`}
            onClick={() => setActiveTab("relacionados")}
          >
            Productos Relacionados
          </button>
        </div>

        {/* Contenido de las pestañas */}
        <div>
          {activeTab === "descripcion" && (
            <div className="space-y-4">
              <p className="font-bold">Descripción del producto</p>
              <p className="text-gray-700">{producto.descripcion}</p>
              {producto.caracteristicas && producto.caracteristicas.length > 0 && (
                <>
                  <p className="font-semibold mt-2">Características</p>
                  <Caracteristicas caracteristicas={producto.caracteristicas} />
                </>
              )}
            </div>
          )}

          {activeTab === "resenas" && (
            <div className="space-y-4">
              {resenas.length === 0 ? (
                <p className="text-gray-500">Todavía no hay reseñas para este producto.</p>
              ) : (
                <>
                  <p className="text-2xl text-yellow-500 font-bold">
                    Promedio: {(resenas.reduce((sum, r) => sum + r.calificacion, 0) / resenas.length).toFixed(1)} ⭐
                  </p>
                  <ul className="space-y-3">
                    {resenas.map(r => (
                      <li key={r.id} className="border p-3 rounded shadow-sm">
                        <p className="text-yellow-600 font-medium">Calificación: {r.calificacion} ⭐</p>
                        <p className="italic text-gray-600">"{r.comentario}"</p>
                        <p className="text-xs text-gray-500">
                          Fecha: {new Date(r.fechaResena).toLocaleDateString()}
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
                  onChange={e => setNuevoComentario(e.target.value)}
                />

                <button
                  type="submit"
                  className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 transition"
                >
                  Enviar reseña
                </button>
              </form>
            </div>
          )}

          {activeTab === "relacionados" && (
            <div>
              {productosRelacionados.length === 0 ? (
                <p className="text-gray-500">No hay productos relacionados.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {productosRelacionados.map(p => (
                    <ProductCard key={p.id} producto={p} />
                  ))}
                </div>
              )}
            </div>
          )}
          
        </div>
        
      </div>
      <div className="mt-6">
        
      <Link
        to="/productos"
        className="inline-block bg-pink-600 hover:bg-pink-700 text-white font-medium py-2 px-4 rounded transition-colors"
      >
        ← Volver al listado de productos
      </Link>
    </div>
    </div>
    
  );
};

export default ProductoDetalle;








{/* <div className="mt-6">
      <Link
        to="/productos"
        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
      >
        ← Volver al listado de productos
      </Link>
    </div> */}




















// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import productosService from "../services/productoService";
// import variantesService from "../services/variantesService";
// import GaleriaImagenes from "../components/GaleriaImagenes";
// import ErrorMessage from "../components/ui/ErrorMessage";
// import LoadingSpinner from "../components/ui/LoadingSpinner";

// const ProductoDetalle = () => {
//   const { id } = useParams();
//   const [producto, setProducto] = useState(null);
//   const [variantes, setVariantes] = useState([]);
//   const [selectedVariante, setSelectedVariante] = useState(null);
//   const [productosRelacionados, setProductosRelacionados] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         // 1️⃣ Traer producto
//         const dataProducto = await productosService.obtenerProductoPorId(id);
//         setProducto(dataProducto);

//         // 2️⃣ Traer variantes
//         const dataVariantes = await variantesService.getVariantesPorProducto(id);
//         setVariantes(dataVariantes);

//         // 3️⃣ Traer productos relacionados
//         const dataRelacionados = await productosService.obtenerProductosRelacionados(id);
//         setProductosRelacionados(dataRelacionados);
//       } catch (err) {
//         console.error("Error al cargar producto:", err);
//         setError("No se pudo cargar el producto.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [id]);

//   if (loading) return <LoadingSpinner />;
//   if (error) return <ErrorMessage message={error} />;
//   if (!producto) return <ErrorMessage message="Producto no encontrado." />;

//   return (
//     <div className="container mx-auto px-4 py-8">
//       {/* Encabezado */}
//       <h1 className="text-3xl font-bold mb-4">{producto.nombre}</h1>
//       <p className="text-gray-600 mb-2">
//         Categoría: {producto.categoria?.nombre || "Sin categoría"}
//       </p>
//       <p className="text-lg mb-4">{producto.descripcion}</p>
//       <p className="text-xl font-semibold text-green-600 mb-4">${producto.precio}</p>
//       <p className="text-gray-700 mb-4">Stock disponible: {producto.stock}</p>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         {/* Galería */}
//         <div>
//           <GaleriaImagenes idProducto={id} />
//         </div>

//         {/* Información y variantes */}
//         <div>
//           {variantes.length > 0 && (
//             <div className="mb-4">
//               <h3 className="font-semibold mb-2">Seleccionar variante</h3>
//               <select
//                 value={selectedVariante?.id || ""}
//                 onChange={(e) => {
//                   const variante = variantes.find(v => v.id === parseInt(e.target.value));
//                   setSelectedVariante(variante);
//                 }}
//                 className="border p-2 rounded w-full"
//               >
//                 <option value="">-- Elegir --</option>
//                 {variantes.map((v) => (
//                   <option key={v.id} value={v.id}>
//                     {v.talle ? `Talle ${v.talle}` : ""}
//                     {v.color ? ` Color ${v.color}` : ""}
//                   </option>
//                 ))}
//               </select>
//               {selectedVariante && (
//                 <p className="mt-2 text-sm text-gray-600">
//                   Variante seleccionada: 
//                   {selectedVariante.talle ? ` Talle ${selectedVariante.talle}` : ""}
//                   {selectedVariante.color ? ` Color ${selectedVariante.color}` : ""}
//                 </p>
//               )}
//             </div>
//           )}

//           <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
//             Agregar al carrito
//           </button>
//         </div>
//       </div>

//       {/* Sección Reseñas */}
//       <div className="mt-12">
//         <h2 className="text-2xl font-bold mb-4">Reseñas</h2>
//         {producto.resenas && producto.resenas.length > 0 ? (
//           <ul className="space-y-2">
//             {producto.resenas.map((r) => (
//               <li key={r.id} className="border p-2 rounded">
//                 <p className="font-semibold">
//                   {r.usuario?.nombre || "Usuario"} ⭐ {r.calificacion}
//                 </p>
//                 <p className="text-gray-700">{r.comentario}</p>
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p className="text-gray-600">Este producto no tiene reseñas aún.</p>
//         )}
//       </div>

//       {/* Sección Productos Relacionados */}
//       <div className="mt-12">
//         <h2 className="text-2xl font-bold mb-4">También te podría interesar</h2>
//         {productosRelacionados.length > 0 ? (
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//             {productosRelacionados.map((p) => (
//               <div key={p.id} className="border rounded p-4">
//                 <h3 className="font-semibold">{p.nombre}</h3>
//                 <p className="text-green-600 font-bold">${p.precio}</p>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p className="text-gray-600">No hay productos relacionados.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ProductoDetalle;


















// import { useEffect, useState } from 'react';
// import { Link, useParams } from 'react-router-dom';
// import productoService from '../services/productoService';
// import mensajesService from '../services/mensajesService';
// import variantesService from '../services/variantesService';
// import resenasService from '../services/resenasService';
// import etiquetasService from '../services/etiquetasService';
// import GaleriaImagenes from '../components/GaleriaImagenes';
// import ProductCard from '../components/ProductCard';



// // Obtener datos del producto y mensajes al montar
// function ProductoDetalle() {
//   const { id } = useParams();
//   const [producto, setProducto] = useState(null);
//   const [mensajes, setMensajes] = useState([]);
//   const [nuevoMensaje, setNuevoMensaje] = useState('');
//   const [variantes, setVariantes] = useState([]);
//   const [relacionados, setRelacionados] = useState([]);
//   const [resenas, setResenas] = useState([]);
//   const [loadingResenas, setLoadingResenas] = useState(true);
//   const [nuevaCalificacion, setNuevaCalificacion] = useState(0);
//   const [nuevoComentario, setNuevoComentario] = useState('');
//   const [etiquetas, setEtiquetas] = useState([]);
//   const [nuevaEtiqueta, setNuevaEtiqueta] = useState('');
  

//   useEffect(() => {
//     const traerProducto = async () => {
//       try {
//         const dataProducto = await productoService.obtenerProductoPorId(id);
//         setProducto(dataProducto);
//       } catch (error) {
//         console.error('Error al cargar producto', error);
//       }
//     };

//     const traerMensajes = async () => {
//       try {
//         const dataMensajes = await mensajesService.obtenerMensajesPorProducto(id);
//         setMensajes(dataMensajes);
//       } catch (error) {
//         console.error('Error al cargar mensajes', error);
//       }
//     };

//     const traerVariantes = async () => {
//       try {
//         const dataVariantes = await variantesService.getVariantesPorProducto(id);
//         setVariantes(dataVariantes);
//       } catch (error) {
//         console.error('Error al cargar variantes', error);
//       }
//     };

//     const traerRelacionados = async () => {
//       try {
//         const productosRelacionados = await productoService.obtenerProductosRelacionados(id);
//         setRelacionados(productosRelacionados);
//       } catch (error) {
//         console.error('Error al cargar productos relacionados', error);
//       }
//     };

//     const traerResenas = async () => {
//       try {
//         const dataResenas = await resenasService.obtenerResenasPorProducto(id);
//         setResenas(dataResenas);
//       } catch (error) {
//         console.error('Error al cargar reseñas', error);
//       } finally {
//         setLoadingResenas(false);
//       }
//     };

//     const traerEtiquetas = async () => {
//   try {
//     const dataEtiquetas = await etiquetasService.obtenerEtiquetasPorProducto(id);
//     setEtiquetas(dataEtiquetas);
//   } catch (error) {
//     console.error('Error al cargar etiquetas', error);
//   }
// };


//     traerProducto();
//     traerMensajes();
//     traerVariantes();
//     traerRelacionados();
//     traerResenas();
//     traerEtiquetas();
//   }, [id]);

//   const enviarMensaje = async (e) => { //La funcion podria llamarse tambien handleSubmit en vez de enviarMansaje
//     e.preventDefault();
//     if (!nuevoMensaje.trim()) return;

//     try {
//       const mensajeCreado  = await mensajesService.crearMensajePorProducto(id, nuevoMensaje);
//       setMensajes([...mensajes, mensajeCreado]);
//       setNuevoMensaje('');
//     } catch (error) {
//       console.error('Error al enviar mensaje', error);
//     }
//   };

//   if (!producto) return <p className="p-4">Cargando producto...</p>;

//   const enviarResena = async (e) => {
//     e.preventDefault();
//     if (!nuevaCalificacion || !nuevoComentario.trim()) return;

//     try {
//       const resenaCreada = await resenasService.crearResenaPorProducto(id, {
//         calificacion: nuevaCalificacion,
//         comentario: nuevoComentario,
//         idUsuario: 1, // ⚠️ por ahora simulado con cliente fijo
//       });

//       setResenas([...resenas, resenaCreada]);
//       setNuevaCalificacion(0);
//       setNuevoComentario('');
//     } catch (error) {
//       console.error('Error al enviar reseña', error);
//     }
//   };

//   const enviarEtiqueta = async (e) => {
//     e.preventDefault();
//     if (!nuevaEtiqueta.trim()) return;
    
//     try {
//       const etiquetaCreada = await etiquetasService.crearEtiquetaPorProducto(id, nuevaEtiqueta);
//       setEtiquetas([...etiquetas, etiquetaCreada]);
//       setNuevaEtiqueta('');
//     } catch (error) {
//       console.error('Error al agregar etiqueta', error);
//     }
//   };
  
//   return (
//     <div className="max-w-3xl mx-auto p-4">
//       <Link
//         to="/productos"
//         className="inline-block mb-4 text-sm text-blue-600 hover:underline"
//       >
//         ← Volver a Productos
//     </Link>
//       <h1 className="text-3xl font-bold mb-4 text-center">Detalle del producto</h1>
//       <h2 className="text-2xl font-bold mb-2">{producto.nombre}</h2>
      
//       {/* etiquetas destacadas para clientes: Mostramos solo las primeras 3 etiquetas */}
//       {etiquetas.length > 0 && (
//         <div className="flex flex-wrap gap-1 mb-2">
//           {etiquetas.slice(0, 3).map((etiqueta) => (
//             <span
//               key={etiqueta.id}
//               className="bg-pink-100 text-pink-600 text-xs font-medium px-2 py-1 rounded-full"
//             >
//               {etiqueta.texto}
//             </span>
//           ))}
//         </div>
//       )}

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
//       <hr className="my-4" />
//       <h3 className="text-xl font-semibold mb-2">Galería de Imágenes del Producto</h3>
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
//           className="bg-[#E91E63] text-white px-4 py-2 rounded hover:bg-pink-700 transition cursor-pointer"
//         >
//           Enviar Mensaje
//         </button>
//       </form>

//       {/* Productos relacionados */}
//       <hr className="my-6" />
//       <h3 className="text-xl font-semibold mb-2">También te podría interesar</h3>

//       {relacionados.length > 0 ? (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//           {relacionados.map((prod) => (
//             <ProductCard key={prod.id} producto={prod} />
//           ))}
//         </div>
//       ) : (
//         <p className="text-gray-500 mb-4">No hay productos relacionados.</p>
//       )}

//       {/* Resenas */}  
//       <hr className="my-6" />
//       <h3 className="text-xl font-semibold mb-2">Reseñas de clientes</h3>

//       {loadingResenas ? (
//         <p>Cargando reseñas...</p>
//       ) : resenas.length === 0 ? (
//         <p className="text-gray-500 mb-4">Todavía no hay reseñas para este producto.</p>
//       ) : (
//         <>
//           <p className="text-yellow-500 font-bold text-lg mb-2">
//             Promedio: {(
//               resenas.reduce((sum, r) => sum + r.calificacion, 0) / resenas.length
//             ).toFixed(1)} ⭐
//           </p>
//           <ul className="space-y-3">
//             {resenas.map((resena) => (
//               <li key={resena.id} className="border p-3 rounded shadow-sm">
//                 <p className="text-yellow-600 font-medium">Calificación: {resena.calificacion} ⭐</p>
//                 <p className="italic text-gray-700">"{resena.comentario}"</p>
//                 <p className="text-xs text-gray-500">
//                   Fecha: {new Date(resena.fechaResena).toLocaleDateString()}
//                 </p>
//               </li>
//             ))}
//           </ul>
//         </>
//       )}

//       {/* Formulario para enviar nueva reseña */}
//       <form onSubmit={enviarResena} className="space-y-2 mt-4">
//         <label className="block font-semibold">Tu calificación:</label>
//         <select
//           className="border rounded px-3 py-2"
//           value={nuevaCalificacion}
//           onChange={(e) => setNuevaCalificacion(Number(e.target.value))}
//         >
//           <option value={0}>Seleccioná una calificación</option>
//           <option value={1}>1 ⭐</option>
//           <option value={2}>2 ⭐⭐</option>
//           <option value={3}>3 ⭐⭐⭐</option>
//           <option value={4}>4 ⭐⭐⭐⭐</option>
//           <option value={5}>5 ⭐⭐⭐⭐⭐</option>
//         </select>

//         <textarea
//           className="w-full border border-gray-300 rounded p-2"
//           rows="3"
//           placeholder="Escribí tu comentario..."
//           value={nuevoComentario}
//           onChange={(e) => setNuevoComentario(e.target.value)}
//         />

//         <button
//           type="submit"
//           className="bg-[#E91E63] text-white px-4 py-2 rounded hover:bg-pink-700 transition cursor-pointer"
//         >
//           Enviar reseña
//         </button>
//       </form>

//       {/* Etiquetas simulando admin: mostramos todas */}
//       <hr className="my-4" />
//       <h3 className="text-xl font-semibold mb-2">Etiquetas del producto</h3>

//       <p className="text-sm text-gray-500 italic mb-2">
//         *Sección exclusiva para administración del producto
//       </p>

//       {etiquetas.length > 0 ? (
//         <ul className="flex flex-wrap gap-2 mb-4">
//           {etiquetas.map((etiqueta) => (
//             <li key={etiqueta.id} className="bg-pink-200 text-pink-800 px-3 py-1 rounded-full text-sm">
//               #{etiqueta.texto}
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p className="text-gray-500 mb-4">Este producto aún no tiene etiquetas.</p>
//       )}

//       <form onSubmit={enviarEtiqueta} className="flex gap-2 items-center">
//         <input
//           type="text"
//           placeholder="Agregar etiqueta (solo texto)"
//           className="border rounded px-3 py-1"
//           value={nuevaEtiqueta}
//           onChange={(e) => setNuevaEtiqueta(e.target.value)}
//         />
//         <button
//           type="submit"
//           className="bg-pink-600 text-white px-3 py-1 rounded hover:bg-pink-700 transition"
//         >
//           Agregar
//         </button>
//       </form>  

//     </div>
//   );
// }

// export default ProductoDetalle;


