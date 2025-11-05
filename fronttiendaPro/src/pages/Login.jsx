import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // // GoogleLoginButton.jsx
import authService from "../services/authService";
import GoogleLoginButton from "../components/auth/GoogleLoginButton";


function Login() {
  const { usuario, login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Asegura que al entrar se vea desde arriba
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Función para login con email/password
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login({ email, password });
      if (!result.success) {
        setError(result.message || "Credenciales inválidas. Intenta nuevamente.");
        return;
      }
      navigate("/"); // redirige a Home después de login exitoso
    } catch (err) {
      console.error("Error inesperado en login:", err);
      setError("Ocurrió un error inesperado. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  // Si ya hay usuario logueado
  if (usuario) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-semibold mb-4">¡Hola, {usuario.nombre}!</h2>
        <p className="mb-4">Ya estás logueado.</p>
        <button
          onClick={() => location.reload()} // Podés usar logout si lo tenés en AuthProvider
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Cerrar sesión
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-md">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold mb-4 text-pink-600">Ingresar a mi cuenta</h2>
        <p className="text-gray-600">Accede a tu cuenta Vitalia</p>
      </div>

      {error && <p className="text-red-600 font-semibold mb-4">{error}</p>}

      {/* Formulario email/password */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="email"
            placeholder="Correo electrónico"
            className="w-full border p-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <input
            type="password"
            placeholder="Contraseña"
            className="w-full border p-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-pink-600 text-white p-2 rounded hover:bg-pink-700 cursor-pointer"
          disabled={loading}
        >
          {loading ? "Cargando..." : "Iniciar Sesión"}
        </button>
      </form>

      {/* Botón Google */}
      <div className="mt-4">
        <GoogleLoginButton />
      </div>

      <p className="text-sm mt-4 text-center">
        ¿No tenés cuenta?{" "}
        <Link to="/register" className="text-fuchsia-800 underline">
          Registrate aquí
        </Link>
      </p>
    </div>
  );
}

export default Login;




























// import { useState, useEffect } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import useAuth from '../hooks/useAuth';
// import GoogleLoginButton from "../components/auth/GoogleLoginButton";

// function Login() {
//   const { usuario, login, logout, loginSocial } = useAuth();
//   const navigate = useNavigate();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   // Listener para recibir mensaje del popup de Google
//   useEffect(() => {
//     const handleMessage = (event) => {
//       console.log("Origen del mensaje:", event.origin); // DEBUG
//        // Seguridad: solo aceptar mensajes del frontend que conocemos
//        // Para testear, comentmos la validación estricta:
//       // if (event.origin !== "http://localhost:5173") return; // seguridad

//       const data = event.data;

//       console.log("Mensaje recibido en Login.jsx:", data);

//       if (data?.user && data?.accessToken && data?.refreshToken) {
//         console.log("Login social recibido:", data); // ✅ debug
//         loginSocial({
//           user: data.user,
//           accessToken: data.accessToken,
//           refreshToken: data.refreshToken
//         });
//         navigate("/"); // Redirige al Home
//       }
//     };

//     window.addEventListener("message", handleMessage);
//     return () => window.removeEventListener("message", handleMessage);
//   }, [loginSocial, navigate]); // dependencias correctas

//   // Función para abrir popup de Google
//   const handleGoogleLogin = () => {
//     const width = 500;
//     const height = 600;
//     const left = window.screen.width / 2 - width / 2;
//     const top = window.screen.height / 2 - height / 2;

//     window.open(
//       "http://localhost:3000/api/auth/google",
//       "googleLoginPopup",
//       `width=${width},height=${height},top=${top},left=${left}`
//     );
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     try {
//       const result = await login({ email, password });
//       if (!result.success) {
//         setError(result.message || "Credenciales inválidas. Intenta nuevamente.");
//         return;
//       }
//       navigate("/"); // redirige a Home después de login exitoso
//     } catch (err) {
//       console.error("Error inesperado en login:", err);
//       setError("Ocurrió un error inesperado. Intenta nuevamente.");
//     } finally {
//       setLoading(false);
//     }
//   };

  
//   // Si ya hay usuario logueado
//   if (usuario) {
//     return (
//       <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-md text-center">
//         <h2 className="text-2xl font-semibold mb-4">¡Hola, {usuario.nombre}!</h2>
//         <p className="mb-4">Ya estás logueado.</p>
//         <button
//           onClick={logout}
//           className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
//         >
//           Cerrar sesión
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-md">
//       <div className="text-center mb-6">
//         <h2 className="text-2xl font-semibold mb-4 text-pink-600">Iniciar Sesión</h2>
//         <p className="text-gray-600">Accede a tu cuenta Vitalia</p>
//       </div>

//       {error && <p className="text-red-600 font-semibold mb-4">{error}</p>}

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <input
//             type="email"
//             placeholder="Correo electrónico"
//             className="w-full border p-2 rounded"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//         </div>

//         <div>
//           <input
//             type="password"
//             placeholder="Contraseña"
//             className="w-full border p-2 rounded"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//         </div>

//         <button
//           type="submit"
//           className="w-full bg-pink-600 text-white p-2 rounded hover:bg-pink-700 cursor-pointer"
//           disabled={loading}
//         >
//           {loading ? "Cargando..." : "Iniciar Sesión"}
//         </button>
//       </form>

//       <button
//         type="button"
//         onClick={handleGoogleLogin}
//         className="w-full flex items-center justify-center gap-2 border border-gray-500 p-2 rounded mt-4 hover:bg-gray-200 transition cursor-pointer"
//       >
//         <img src="/google.png" alt="Google" className="w-5 h-5"/>
//         <span>Iniciar sesión con Google</span>
//       </button>

//       <p className="text-sm mt-4 text-center">
//         ¿No tenés cuenta?{" "}
//         <Link to="/register" className="text-fuchsia-800 underline">
//           Registrate aquí
//         </Link>
//       </p>
//     </div>
//   );
// }

// export default Login;
















































// import { useState, useEffect } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import useAuth from '../hooks/useAuth';

// function Login() {
//   const { usuario, login, logout, loginSocial } = useAuth();
//   const navigate = useNavigate();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   // Listener para recibir mensaje del popup de Google
//    useEffect(() => {
//     const handleMessage = (event) => {
//       console.log("Mensaje recibido en Login.jsx:", event.data);
//       const data = event.data;
//       if (data?.user && data?.accessToken && data?.refreshToken) {
//         loginSocial({
//         user: data.user,
//         accessToken: data.accessToken,
//         refreshToken: data.refreshToken
//       });
//         navigate("/");     // Redirige al Home
//       }
//     };

//     window.addEventListener("message", handleMessage);
//     return () => window.removeEventListener("message", handleMessage);
//   }, [loginSocial, navigate]); // ✅ Dependencias correctas


//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     try {
//       const result = await login({ email, password }); // AuthProvider maneja todo
//       if (!result.success) {
//         setError(result.message || "Credenciales inválidas. Intenta nuevamente.");
//         return;
//       }
//       navigate("/"); // Redirige a Home después de login exitoso
//     } catch (err) {
//       console.error("Error inesperado en login:", err);
//       setError("Ocurrió un error inesperado. Intenta nuevamente.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Función para abrir popup de Google y recibir postMessage
// const handleGoogleLogin = () => {
//   const width = 500;
//   const height = 600;
//   const left = window.screen.width / 2 - width / 2;
//   const top = window.screen.height / 2 - height / 2;

//   const popup = window.open(
//     "http://localhost:3000/api/auth/google",
//     "googleLoginPopup", // nombre del popup
//     `width=${width},height=${height},top=${top},left=${left}`
//   );

//   // Escuchar mensaje del popup
//   const receiveMessage = (event) => {
//     if (event.origin !== "http://localhost:5173") return; // seguridad
//     if (!event.data?.user) return;

//     console.log("Login social recibido:", event.data);

//     // Guardar user y tokens igual que login clásico
//     loginSocial(event.data.user, event.data.accessToken, event.data.refreshToken);

//     // Cerrar popup y limpiar listener
//     window.removeEventListener("message", receiveMessage);
//     if (popup) popup.close();
//   };

//   window.addEventListener("message", receiveMessage);
// };

//   // Si ya hay usuario logueado
//   if (usuario) {
//     return (
//       <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-md text-center">
//         <h2 className="text-2xl font-semibold mb-4">¡Hola, {usuario.nombre}!</h2>
//         <p className="mb-4">Ya estás logueado.</p>
//         <button
//           onClick={logout}
//           className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
//         >
//           Cerrar sesión
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-md">
//       <div className="text-center mb-6">
//         <h2 className="text-2xl font-semibold mb-4 text-pink-600">Iniciar Sesión</h2>
//         <p className="text-gray-600">Accede a tu cuenta Vitalia</p>
//       </div>

//       {error && <p className="text-red-600 font-semibold mb-4">{error}</p>}

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <input
//             type="email"
//             placeholder="Correo electrónico"
//             className="w-full border p-2 rounded"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//         </div>

//         <div>
//           <input
//             type="password"
//             placeholder="Contraseña"
//             className="w-full border p-2 rounded"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//         </div>

//         <button
//           type="submit"
//           className="w-full bg-pink-600 text-white p-2 rounded hover:bg-pink-700 cursor-pointer"
//           disabled={loading}
//         >
//           {loading ? "Cargando..." : "Iniciar Sesión"}
//         </button>
//       </form>

//       <button
//         type="button"
//         onClick={handleGoogleLogin}
//         className="w-full flex items-center justify-center gap-2 border border-gray-500 p-2 rounded mt-4 hover:bg-gray-200 transition cursor-pointer"
//       >
//         <img src="/google.png" alt="Google" className="w-5 h-5"/>
//         <span>Iniciar sesión con Google</span>
//       </button>

//       <p className="text-sm mt-4 text-center">
//         ¿No tenés cuenta?{" "}
//         <Link to="/register" className="text-fuchsia-800 underline">
//           Registrate aquí
//         </Link>
//       </p>
//     </div>
//   );
// }

// export default Login;






























// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import useAuth from '../hooks/useAuth';

// function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     try {
//       await login({ email, password }); // AuthProvider maneja todo
//       navigate("/"); // Redirige a Home después de login
//     } catch (err) {
//       console.error("Error en login:", err);

//       if (err.response?.data?.message) {
//         setError(err.response.data.message); // Mensaje del backend
//       } else if (typeof err === "string") {
//         setError(err);
//       } else {
//         setError("Credenciales inválidas. Intenta nuevamente.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-md">
//       <div className="text-center mb-6">
//         <h2 className="text-2xl font-semibold mb-4 text-pink-600">Iniciar Sesión</h2>
//         <p className="text-gray-600">Accede a tu cuenta Vitalia</p>
//       </div>

//       {error && <p className="text-red-600 font-semibold mb-4">{error}</p>}

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <input
//             type="email"
//             placeholder="Correo electrónico"
//             className="w-full border p-2 rounded"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//         </div>

//         <div>
//           <input
//             type="password"
//             placeholder="Contraseña"
//             className="w-full border p-2 rounded"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//         </div>

//         <button
//           type="submit"
//           className="w-full bg-pink-600 text-white p-2 rounded hover:bg-pink-700 cursor-pointer"
//           disabled={loading}
//         >
//           {loading ? "Cargando..." : "Iniciar Sesión"}
//         </button>
//       </form>

//       <p className="text-sm mt-4 text-center">
//         ¿No tenés cuenta?{" "}
//         <Link to="/register" className="text-fuchsia-800 underline">
//           Registrate aquí
//         </Link>
//       </p>
//     </div>
//   );
// }

// export default Login;


// /*
// login dentro del AuthProvider ya llama a authService.loginUsuario o authService.loginAdmin según corresponda.
// Esto te permite centralizar la lógica de sesión (guardar tokens, actualizar estado, etc.) en un solo lugar (AuthProvider).
// Si importáramos authService directamente en Login.jsx, duplicaríamos la lógica de manejo de sesión y localStorage.

// Resumen:
// Antes: Login.jsx llamaba directo a authService, guardaba tokens y usuario en localStorage.
// Ahora: Login.jsx solo llama login() del AuthProvider → todo lo demás (tokens, localStorage, estado) queda centralizado.
// */















