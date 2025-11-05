import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const { registerUsuario } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const registroData = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        password: formData.password,
        idRol: 3
      };

      const result = await registerUsuario(registroData);

      if (result.success) {
        toast.success("Usuario registrado. Te enviamos un mail de bienvenida.");

        // Redirigir al login 
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        toast.error(result.message || "Error al registrarse");
      }

    } catch (err) {
      console.error("Error completo:", err);
      toast.error("Error al registrarse");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-md">
      <ToastContainer />
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold mb-4 text-pink-600">Crear Cuenta</h2>
        <p className="text-gray-600">Únete a la comunidad Vitalia</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleChange} className="w-full border p-2 rounded" required />
        <input type="text" name="apellido" placeholder="Apellido" value={formData.apellido} onChange={handleChange} className="w-full border p-2 rounded" required />
        <input type="email" name="email" placeholder="Correo electrónico" value={formData.email} onChange={handleChange} className="w-full border p-2 rounded" required />
        <input type="password" name="password" placeholder="Contraseña" value={formData.password} onChange={handleChange} className="w-full border p-2 rounded" required />
        <button type="submit" className="w-full bg-pink-600 text-white p-2 rounded hover:bg-pink-700 cursor-pointer" disabled={loading}>
          {loading ? 'Registrando...' : 'Registrarme'}
        </button>
      </form>
      <p className="text-sm mt-4 text-center">
        ¿Ya tenés cuenta?{' '}
        <Link to="/login" className="text-fuchsia-800 underline">Iniciar Sesión</Link>
      </p>
    </div>
  );
};

export default Register;

