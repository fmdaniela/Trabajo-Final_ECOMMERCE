import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";

export default function LoginAdmin() {
  const navigate = useNavigate();

  // Estado del formulario
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Zustand: funciones y estados de auth
  const { login, isAuthenticated, isLoading, error, clearError } = useAuthStore();

  // Si ya está logueado, redirigir al dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    const success = await login(email, password);
    if (!success) return;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 hover:shadow-blue-200">
        
        {/* Encabezado */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-900">
            Panel de Administración
          </h1>
          <p className="text-gray-600 mt-2">
            Bienvenido al panel de control. Iniciá sesión para gestionar el sistema.
          </p>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center font-medium">
            {error}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block mb-1 font-semibold text-gray-800">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block mb-1 font-semibold text-gray-800">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-700 text-white py-2 rounded font-semibold hover:bg-blue-800 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? "Iniciando sesión..." : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}



// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import useAuthStore from "../../store/authStore";

// export default function LoginAdmin() {
//   const navigate = useNavigate();

//   // Estado del formulario
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   // Zustand: funciones y estados de auth
//   const { login, isAuthenticated, isLoading, error, clearError } = useAuthStore();

//   // Si ya está logueado, redirigir al dashboard
//   useEffect(() => {
//     if (isAuthenticated) {
//       navigate("/admin/dashboard");
//     }
//   }, [isAuthenticated, navigate]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     clearError(); // limpiar errores previos

//     const success = await login(email, password);
//     if (!success) {
//       // El error se maneja desde authStore, solo mostramos mensaje en el render
//       return;
//     }
//     // Redirección se hace automáticamente por el useEffect
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-slate-800">
//       <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
//         <h1 className="text-2xl font-bold mb-6 text-center text-blue-950">Login Panel Admin</h1>

//         {error && (
//           <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <label className="block mb-1 font-semibold">Email</label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full border border-gray-300 p-2 rounded"
//               required
//             />
//           </div>

//           <div className="mb-6">
//             <label className="block mb-1 font-semibold">Contraseña</label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full border border-gray-300 p-2 rounded"
//               required
//             />
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
//             disabled={isLoading}
//           >
//             {isLoading ? "Iniciando sesión..." : "Ingresar"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }
