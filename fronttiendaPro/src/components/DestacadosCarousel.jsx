import { useEffect, useRef, useState } from "react";
import productosService from "../services/productoService";
import ProductCard from "./ProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import LoadingSpinner from "./ui/LoadingSpinner";
import ErrorMessage from "./ui/ErrorMessage";

function ProductCarousel() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const carouselRef = useRef(null);
  const [cardWidth, setCardWidth] = useState(0);
  const [gap, setGap] = useState(24);
  const [cardsPerView, setCardsPerView] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const data = await productosService.getDestacados();
        setProductos(data);
      } catch (err) {
        console.error("Error al cargar productos destacados:", err);
        setError("No se pudieron cargar los productos destacados");
      } finally {
        setLoading(false);
      }
    };
    cargarProductos();
  }, []);

  // Medir cardWidth, gap y cardsPerView cuando cambian productos o resize
  useEffect(() => {
    const measure = () => {
      const container = carouselRef.current;
      if (!container) return;

      // Encontrar la primera card-wrapper (todos tendrán data-carousel-card)
      const firstCard = container.querySelector("[data-carousel-card]");
      if (!firstCard) return;

      const rect = firstCard.getBoundingClientRect();
      const cw = rect.width;

      // obtener gap (columnGap o gap)
      const style = window.getComputedStyle(container);
      const gapValue =
        parseFloat(style.columnGap || style.gap || "") ||
        parseFloat(style.getPropertyValue("gap")) ||
        24;

      const containerWidth = container.clientWidth || window.innerWidth;
      const visible = Math.floor(containerWidth / (cw + gapValue)) || 1;

      setCardWidth(cw);
      setGap(gapValue);
      setCardsPerView(visible);

      // Asegurar currentIndex válido
      setCurrentIndex(prev => {
        const maxIndex = Math.max(0, productos.length - visible);
        return Math.min(prev, maxIndex);
      });
    };

    measure();
    window.addEventListener("resize", measure);
    // también observar cambios en fuentes/estilos que puedan afectar tamaño
    const ro = new ResizeObserver(measure);
    if (carouselRef.current) ro.observe(carouselRef.current);

    return () => {
      window.removeEventListener("resize", measure);
      ro.disconnect();
    };
  }, [productos]);

  // Actualizar currentIndex mientras se scrollea (opcional, para deshabilitar flechas final)
  useEffect(() => {
    const container = carouselRef.current;
    if (!container || !cardWidth) return;

    const onScroll = () => {
      const idx = Math.round(container.scrollLeft / (cardWidth + gap));
      setCurrentIndex(idx);
    };
    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, [cardWidth, gap]);

  const maxIndex = Math.max(0, productos.length - cardsPerView);

  const scrollToIndex = (index) => {
    const container = carouselRef.current;
    if (!container) return;

    const firstCard = container.querySelector("[data-carousel-card]");
    const baseLeft = firstCard ? firstCard.offsetLeft : 0; // offsetLeft relativo al contenido del contenedor
    const left = Math.max(0, baseLeft + index * (cardWidth + gap));

    container.scrollTo({ left, behavior: "smooth" });
    setCurrentIndex(index);
  };

  const scrollLeft = () => {
    const newIndex = Math.max(0, currentIndex - cardsPerView);
    scrollToIndex(newIndex);
  };

  const scrollRight = () => {
    const newIndex = Math.min(maxIndex, currentIndex + cardsPerView);
    scrollToIndex(newIndex);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage mensaje={error} />;
  if (productos.length === 0)
    return <p className="text-center">No hay productos destacados.</p>;

  return (
    <section className="relative pt-8 pb-6 px-4 max-w-screen-xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold mb-4 text-pink-600">Destacados</h2>
        <p className="text-gray-600">Los favoritos de nuestra comunidad</p>
      </div>

      <div className="relative">
        {/* Flechas: mostrar solo en sm+ */}
        <button
          onClick={scrollLeft}
          disabled={currentIndex === 0}
          className={`hidden sm:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-white shadow rounded-full p-2 hover:bg-pink-100 disabled:opacity-40`}
        >
          <ChevronLeft size={28} />
        </button>

        <div
          ref={carouselRef}
          className="flex overflow-x-auto scroll-smooth gap-6 no-scrollbar snap-x snap-mandatory justify-start"
        >
          {productos.map((producto) => (
            <div
              key={producto.id}
              data-carousel-card
              className="flex-none w-[90vw] sm:w-[240px] md:w-[260px] lg:w-[280px] xl:w-[300px] snap-center sm:snap-start mx-auto sm:mx-0 mb-4"
            >
              <ProductCard producto={producto} />
            </div>
          ))}
        </div>

        <button
          onClick={scrollRight}
          disabled={currentIndex >= maxIndex}
          className={`hidden sm:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-white shadow rounded-full p-2 hover:bg-pink-100 disabled:opacity-40`}
        >
          <ChevronRight size={28} />
        </button>
      </div>
    </section>
  );
}

export default ProductCarousel;







// import { useEffect, useRef, useState } from "react";
// import productosService from "../services/productoService";
// import ProductCard from "./ProductCard";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import LoadingSpinner from "./ui/LoadingSpinner";
// import ErrorMessage from "./ui/ErrorMessage";

// function ProductCarousel() {
//   const [productos, setProductos] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const carouselRef = useRef(null);

//   useEffect(() => {
//     const cargarProductos = async () => {
//       try {
//         const data = await productosService.getDestacados();
//         setProductos(data);
//       } catch (err) {
//         console.error("Error al cargar productos destacados:", err);
//         setError("No se pudieron cargar los productos destacados");
//       } finally {
//         setLoading(false);
//       }
//     };
//     cargarProductos();
//   }, []);

//   const scrollLeft = () => {
//     if (carouselRef.current) {
//       carouselRef.current.scrollBy({
//         left: -carouselRef.current.clientWidth * 0.9,
//         behavior: "smooth",
//       });
//     }
//   };

//   const scrollRight = () => {
//     if (carouselRef.current) {
//       carouselRef.current.scrollBy({
//         left: carouselRef.current.clientWidth * 0.9,
//         behavior: "smooth",
//       });
//     }
//   };

//   if (loading) return <LoadingSpinner />;
//   if (error) return <ErrorMessage mensaje={error} />;
//   if (productos.length === 0)
//     return <p className="text-center">No hay productos destacados.</p>;

//   return (
//     <section className="relative py-10 px-4 max-w-screen-xl mx-auto">
//       <div className="text-center mb-6">
//         <h2 className="text-3xl font-bold mb-4 text-pink-600">Destacados</h2>
//         <p className="text-gray-600">Los favoritos de nuestra comunidad</p>
//       </div>

//       {/* Contenedor del carrusel */}
//       <div className="relative">
//         {/* Flecha izquierda */}
//         <button
//           onClick={scrollLeft}
//           className="absolute -left-6 top-1/2 -translate-y-1/2 z-10 bg-white shadow rounded-full p-2 hover:bg-pink-100"
//         >
//           <ChevronLeft size={28} />
//         </button>

//         {/* Carrusel scrollable */}
//         <div
//           ref={carouselRef}
//           className="flex overflow-x-auto scroll-smooth gap-6 no-scrollbar snap-x snap-mandatory justify-center sm:justify-start px-4"
//         >
//           {productos.map((producto) => (
//             <div
//               key={producto.id}
//               className="flex-none w-[85vw] sm:w-[240px] md:w-[260px] lg:w-[280px] xl:w-[300px] snap-center"
//             >
//               <ProductCard producto={producto} />
//             </div>
//           ))}
//         </div>

//         {/* Flecha derecha */}
//         <button
//           onClick={scrollRight}
//           className="absolute -right-6 top-1/2 -translate-y-1/2 z-10 bg-white shadow rounded-full p-2 hover:bg-pink-100"
//         >
//           <ChevronRight size={28} />
//         </button>
//       </div>
//     </section>
//   );
// }

// export default ProductCarousel;



