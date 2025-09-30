import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
  });
  
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { registerUsuario, } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  
  const handleSubmit = async (e) => {
  e.preventDefault();
  setMensaje('');
  setError('');
  setLoading(true);

  
  try {
    // Prueba rápida: solo campos esperados por backend
    const registroData = {
      nombre: formData.nombre,
      apellido: formData.apellido,
      email: formData.email,
      password: formData.password,
      idRol: 3 // USER
    };

    await registerUsuario(registroData);

    setMensaje('Registro exitoso. Redirigiendo al login...');

  // // Opcional: login automático
  //   await login({ email: formData.email, password: formData.password }, 'USUARIO');

  // Redirige al login después de 1.5s    
     setTimeout(() => {
       navigate('/login');
     }, 1500);
  
  } catch (err) {
    console.log('Error completo:', err);

  // Manejo de errores del backend (validaciónes desde express-validator)
  if (err.response?.data?.errors) {
    console.log('Errores del backend:', err.response.data.errors);
    setError(err.response.data.errors.map(e => e.msg).join(', '));
  } else if (typeof err === 'string') {
    setError(err);
  } else {
    setError('Error al registrarse');
  } 
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-md">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold mb-4 text-pink-600">Crear Cuenta</h2>
        <p className="text-gray-600">Únete a la comunidad Vitalia</p>
      </div>
      {mensaje && <p className="text-green-600 mb-2">{mensaje}</p>}
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={formData.nombre}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          name="apellido"
          placeholder="Apellido"
          value={formData.apellido}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={formData.email}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={formData.password}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        {/* <input
          type="tel"
          name="telefono"
          placeholder="Teléfono"
          value={formData.telefono}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />  */}
        <button
          type="submit"
          className="w-full bg-pink-600 text-white p-2 rounded hover:bg-pink-700 cursor-pointer"
          disabled={loading}
        >
          {loading ? 'Cargando...' : 'Registrarme'}
        </button>
      </form>
      <p className="text-sm mt-4 text-center">
        ¿Ya tenés cuenta?{' '}
        <Link to="/login" className="text-fuchsia-800 underline">
          Iniciar Sesión
        </Link>
      </p>
    </div>
  );
};

export default Register;


































// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import authService from '../services/authService';
// import { Link } from 'react-router-dom';

// const Register = () => {
//   const [formData, setFormData] = useState({
//     nombre: '',
//     apellido: '',
//     email: '',
//     password: '',
//     telefono: ''
//   });

//   const [mensaje, setMensaje] = useState('');
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   // Para manejar cambios en los inputs
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // Para manejar envío del formulario 
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMensaje('');
//     setError('');

//     try {
//       await authService.registrar(formData);

//       // mostramos mensaje, limpiamps y redirigimos
//       setMensaje('Registro exitoso. Redirigiendo al login...');
//       setFormData({ nombre: '', apellido: '', email: '', password: '', telefono: '' });

//       setTimeout(() => {
//         navigate('/login');
//       }, 2000); // 2 segundos
//     } catch (err) {
//       setError(err);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-md">
//       <div className="text-center mb-6">
//         <h2 className="text-2xl font-semibold mb-4 text-pink-600">Crear Cuenta</h2>
//         <p className="text-gray-600">Únete a la comunidad Vitalia</p>
//       </div>  
//       {mensaje && <p className="text-green-600 mb-2">{mensaje}</p>}
//       {error && <p className="text-red-600 mb-2">{error}</p>}
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input
//           type="text"
//           name="nombre"
//           placeholder="Nombre"
//           value={formData.nombre}
//           onChange={handleChange}
//           className="w-full border p-2 rounded"
//           required
//         />
//         <input
//           type="text"
//           name="apellido"
//           placeholder="Apellido"
//           value={formData.apellido}
//           onChange={handleChange}
//           className="w-full border p-2 rounded"
//           required
//         />
//         <input
//           type="email"
//           name="email"
//           placeholder="Correo electrónico"
//           value={formData.email}
//           onChange={handleChange}
//           className="w-full border p-2 rounded"
//           required
//         />
//         <input
//           type="password"
//           name="password"
//           placeholder="Contraseña"
//           value={formData.password}
//           onChange={handleChange}
//           className="w-full border p-2 rounded"
//           required
//         />
//         <input
//           type="tel"
//           name="telefono"
//           placeholder="Telefono"
//           value={formData.telefono}
//           onChange={handleChange}
//           className="w-full border p-2 rounded"
//           required
//         />
//         <button
//           type="submit"
//           className="w-full bg-pink-600 text-white p-2 rounded hover:bg-pink-700 cursor-pointer"
//         >
//           Registrarme
//         </button>
//       </form>
//       <p className="text-sm mt-4 text-center">
//         ¿Ya tenés cuenta?{' '}
//         <Link to="/login" className="text-fuchsia-800 underline">
//           Iniciar Sesión
//         </Link>
//       </p>
//     </div>
//   );
// };

// export default Register;
