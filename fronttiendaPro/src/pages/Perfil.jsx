// src/pages/Perfil.jsx
import { useState, useEffect } from "react";
import { UserIcon, EnvelopeIcon, PhoneIcon, CalendarIcon } from "@heroicons/react/24/outline";
import useAuth from "../hooks/useAuth";

const Perfil = () => {
  const { usuario } = useAuth();

  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    fechaNacimiento: "",
    actividades: [],
    talle: "S",
    nivelActividad: "Intermedio"
  });

  // Cargar datos iniciales (desde el usuario del contexto)
  useEffect(() => {
    if (usuario) {
      setFormData({
        nombre: usuario.nombre || "",
        email: usuario.email || "",
        telefono: usuario.telefono || "",
        fechaNacimiento: usuario.fechaNacimiento || "",
        actividades: usuario.actividades || [],
        talle: usuario.talle || "S",
        nivelActividad: usuario.nivelActividad || "Intermedio"
      });
    }
  }, [usuario]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => {
        const actividades = checked
          ? [...prev.actividades, value]
          : prev.actividades.filter((act) => act !== value);
        return { ...prev, actividades };
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Datos enviados:", formData);
    // Aquí luego conectamos con el backend para actualizar
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-8">
      <h1 className="text-2xl font-bold mb-6">Mi Perfil</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Información Personal */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-sky-500">Información Personal</h2>

          {/* Nombre */}
          <div className="flex items-center border rounded-lg px-3 py-2 mb-3">
            <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
            <input
              type="text"
              name="nombre"
              placeholder="Nombre Completo"
              value={formData.nombre}
              onChange={handleChange}
              className="w-full outline-none"
            />
          </div>

          {/* Email */}
          <div className="flex items-center border rounded-lg px-3 py-2 mb-3">
            <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-2" />
            <input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              value={formData.email}
              onChange={handleChange}
              className="w-full outline-none"
            />
          </div>

          {/* Teléfono */}
          <div className="flex items-center border rounded-lg px-3 py-2 mb-3">
            <PhoneIcon className="h-5 w-5 text-gray-400 mr-2" />
            <input
              type="tel"
              name="telefono"
              placeholder="Teléfono"
              value={formData.telefono}
              onChange={handleChange}
              className="w-full outline-none"
            />
          </div>

          {/* Fecha de nacimiento */}
          <div className="flex items-center border rounded-lg px-3 py-2">
            <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
            <input
              type="date"
              name="fechaNacimiento"
              value={formData.fechaNacimiento}
              onChange={handleChange}
              className="w-full outline-none"
            />
          </div>
        </div>

        {/* Preferencias Deportivas */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-sky-500">Preferencias Deportivas</h2>

          {/* Actividades favoritas */}
          <div className="mb-4 space-y-2">
            {["Yoga", "Running", "Gym", "Natación"].map((act) => (
              <label key={act} className="flex items-center">
                <input
                  type="checkbox"
                  name="actividades"
                  value={act}
                  checked={formData.actividades.includes(act)}
                  onChange={handleChange}
                  className="mr-2"
                />
                {act}
              </label>
            ))}
          </div>

          {/* Talle */}
          <div className="mb-4">
            <label className="block mb-1">Talle Preferido</label>
            <select
              name="talle"
              value={formData.talle}
              onChange={handleChange}
              className="border rounded-lg px-3 py-2 w-full"
            >
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
            </select>
          </div>

          {/* Nivel de actividad */}
          <div>
            <label className="block mb-1">Nivel de Actividad</label>
            <select
              name="nivelActividad"
              value={formData.nivelActividad}
              onChange={handleChange}
              className="border rounded-lg px-3 py-2 w-full"
            >
              <option value="Bajo">Bajo</option>
              <option value="Intermedio">Intermedio</option>
              <option value="Alto">Alto</option>
            </select>
          </div>
        </div>

        {/* Botones */}
        <div className="col-span-1 md:col-span-2 flex justify-end space-x-4 mt-6">
          <button
            type="button"
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg"
          >
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
};

export default Perfil;
