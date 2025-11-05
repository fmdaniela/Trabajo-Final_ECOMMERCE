import { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { ShoppingCart } from "lucide-react";

import productosService from "../services/productoService";
import variantesService from "../services/variantesService";
import resenasService from "../services/resenasService";

import GaleriaImagenes from "../components/GaleriaImagenes";
import ProductCard from "../components/ProductCard";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import ErrorMessage from "../components/ui/ErrorMessage";

import { useCarrito } from "../context/CarritoContext";
import AuthContext from "../context/AuthContext";

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
  const { usuario } = useContext(AuthContext);
  const navigate = useNavigate();

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

        setProducto(dataProducto);
        setVariantes(dataVariantes);

        // Solo productos activos
        const productosRelacionadosActivos = dataRelacionados.filter((p) => p.activo);
        setProductosRelacionados(productosRelacionadosActivos);

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

  // Detectar variante seleccionada
  useEffect(() => {
    if (selectedVariante.talla && selectedVariante.color) {
      const encontrada = variantes.find(
        (v) => v.talla === selectedVariante.talla && v.color === selectedVariante.color
      );
      setVarianteActiva(encontrada || null);
      setCantidad(1);
    }
  }, [selectedVariante, variantes]);

  // Enviar nueva reseña
  const enviarResena = async (e) => {
    e.preventDefault();

    if (!usuario) {
      toast.error("Para continuar debes iniciar sesión");
      navigate("/login");
      return;
    }

    if (!nuevaCalificacion || !nuevoComentario.trim()) return;

    try {
      const resenaCreada = await resenasService.crearResenaPorProducto(id, {
        calificacion: nuevaCalificacion,
        comentario: nuevoComentario,
        idUsuario: usuario.id,
      });

      setResenas([...resenas, resenaCreada]);
      setNuevaCalificacion(0);
      setNuevoComentario("");
      toast.success("Reseña enviada correctamente");
    } catch (err) {
      console.error(err);
      toast.error("Error al enviar la reseña");
    }
  };

  const handleAgregarAlCarrito = () => {
    if (!usuario) {
      toast.error("Para continuar debes iniciar sesión");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
      return;
    }
    agregarProducto(producto.id, cantidad);
    // toast.success("Producto agregado al carrito");
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!producto) return <ErrorMessage message="Producto no encontrado." />;

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      <Toaster position="top-right" />

      {/* === ENCABEZADO: Galería + Info principal === */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Galería */}
        <div>
          <GaleriaImagenes
            idProducto={id}
            imagenFallback={{
              full: producto.imagenUrl || null,
              thumb: producto.thumbnailUrl || null,
            }}
          />
        </div>

        {/* Info principal */}
        <div className="flex flex-col items-start space-y-4">
          <h2 className="text-3xl font-bold">{producto.nombre}</h2>

          <p className="text-xl font-semibold text-green-600">
            ${Number(producto.precio).toLocaleString("es-AR", { minimumFractionDigits: 2 })}
          </p>

          {/* Talle */}
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

          {/* Color */}
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
            <p className="text-sm text-gray-400">
              Seleccioná talle y color para ver stock disponible
            </p>
          )}

          {/* Cantidad y stock */}
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Cantidad</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCantidad((prev) => Math.max(1, prev - 1))}
                disabled={!varianteActiva}
                className="px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                -
              </button>

              <span className="px-4 py-1 border rounded text-center w-12">{cantidad}</span>

              <button
                onClick={() =>
                  setCantidad((prev) => Math.min(varianteActiva?.stock ?? 1, prev + 1))
                }
                disabled={!varianteActiva}
                className="px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                +
              </button>

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

          {/* Botón Agregar al carrito */}
          <div className="mt-4">
            <button
              onClick={handleAgregarAlCarrito}
              disabled={!varianteActiva || varianteActiva.stock === 0}
              className="flex items-center gap-2 bg-pink-600 text-white px-6 py-2 rounded hover:bg-pink-700 w-auto disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <ShoppingCart size={22} />
              <span>Agregar al carrito</span>
            </button>
          </div>
        </div>
      </div>

      {/* === Pestañas === */}
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
            onClick={() => {
              if (!usuario) {
                toast.error("Para continuar debes iniciar sesión");
                setTimeout(() => {
                  navigate("/login");
                }, 2000);
                return;
              }
              setActiveTab("resenas");
            }}
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

        {/* Contenido de pestañas */}
        <div>
          {activeTab === "descripcion" && (
            <div className="space-y-4">
              <p className="font-bold">Descripción del producto</p>
              <p className="text-gray-700">{producto.descripcion}</p>
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
                    {resenas.map((r) => (
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

              {/* Formulario de reseña */}
              <form onSubmit={enviarResena} className="space-y-2 mt-4">
                <label className="block font-semibold">Tu calificación:</label>
                <select
                  className="border rounded px-3 py-2"
                  value={nuevaCalificacion}
                  onChange={(e) => setNuevaCalificacion(Number(e.target.value))}
                  disabled={!usuario}
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
                  disabled={!usuario}
                />
                <button
                  type="submit"
                  className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 disabled:opacity-50"
                  disabled={!usuario}
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
                  {productosRelacionados.map((p) => (
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


