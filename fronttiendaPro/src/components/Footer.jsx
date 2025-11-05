import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { Link } from "react-router-dom";

const redesSociales = [
  { nombre: "Facebook", icono: FaFacebook, url: "https://www.facebook.com/TuPagina" },
  { nombre: "Twitter", icono: FaTwitter, url: "https://twitter.com/TuUsuario" },
  { nombre: "Instagram", icono: FaInstagram, url: "https://www.instagram.com/TuUsuario" },
  { nombre: "YouTube", icono: FaYoutube, url: "https://www.youtube.com/@TuCanal" },
];

function Footer() {
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      setMensaje("Por favor ingresá tu email.");
      return;
    }

    // Aquí podríamos hacer la petición al backend en un futuro:
    // axios.post('/api/newsletter', { email })
    //      .then(...)
    //      .catch(...)

    setMensaje("¡Gracias por suscribirte!");
    setEmail(""); // limpiar input
  };

  return (
    <footer className="bg-gray-100 text-gray-700 px-6 md:px-10 py-10 mt-10 text-sm">
      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
        
        {/* Marca y redes */}
        <div className="md:col-span-2">
          <h2 className="text-xl font-bold text-pink-600">Vitalia</h2>
          <p className="mt-2 text-sm">
            Moda deportiva femenina que inspira bienestar. Estilo, comodidad y actitud.
          </p>
          <div className="flex gap-4 mt-4 text-pink-600">
            {redesSociales.map(({ nombre, icono: Icono, url }) => (
              <a
                key={nombre}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-pink-700 transition"
                aria-label={nombre}
              >
                <Icono size={20} />
              </a>
            ))}
          </div>
        </div>

        {/* Navegación */}
        <div>
          <h3 className="font-semibold text-pink-600 mb-2">Tienda</h3>
          <ul className="space-y-1">
            {["Novedades", "Más Vendidos", "Ofertas", "Categorías"].map((item) => (
              <li key={item}>
                <a href="#" className="hover:text-pink-600 transition">{item}</a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-pink-600 mb-2">Ayuda</h3>
          <ul className="space-y-1">
            <li>
              <Link to="/preguntas-frecuentes" className="hover:text-pink-600 transition">
                Preguntas Frecuentes
              </Link>
            </li>
            <li>
              <Link to="/envios" className="hover:text-pink-600 transition">
                Envíos y Devoluciones
              </Link>
            </li>
            <li>
              <Link to="/contacto" className="hover:text-pink-600 transition">
                Contacto
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-pink-600 mb-2">Nosotras</h3>
          <ul className="space-y-1">
            {["Nuestra Historia", "Blog", "Trabajá con nosotras"].map((item) => (
              <li key={item}>
                <a href="#" className="hover:text-pink-600 transition">{item}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Newsletter */}
      <div className="max-w-2xl mx-auto mt-10 text-center">
        <h3 className="text-pink-600 font-semibold">Newsletter</h3>
        <p className="text-sm mt-1 mb-4">
          Suscribite para enterarte de nuevos lanzamientos y descuentos exclusivos.
        </p>
        <form className="flex items-center justify-center gap-2" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Tu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full max-w-xs px-3 py-2 border border-pink-400 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          <button
            type="submit"
            className="bg-pink-600 hover:bg-pink-700 text-white p-2 rounded-md transition cursor-pointer"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </button>
        </form>
        {mensaje && <p className="mt-2 text-sm text-pink-600">{mensaje}</p>}
      </div>

      {/* Legal */}
      <div className="border-t mt-10 pt-6 text-xs flex flex-col sm:flex-row justify-between items-center gap-3">
        <p>© 2025 Vitalia. Todos los derechos reservados.</p>
        <div className="flex gap-4">
          {["Privacidad", "Términos", "Cookies", "Accesibilidad"].map((item) => (
            <a
              key={item}
              href="#"
              className="hover:text-pink-600 transition"
            >
              {item}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
