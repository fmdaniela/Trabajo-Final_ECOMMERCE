import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import dashboardService from "../../services/dashboardService";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A569BD"]; // colores para cada sección

const DashboardChart = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await dashboardService.getDashboardStats();

        setChartData([
          { name: "Roles", value: data.roles },
          { name: "Administradores", value: data.administradores },
          { name: "Usuarios", value: data.usuarios },
          { name: "Categorías", value: data.categorias },
          { name: "Productos", value: data.productos },
        ]);
      } catch (error) {
        console.error("Error cargando datos para el gráfico:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#8884d8"
          label
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend verticalAlign="bottom" height={36} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default DashboardChart;

