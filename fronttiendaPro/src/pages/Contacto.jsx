import { useState, useEffect } from "react";
import { FaWhatsapp, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import toast from "react-hot-toast";

function Contacto() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    asunto: "",
    mensaje: "",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { nombre, email, asunto, mensaje } = formData;

    if (!nombre || !email || !asunto || !mensaje) {
      toast.error("Por favor completá todos los campos.");
      return;
    }

    // 🔹 Simulación de envío (luego podmos agregar axios.post('/api/contacto', formData))
    toast.success("¡Mensaje enviado con éxito!");
    setFormData({ nombre: "", email: "", asunto: "", mensaje: "" });
  };

  return (
    <div className="max-w-5xl mx-auto p-6 grid md:grid-cols-2 gap-10">
      {/* 📝 Columna izquierda - Formulario */}
      <div>
        <h2 className="text-2xl font-bold text-pink-600 mb-4">Contacto</h2>
        <p className="mb-6 text-sm text-gray-700">
          Completá el formulario y nos pondremos en contacto contigo.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-pink-400 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-pink-400 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          <input
            type="text"
            name="asunto"
            placeholder="Asunto"
            value={formData.asunto}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-pink-400 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          <textarea
            name="mensaje"
            placeholder="Mensaje"
            value={formData.mensaje}
            onChange={handleChange}
            rows={5}
            className="w-full px-3 py-2 border border-pink-400 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          <button
            type="submit"
            className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-md transition"
          >
            Enviar
          </button>
        </form>
      </div>

      {/* 📞 Columna derecha - Datos de contacto */}
      <div className="bg-pink-50 p-6 rounded-lg shadow-sm flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-semibold text-pink-600 mb-4">
            También podés contactarnos:
          </h3>
          <ul className="space-y-4 text-gray-700">
            <li className="flex items-center gap-3">
              <FaWhatsapp className="text-green-500 text-xl" />
              <a
                href="https://wa.me/5493515444090"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-pink-600 transition"
              >
                +54 9 351 5444 090
              </a>
            </li>

            <li className="flex items-center gap-3">
              <FaEnvelope className="text-pink-500 text-xl" />
              <a
                href="mailto:info@vitalia.com"
                className="hover:text-pink-600 transition"
              >
                info@vitalia.com
              </a>
            </li>

            <li className="flex items-center gap-3">
              <FaMapMarkerAlt className="text-pink-500 text-xl" />
              <span>Av. Belgrano 344, Alta Gracia, Córdoba</span>
            </li>
          </ul>

          <div className="mt-6 text-sm text-gray-600">
            <p>Horario de atención:</p>
            <p>Lunes a Viernes de 9:00 a 13 y 17:00 a 21 hs - Sábados de 9 a 14 hs</p>
          </div>
        </div>

        {/* 🗺️ Mapa embebido */}
        <div className="mt-6">
          <iframe
            title="Mapa de ubicación"
            src="https://www.google.com/maps/embed?pb=!4v1760499999472!6m8!1m7!1sl6KudnMFIwn9jZ63rd-xQQ!2m2!1d-31.65801937300876!2d-64.42980894671742!3f169.13379!4f0!5f0.7820865974627469"
            width="100%"
            height="200"
            allowFullScreen=""
            loading="lazy"
            className="rounded-md border border-pink-200"
          ></iframe>
        </div>
      </div>
    </div>
  );
}

export default Contacto;



