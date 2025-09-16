import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import { useState } from "react";
import Sidebar from "../components/Sidebar";

export default function AdminLayout() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className="flex min-h-screen bg-slate-100 font-sans">
      {/* Sidebar */}
      <Sidebar isOpen={isOpen} toggleMenu={toggleMenu} />

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col">
        {/* Navbar solo para móvil */}
        <div className="md:hidden bg-slate-800 text-white shadow p-4 flex justify-between items-center">
          <h1 className="text-lg font-bold text-blue-200">Admin Vitalia</h1>
          <button onClick={toggleMenu}>
            <Menu className="h-6 w-6 text-blue-200" />
          </button>
        </div>

        {/* Contenido dinámico */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

















// import { Outlet } from "react-router-dom";
// import { Menu } from "lucide-react";
// import { useState } from "react";
// import Sidebar from "../components/Sidebar";
// export default function AdminLayout() {
//   const [isOpen, setIsOpen] = useState(false);
//   const toggleMenu = () => setIsOpen(!isOpen);
//   return (
//     <div className="flex min-h-screen bg-gray-200 font-sans">
//       {/* Sidebar */}
//       <Sidebar isOpen={isOpen} toggleMenu={toggleMenu} />
//       {/* Contenido principal */}
//       <div className="flex-1">
//         {/* Navbar solo para móvil */}
//         <div className="md:hidden bg-white shadow p-4 flex justify-between items-center">
//           <h1 className="text-lg font-bold text-violet-600">Admin Panel</h1>
//           <button onClick={toggleMenu}>
//             <Menu className="h-6 w-6 text-violet-600" />
//           </button>
//         </div>
//         {/* Contenido dinámico */}
//         <main className="flex-1 p-6">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// }   