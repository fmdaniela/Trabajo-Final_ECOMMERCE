import { useEffect, useState } from 'react';
import imagenesService from '../services/imagenesService';

function resolveUrl(url) {
  if (!url) return null;
  return url.startsWith('http') ? url : `http://localhost:3000${url}`;
}

function GaleriaImagenes({ idProducto, imagenFallback = null }) {
  const [imagenes, setImagenes] = useState([]);
  const [imagenPrincipal, setImagenPrincipal] = useState(null);

  useEffect(() => {
    const cargarImagenes = async () => {
      try {
        const data = await imagenesService.obtenerImagenesPorProducto(idProducto);
        const imgs = (data || []).map(img => ({
          id: img.id,
          full: resolveUrl(img.urlImagen),
          thumb: img.thumbnailUrl ? resolveUrl(img.thumbnailUrl) : resolveUrl(img.urlImagen)
        }));

        const fallback = imagenFallback?.full
          ? {
              id: 'fallback',
              full: resolveUrl(imagenFallback.full),
              thumb: imagenFallback.thumb ? resolveUrl(imagenFallback.thumb) : resolveUrl(imagenFallback.full)
            }
          : null;

        const merged = fallback ? [fallback] : [];
        imgs.forEach(i => {
          if (!merged.find(m => m.full === i.full)) merged.push(i);
        });

        setImagenes(merged);
        setImagenPrincipal(fallback?.full || merged[0]?.full || null);
      } catch (err) {
        console.error('Error al cargar imágenes del producto', err);
        setImagenes([]);
        setImagenPrincipal(null);
      }
    };

    cargarImagenes();
  }, [idProducto, imagenFallback]);

  if (!imagenPrincipal)
    return <p className="mb-4 text-gray-500 text-center">Sin imágenes disponibles.</p>;

  return (
    // Contenedor principal: en mobile columna, en desktop fila, con miniaturas a la izquierda
    <div className="flex flex-col md:flex-row-reverse gap-4 items-center">
      
      {/* Imagen principal */}
      <div className="flex justify-center items-center w-full max-w-[500px] group">
        <img
          src={imagenPrincipal}
          alt="Imagen principal del producto"
          className="w-full max-h-[500px] object-contain rounded shadow-md transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Miniaturas: vertical en desktop, horizontal debajo en mobile */}
      <div className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-y-auto">
        {imagenes.map(img => (
          <button
            key={img.id}
            onClick={() => setImagenPrincipal(img.full)}
            className={`rounded-lg p-0 border-2 focus:outline-none ${
              imagenPrincipal === img.full ? 'border-pink-500' : 'border-gray-300'
            }`}
          >
            <img
              src={img.thumb}
              alt="Miniatura"
              className="w-16 h-16 object-cover rounded"
            />
          </button>
        ))}
      </div>

    </div>
  );
}

export default GaleriaImagenes;




