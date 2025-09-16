import { CheckCircleIcon, TagIcon } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';

function HeroBlock() {
  return (
    <section className="bg-[#fce4ec] py-12 shadow-[0_2px_10px_rgba(0,0,0,0.08),_0_-2px_10px_rgba(0,0,0,0.08)]">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
        {/* Texto */}
        <div>
          <div className="flex items-center justify-center md:justify-start gap-4 mb-4 text-center md:text-left max-w-full sm:max-w-xl mx-auto">
            <TagIcon className="w-18 h-18 sm:w-20 sm:h-20 md:w-24 md:h-24 xl:w-24 xl:h-24 text-[#E91E63]" />
            <h2 className="text-3xl sm:text-4xl md:text-4xl xl:text-5xl font-bold text-[#E91E63]">
              Nuevo impulso para tu entrenamiento
            </h2>
          </div>

          <p className="text-gray-600 mb-6 text-base sm:text-lg">
            Hasta un 40% OFF en prendas seleccionadas. Descubrí la nueva colección antes que se agote!
          </p>

          <ul className="mb-6 space-y-2">
            {[
              'Envíos gratis a todo el país',
              'Cambios sin costo',
              'Stock limitado por tiempo',
            ].map((item, i) => (
              <li key={i} className="flex items-center text-sm text-gray-700">
                <CheckCircleIcon className="h-5 w-5 text-[#E91E63] mr-2" />
                {item}
              </li>
            ))}
          </ul>
        <div className="text-center md:text-left">    
          <Link
            to="#"
            className="inline-block bg-[#E91E63] hover:bg-[#d81b60] text-white font-semibold py-3 px-6 rounded-xl transition duration-300 shadow-md"
          >
            Ver ofertas
          </Link>
        </div>
        </div>

        {/* Imagen */}
        <div className="flex justify-center">
          <img
            src="https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg?auto=compress&cs=tinysrgb&h=500"
            alt="Hero mujer deportiva"
            className="rounded-3xl object-cover w-full max-w-md h-[360px] shadow-md hover:scale-[1.03] transition-transform duration-300"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroBlock;

