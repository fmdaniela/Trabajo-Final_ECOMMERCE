import { Package, Users, Tag } from "lucide-react";

// Datos del dashboard
const stats = [
  {
    label: "Productos",
    value: 120,
    description: "Cantidad de productos en el catálogo",
    icon: Package,
    progress: 70,
  },
  {
    label: "Usuarios",
    value: 45,
    description: "Cantidad de usuarios registrados",
    icon: Users,
    progress: 50,
  },
  {
    label: "Categorías",
    value: 8,
    description: "Cantidad de categorías creadas",
    icon: Tag,
    progress: 30,
  },
];

const Dashboard = () => {
  return (
    <div className="space-y-6 font-sans">
      {/* Título */}
      <h1 className="text-3xl font-bold text-slate-800">
        Bienvenido al Panel de Administración
      </h1>
      <h2 className="text-blue-700">‼💥 Sección simulada</h2>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map(({ label, value, description, icon: Icon, progress }) => (
          <div
            key={label}
            className="bg-white shadow rounded-lg p-6 border border-slate-200"
          >
            <div className="flex items-center mb-4">
              <Icon className="h-6 w-6 text-blue-600 mr-2" />
              <span className="text-lg font-semibold text-slate-800">
                {label}
              </span>
            </div>
            <div className="text-2xl font-bold text-blue-700 mb-1">{value}</div>
            <div className="text-sm text-slate-500 mb-3">{description}</div>
            <div className="w-full bg-blue-100 rounded-full h-2">
              <div
                className="h-2 rounded-full bg-blue-600"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;





























// import { Package, Users, Tag } from "lucide-react";
// //armar dashboard
// const stats = [
//   { label: "Productos", value: 120, description: "Cantidad de productos en el catálogo", icon: Package, progress: 70 },
//   { label: "Usuarios", value: 45, description: "Cantidad de usuarios registrados", icon: Users, progress: 50 },
//   { label: "Categorías", value: 8, description: "Cantidad de categorías creadas", icon: Tag, progress: 30 },
// ];
// const Dashboard = () => {
//   return (
//     <div className="space-y-6 font-sans bg-slate-800 min-h-screen p-6 text-white">
//       <h1 className="text-3xl font-bold text-blue-200">Bienvenido al Panel de Administración</h1>
//       <h2 className="text-blue-100">‼💥Sección simulada</h2>
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {stats.map(({ label, value, description, icon: Icon, progress }) => (
//           <div key={label} className="bg-slate-700 shadow rounded-lg p-6">
//             <div className="flex items-center mb-4">
//               <Icon className="h-6 w-6 text-blue-400 mr-2" />
//               <span className="text-lg font-semibold text-blue-100">{label}</span>
//             </div>
//             <div className="text-2xl font-bold text-blue-200 mb-1">{value}</div>
//             <div className="text-sm text-blue-300 mb-3">{description}</div>
//             <div className="w-full bg-blue-700 rounded-full h-2">
//               <div
//                 className="h-2 rounded-full bg-blue-300"
//                 style={{ width: `${progress}%` }}
//               ></div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };
// export default Dashboard;


























// // // import { Package, Users, Tag } from "lucide-react";

// // // //armar dashboard
// // // const stats = [
// // //   { label: "Productos", value: 120, description: "Cantidad de productos en el catálogo", icon: Package, progress: 70 },
// // //   { label: "Usuarios", value: 45, description: "Cantidad de usuarios registrados", icon: Users, progress: 50 },
// // //   { label: "Categorías", value: 8, description: "Cantidad de categorías creadas", icon: Tag, progress: 30 },
// // // ];

// // // const Dashboard = () => {
// // //   return (
// // //     <div className="space-y-6 font-sans">
// // //       <h1 className="text-3xl font-bold text-violet-700">Bienvenido al Panel de Administración</h1>
// // //       <h2>‼💥Sección simulada </h2>

// // //       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
// // //         {stats.map(({ label, value, description, icon: Icon, progress }) => (
// // //           <div key={label} className="bg-white shadow rounded-lg p-6">
// // //             <div className="flex items-center mb-4">
// // //               <Icon className="h-6 w-6 text-violet-600 mr-2" />
// // //               <span className="text-lg font-semibold">{label}</span>
// // //             </div>
// // //             <div className="text-2xl font-bold text-violet-700 mb-1">{value}</div>
// // //             <div className="text-sm text-gray-500 mb-3">{description}</div>
// // //             <div className="w-full bg-gray-200 rounded-full h-2">
// // //               <div
// // //                 className="h-2 rounded-full bg-violet-600"
// // //                 style={{ width: `${progress}%` }}
// // //               ></div>
// // //             </div>
// // //           </div>
// // //         ))}
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default Dashboard;

