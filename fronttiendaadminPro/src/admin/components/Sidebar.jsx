import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, LogOut, Key, Shield, Users, Tag, Package } from "lucide-react";
import useAuthStore from "../../store/authStore";

const links = [
  { to: "/admin/dashboard", label: "Dashboard", icon: Home },
  { to: "/admin/roles", label: "Roles", icon: Key },
  { to: "/admin/administradores", label: "Administradores", icon: Shield },
  { to: "/admin/usuarios", label: "Usuarios", icon: Users },
  { to: "/admin/categorias", label: "Categorías", icon: Tag },
  { to: "/admin/productos", label: "Productos", icon: Package },
];

const Sidebar = ({ isOpen, toggleMenu }) => {
  const { pathname } = useLocation();
  const { logout } = useAuthStore();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutConfirm = () => {
    console.log("[Sidebar] Confirmación de logout manual");
    logout(); // sin parámetro = logout manual
    setShowLogoutModal(false);
    toggleMenu();
  };

  return (
    <>
      <aside
        className={`fixed md:static top-0 left-0 min-h-screen w-64 bg-slate-800 shadow-lg p-4 font-sans transform md:translate-x-0 transition-transform duration-300 z-50 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <h2 className="text-xl font-bold text-blue-200 mb-6">Admin Vitalia</h2>

        <nav className="space-y-2">
          {links.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center p-2 rounded hover:bg-blue-500 transition-colors duration-200 ${
                pathname === to
                  ? "bg-blue-900 font-semibold text-white"
                  : "text-white"
              }`}
            >
              <Icon className="h-5 w-5 mr-2" />
              {label}
            </Link>
          ))}
        </nav>

        <button
          onClick={() => setShowLogoutModal(true)}
          className="flex items-center p-2 mt-6 w-full rounded bg-blue-700 text-white hover:bg-blue-900 transition-colors duration-200"
        >
          <LogOut className="h-5 w-5 mr-2" />
          Logout
        </button>
      </aside>

      {showLogoutModal && (
        <div className="fixed inset-0 bg-slate-800 bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              ¿Cerrar sesión?
            </h2>
            <p className="text-gray-600 mb-6">
              ¿Estás seguro que deseas salir del panel admin?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleLogoutConfirm}
                className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800 transition-colors"
              >
                Sí, cerrar sesión
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="border border-gray-400 text-gray-700 px-4 py-2 rounded hover:bg-gray-100"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;


















// import { useState } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { Home, LogOut, Key, Shield, Users, Tag, Package } from "lucide-react";
// import useAuthStore from "../../store/authStore";

// const links = [
//   { to: "/admin/dashboard", label: "Dashboard", icon: Home },
//   { to: "/admin/roles", label: "Roles", icon: Key },
//   { to: "/admin/administradores", label: "Administradores", icon: Shield },
//   { to: "/admin/usuarios", label: "Usuarios", icon: Users },
//   { to: "/admin/categorias", label: "Categorías", icon: Tag },
//   { to: "/admin/productos", label: "Productos", icon: Package },
// ];

// const Sidebar = ({ isOpen, toggleMenu }) => {
//   const { pathname } = useLocation();
//   const { logout } = useAuthStore();
//   const [showLogoutModal, setShowLogoutModal] = useState(false);

//   const handleLogoutConfirm = () => {
//     logout();
//     setShowLogoutModal(false);
//     toggleMenu(); // para cerrar el menú si está abierto
//   };

//   return (
//     <>
//       {/* Sidebar */}
//       <aside
//         className={`fixed md:static top-0 left-0 min-h-screen w-64 bg-slate-800 shadow-lg p-4 font-sans transform md:translate-x-0 transition-transform duration-300 z-50 ${
//           isOpen ? "translate-x-0" : "-translate-x-full"
//         }`}
//       >
//         <h2 className="text-xl font-bold text-blue-200 mb-6">Admin Vitalia</h2>

//         {/* Links */}
//         <nav className="space-y-2">
//           {links.map(({ to, label, icon: Icon }) => (
//             <Link
//               key={to}
//               to={to}
//               className={`flex items-center p-2 rounded hover:bg-blue-500 transition-colors duration-200 ${
//                 pathname === to
//                   ? "bg-blue-900 font-semibold text-white"
//                   : "text-white"
//               }`}
//             >
//               <Icon className="h-5 w-5 mr-2" />
//               {label}
//             </Link>
//           ))}
//         </nav>

//         {/* Botón Logout */}
//         <button
//           onClick={() => setShowLogoutModal(true)}
//           className="flex items-center p-2 mt-6 w-full rounded bg-blue-700 text-white hover:bg-blue-900 transition-colors duration-200"
//         >
//           <LogOut className="h-5 w-5 mr-2" />
//           Logout
//         </button>
//       </aside>

//       {/* Modal de confirmación */}
//       {showLogoutModal && (
//         <div className="fixed inset-0 bg-slate-800 bg-opacity-40 flex justify-center items-center z-50">
//           <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
//             <h2 className="text-xl font-bold text-gray-800 mb-2">
//               ¿Cerrar sesión?
//             </h2>
//             <p className="text-gray-600 mb-6">
//               ¿Estás seguro que deseas salir del panel admin?
//             </p>
//             <div className="flex justify-center gap-4">
//               <button
//                 onClick={handleLogoutConfirm}
//                 className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800 transition-colors"
//               >
//                 Sí, cerrar sesión
//               </button>
//               <button
//                 onClick={() => setShowLogoutModal(false)}
//                 className="border border-gray-400 text-gray-700 px-4 py-2 rounded hover:bg-gray-100"
//               >
//                 Cancelar
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default Sidebar;





























