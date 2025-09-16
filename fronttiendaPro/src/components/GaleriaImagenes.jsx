import { useEffect, useState } from 'react';
import imagenesService from '../services/imagenesService';

function GaleriaImagenes({ idProducto, imagenFallback }) {
  const [imagenes, setImagenes] = useState([]);
  const [imagenPrincipal, setImagenPrincipal] = useState(null);
  const [nuevaUrl, setNuevaUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarImagenes = async () => {
      try {
        const data = await imagenesService.obtenerImagenesPorProducto(idProducto);
        setImagenes(data);

        if (data.length > 0) {
          setImagenPrincipal(data[0].urlImagen); //Toma la primera imagen del array como imagen principal 
        } else if (imagenFallback) {
          setImagenPrincipal(imagenFallback); // si no hay otras, uso imagenUrl del producto
        }
      } catch (error) {
        console.error('Error al cargar imágenes del producto', error);
      }
    };

    cargarImagenes();
  }, [idProducto, imagenFallback]);

  const handleAgregarImagen = async (e) => {
    e.preventDefault();
    if (!nuevaUrl.trim()) return;

    setLoading(true);
    setError('');
    try {
      const imagenAgregada = await imagenesService.agregarImagenPorProducto(idProducto, nuevaUrl);
      setImagenes([...imagenes, imagenAgregada]);
      setNuevaUrl('');
    } catch (err) {
      console.error('Error al agregar imagen', err);
      setError('No se pudo agregar la imagen.');
    } finally {
      setLoading(false);
    }
  };

  if (!imagenPrincipal) return <p className="mb-4">Sin imágenes disponibles.</p>;

  return (
    <div className="mb-6">
      {/* Imagen principal */}
      <div className="mb-4">
        <img
          src={imagenPrincipal}
          alt="Imagen principal"
          className="w-full max-h-96 object-contain border rounded"
        />
      </div>

      {/* Miniaturas */} 
      {imagenes.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {imagenes.map((img) => (
            <img
              key={img.id}
              src={img.urlImagen}
              alt="Miniatura" //Muestra todas las imágenes del array como miniaturas, incluyendo la que se está usando como principal.
              className={`w-20 h-20 object-cover border-2 rounded-lg cursor-pointer ${ //Fuerza el ancho y alto a 80px (20 * 4px). Usa object-cover para que la imagen se recorte si no entra justo en ese cuadrado.
                imagenPrincipal === img.urlImagen ? 'border-pink-500' : 'border-gray-300' //Usa un border bien definido que cambia de color según esté seleccionada o no.
              }`}
              onClick={() => setImagenPrincipal(img.urlImagen)}
            />
          ))}
        </div>
      )}

      {/* Formulario para agregar imagen */}
      <form onSubmit={handleAgregarImagen} className="space-y-2">
        <label className="block text-sm font-medium">Agregar nueva imagen (URL):</label>
        <input
          type="text"
          value={nuevaUrl}
          onChange={(e) => setNuevaUrl(e.target.value)}
          placeholder="https://..."
          className="w-full border border-gray-300 rounded p-2"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 transition"
        >
          {loading ? 'Agregando...' : 'Agregar Imagen'}
        </button>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </form>
    </div>
  );
}

export default GaleriaImagenes;
