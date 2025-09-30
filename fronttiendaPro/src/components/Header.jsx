import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCartIcon, UserIcon } from '@heroicons/react/24/solid';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from "../context/AuthContext";
import { useCarrito } from "../context/CarritoContext";
import { useNavigate } from "react-router-dom";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const location = useLocation();
  const { usuario, logout } = useAuth();
  const { cantidadTotal } = useCarrito();
  const navigate = useNavigate();
  

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Productos', path: '/productos' },
    { name: 'Categorias', path: '/categorias' },
    { name: 'Bienestar', path: '/bienestar' },
    { name: 'Sobre Nosotras', path: '/sobrenosotras' },
    { name: 'Contacto', path: '/contacto' },
  ];

  const handleLogoutConfirm = () => {
    logout();
    navigate("/"); 
    setShowLogoutModal(false);
    setMenuOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-[#E91E63] shadow-2xs px-4 py-4 flex items-center justify-between">
        
        {/* Logo + links desktop */}
        <div className="flex items-center space-x-6">
          <Link to="/" className="text-2xl font-bold text-white">Vitalia</Link>

          <ul className="hidden md:flex space-x-6 text-white font-medium">
            {navLinks.map(({ name, path }) => (
              <li key={path}>
                <Link
                  to={path}
                  className={`hover:text-gray-200 ${
                    location.pathname === path ? 'underline underline-offset-4' : ''
                  }`}
                >
                  {name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Icons + menú hamburguesa */}
        <div className="flex items-center space-x-4">
          <Link to="/carrito" className="relative cursor-pointer">
           <ShoppingCartIcon className="w-6 h-6 text-white hover:text-gray-200" />
           {/* {cantidadTotal > 0 && ( */} 
             <span className="absolute -top-2 -right-2 bg-fuchsia-800 text-white text-xs rounded-full px-1">
               {cantidadTotal}
             </span>
           {/* )} */}
         </Link>

          {/* Usuario logueado - desktop */}
          {usuario ? (
            <div className="flex items-center space-x-2 text-white">
              <span className="text-sm hidden sm:inline">¡Hola, {usuario.nombre}!</span>
              <button
                onClick={() => setShowLogoutModal(true)}
                className="text-sm hover:text-gray-200 cursor-pointer"
              >
                Cerrar sesión
              </button>
            </div>
          ) : (
            <Link to="/login">
              <UserIcon className="w-6 h-6 text-white hover:text-gray-200 cursor-pointer" />
            </Link>
          )}

          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? (
              <XMarkIcon className="w-6 h-6 text-white" />
            ) : (
              <Bars3Icon className="w-6 h-6 text-white" />
            )}
          </button>
        </div>

        {/* Menú mobile */}
        {menuOpen && (
          <ul className="absolute top-full left-0 w-full bg-[#E91E63] shadow-md md:hidden flex flex-col space-y-2 px-6 py-4 text-white font-medium">
            {navLinks.map(({ name, path }) => (
              <li key={path}>
                <Link
                  to={path}
                  onClick={() => setMenuOpen(false)}
                  className={`block hover:text-gray-200 ${
                    location.pathname === path ? 'underline underline-offset-4' : ''
                  }`}
                >
                  {name}
                </Link>
              </li>
            ))}

            {/* Saludo + cerrar sesión o iniciar sesión en mobile */}
            {usuario ? (
              <div className="flex flex-col space-y-1 mt-4 border-t border-white pt-2">
                <span className="text-sm">¡Hola, {usuario.nombre}!</span>
                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="text-sm text-left hover:text-gray-200 cursor-pointer"
                >
                  Cerrar sesión
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="text-sm underline hover:text-gray-200 mt-4"
              >
                Iniciar sesión
              </Link>
            )}
          </ul>
        )}
      </nav>

      {/* Modal de confirmación */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-20 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-pink-600 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7" />
            </svg>
            <h2 className="text-xl text-pink-600 font-semibold mb-2">¿Cerrar Sesión?</h2>
            <p className="text-gray-600 mb-4">
              ¿Estás segura que deseas cerrar tu sesión en Vitalia?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleLogoutConfirm}
                className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 cursor-pointer"
              >
                Sí, Cerrar Sesión
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="border border-gray-400 text-gray-600 px-4 py-2 rounded hover:bg-gray-100 - cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
}

export default Header;









// import { useState } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { ShoppingCartIcon, UserIcon } from '@heroicons/react/24/solid';
// import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
// import useAuth from "../hooks/useAuth";

// function Header() {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const location = useLocation();
//   const { usuario, logout } = useAuth();

//   const navLinks = [
//     { name: 'Home', path: '/' },
//     { name: 'Productos', path: '/productos' },
//     { name: 'Categorias', path: '/categorias' },
//     { name: 'Bienestar', path: '/bienestar' },
//     { name: 'Sobre Nosotras', path: '/sobrenosotras' },
//     { name: 'Contacto', path: '/contacto' },
//   ];

//   return (
//     <nav className="fixed top-0 left-0 w-full z-50 bg-[#E91E63] shadow-2xs px-4 py-4 flex items-center justify-between">
      
//       {/* Logo + links desktop */}
//       <div className="flex items-center space-x-6">
//         <Link to="/" className="text-2xl font-bold text-white">Vitalia</Link>

//         <ul className="hidden md:flex space-x-6 text-white font-medium">
//           {navLinks.map(({ name, path }) => (
//             <li key={path}>
//               <Link
//                 to={path}
//                 className={`hover:text-gray-200 ${
//                   location.pathname === path ? 'underline underline-offset-4' : ''
//                 }`}
//               >
//                 {name}
//               </Link>
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* Icons + menú hamburguesa */}
//       <div className="flex items-center space-x-4">
//         <div className="relative cursor-pointer">
//           <ShoppingCartIcon className="w-6 h-6 text-white hover:text-gray-200" />
//           <span className="absolute -top-2 -right-2 bg-fuchsia-800 text-white text-xs rounded-full px-1">3</span>
//         </div>

//         {/* Usuario logueado - desktop */}
//         {usuario ? (
//           <div className="flex items-center space-x-2 text-white">
//             <span className="text-sm hidden sm:inline">¡Hola, {usuario.nombre}!</span>
//             <button
//               onClick={logout}
//               className="text-sm hover:text-gray-200 cursor-pointer"
//             >
//               Cerrar sesión
//             </button>
//           </div>
//         ) : (
//           <Link to="/login">
//             <UserIcon className="w-6 h-6 text-white hover:text-gray-200 cursor-pointer" />
//           </Link>
//         )}

//         <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
//           {menuOpen ? (
//             <XMarkIcon className="w-6 h-6 text-white" />
//           ) : (
//             <Bars3Icon className="w-6 h-6 text-white" />
//           )}
//         </button>
//       </div>

//       {/* Menú mobile */}
//       {menuOpen && (
//         <ul className="absolute top-full left-0 w-full bg-[#E91E63] shadow-md md:hidden flex flex-col space-y-2 px-6 py-4 text-white font-medium">
//           {navLinks.map(({ name, path }) => (
//             <li key={path}>
//               <Link
//                 to={path}
//                 onClick={() => setMenuOpen(false)}
//                 className={`block hover:text-gray-200 ${
//                   location.pathname === path ? 'underline underline-offset-4' : ''
//                 }`}
//               >
//                 {name}
//               </Link>
//             </li>
//           ))}

//           {/* Saludo + cerrar sesión o iniciar sesión en mobile */}
//           {usuario ? (
//             <div className="flex flex-col space-y-1 mt-4 border-t border-white pt-2">
//               <span className="text-sm">¡Hola, {usuario.nombre}!</span>
//               <button
//                 onClick={() => {
//                   logout();
//                   setMenuOpen(false);
//                 }}
//                 className="text-sm text-left hover:text-gray-200 cursor-pointer"
//               >
//                 Cerrar sesión
//               </button>
//             </div>
//           ) : (
//             <Link
//               to="/login"
//               onClick={() => setMenuOpen(false)}
//               className="text-sm underline hover:text-gray-200 mt-4"
//             >
//               Iniciar sesión
//             </Link>
//           )}
//         </ul>
//       )}
//     </nav>
//   );
// }

// export default Header;
