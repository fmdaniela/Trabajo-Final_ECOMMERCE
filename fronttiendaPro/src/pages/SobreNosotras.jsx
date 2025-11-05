import { Link } from "react-router-dom";

function SobreNosotros() {
  return (
    <section className="py-12 px-6 sm:px-16 bg-rose-50 text-rose-900">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6">Sobre Vitalia</h2>

        <p className="text-lg leading-relaxed mb-4">
          En <strong>Vitalia</strong> creemos que vestirse es una forma de expresión, de sentirte bien con vos misma y mostrar tu esencia. 
          Nacimos con el deseo de ofrecer prendas cómodas, femeninas y con estilo, pensadas para acompañarte en cada momento del día.
        </p>

        <p className="text-lg leading-relaxed mb-4">
          Cada producto que seleccionamos está hecho con amor y cuidado, priorizando la calidad, los detalles y la experiencia de nuestras clientas. 
          Nos inspira la energía de las mujeres reales: activas, soñadoras y auténticas.
        </p>

        <p className="text-lg leading-relaxed italic">
          Nuestro compromiso es seguir creciendo con vos, creando una comunidad que elige sentirse bien, cómoda y vital 💕
        </p>

        <Link
          to="/productos"
          className="inline-block px-6 py-3 bg-[#E91E63] text-white font-semibold rounded-full shadow-md hover:bg-[#d81b60] transition"
        >
          Ver nuestros productos
        </Link>
      </div>
    </section>
  );
}

export default SobreNosotros;
