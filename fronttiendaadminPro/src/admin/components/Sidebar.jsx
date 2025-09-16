import { Link, useLocation } from "react-router-dom";
import { Home, Users, Tag, LogOut, UserCog, UserStar } from "lucide-react";
import useAuthStore from "../../store/authStore";

const links = [
  { to: "/admin/dashboard", label: "Dashboard", icon: Home },
  { to: "/admin/roles", label: "Roles", icon: UserCog },
  { to: "/admin/administradores", label: "Administradores", icon: UserStar },
  { to: "/admin/usuarios", label: "Usuarios", icon: Users },
  { to: "/admin/categorias", label: "Categorías", icon: Tag },
];

const Sidebar = ({ isOpen, toggleMenu }) => {
  const { pathname } = useLocation();
  const { logout } = useAuthStore();

  return (
    <aside
      className={`fixed md:static top-0 left-0 min-h-screen w-64 bg-slate-800 shadow-lg p-4 font-sans transform md:translate-x-0 transition-transform duration-300 z-50 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Título */}
      <h2 className="text-xl font-bold text-blue-200 mb-6">Admin Vitalia</h2>

      {/* Links */}
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

      {/* Botón Logout */}
      <button
        onClick={() => {
          logout();
          toggleMenu();
        }}
        className="flex items-center p-2 mt-6 w-full rounded bg-blue-700 text-white hover:bg-blue-900 transition-colors duration-200"
      >
        <LogOut className="h-5 w-5 mr-2" />
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;

























// import { Link, useLocation } from "react-router-dom";
// import { Home, Users, Tag, Package, LogOut, UserCog, UserStar } from "lucide-react";
// import useAuthStore from "../../store/authStore";
// const links = [
//   { to: "/admin/dashboard", label: "Dashboard", icon: Home },
//   { to: "/admin/roles", label: "Roles", icon: UserCog },
//   { to: "/admin/administradores", label: "Administradores", icon: UserStar },
//   { to: "/admin/usuarios", label: "Usuarios", icon: Users },
//   { to: "/admin/categorias", label: "Categorías", icon: Tag },
//   // { to: "/admin/productos", label: "Productos", icon: Package },
// ];
// const Sidebar = ({ isOpen, toggleMenu }) => {
//   const { pathname } = useLocation();
//   const { logout } = useAuthStore();
//   return (
//     <aside
//       className={`fixed md:static top-0 left-0 h-screen w-64 bg-slate-800 shadow-lg p-4 font-sans transform md:translate-x-0 transition-transform duration-300 z-50 ${
//         isOpen ? "translate-x-0" : "-translate-x-full"
//       }`}
//     >
//       {/* Título */}
//       <h2 className="text-xl font-bold text-blue-200 mb-6">Admin Vitalia</h2>
//       {/* Links */}
//       <nav className="space-y-2">
//         {links.map(({ to, label, icon: Icon }) => (
//           <Link
//             key={to}
//             to={to}
//             className={`flex items-center p-2 rounded hover:bg-blue-500 transition-colors duration-200 ${
//               pathname === to
//                 ? "bg-blue-900 font-semibold text-white"
//                 : "text-white"
//             }`}
//           >
//             <Icon className="h-5 w-5 mr-2" />
//             {label}
//           </Link>
//         ))}
//       </nav>
//       {/* Botón Logout */}
//       <button
//         onClick={() => {
//           logout();
//           toggleMenu();
//         }}
//         className="flex items-center p-2 mt-6 w-full rounded bg-blue-700 text-white hover:bg-blue-900 transition-colors duration-200"
//       >
//         <LogOut className="h-5 w-5 mr-2" />
//         Logout
//       </button>
//     </aside>
//   );
// };
// export default Sidebar;




























// // import { Link, useLocation } from "react-router-dom";
// // import { Home, Users, Tag, Package, LogOut, UserCog, UserStar } from "lucide-react";
// // import useAuthStore from "../../store/authStore";

// // const links = [
// //   { to: "/admin/dashboard", label: "Dashboard", icon: Home },
// //   { to: "/admin/roles", label: "Roles", icon: UserCog },
// //   { to: "/admin/administradores", label: "Administradores", icon: UserStar },
// //   { to: "/admin/usuarios", label: "Usuarios", icon: Users },
// //   { to: "/admin/categorias", label: "Categorías", icon: Tag },
// // ];

// // const Sidebar = ({ isOpen, toggleMenu }) => {
// //   const { pathname } = useLocation();
// //   const { logout } = useAuthStore();

// //   return (
// //     <aside
// //       className={`fixed md:static top-0 left-0 h-screen w-64 bg-white shadow-lg p-4 transform transition-transform duration-300 z-50
// //         ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
// //     >
// //       {/* Título */}
// //       <h2 className="text-xl font-bold text-violet-600 mb-6">Admin Vitalia</h2>

// //       {/* Links */}
// //       <nav className="space-y-2">
// //         {links.map(({ to, label, icon: Icon }) => (
// //           <Link
// //             key={to}
// //             to={to}
// //             className={`flex items-center p-2 rounded hover:bg-violet-100 ${
// //               pathname === to ? "bg-violet-200 font-semibold" : ""
// //             }`}
// //             onClick={() => toggleMenu()} // cierra menú al hacer click en móvil
// //           >
// //             <Icon className="h-5 w-5 mr-2" />
// //             {label}
// //           </Link>
// //         ))}
// //       </nav>

// //       {/* Botón Logout */}
// //       <button
// //         onClick={() => {
// //           logout();
// //           toggleMenu();
// //         }}
// //         className="flex items-center p-2 mt-6 w-full rounded bg-violet-600 text-white hover:bg-violet-900"
// //       >
// //         <LogOut className="h-5 w-5 mr-2" />
// //         Logout
// //       </button>
// //     </aside>
// //   );
// // };

// // export default Sidebar;
