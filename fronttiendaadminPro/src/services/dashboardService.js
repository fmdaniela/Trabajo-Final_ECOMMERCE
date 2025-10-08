import api from "./api"; // tu instancia Axios


const dashboardService = {
  
  getDashboardStats: async () => {
  const res = await api.get("/admin/dashboard"); // Endpoint que devuelve: { productos, usuarios, categorias, administradores }
  return res.data;
},

}

export default dashboardService;

