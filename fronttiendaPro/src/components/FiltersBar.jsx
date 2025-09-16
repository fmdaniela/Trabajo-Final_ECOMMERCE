import { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

function FiltersBar() {
  const [categoria, setCategoria] = useState("");
  const [orden, setOrden] = useState("destacado");
  const [mostrarFiltros, setMostrarFiltros] = useState(false); // solo para mobile

  const chips = ["Novedades", "Más Vendidos", "Ofertas", "Envío Gratis"];

  return (
    <div className="bg-gray-50 px-4 py-6 shadow-lg rounded-md mb-6 ">
      {/* Contenedor general */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        
        {/* Chips */}
        <div className="flex flex-wrap justify-center sm:justify-start gap-2">
          {chips.map((chip) => (
            <button
              key={chip}
              className="text-pink-600 border border-pink-600 px-3 py-1 text-sm rounded-full hover:bg-gray-200 hover:shadow cursor-pointer transition"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Botón toggle en pantallas chicas */}
        <div className="sm:hidden flex justify-center">
          <button
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
            className="mt-2 bg-pink-600 text-white px-4 py-2 rounded-md shadow hover:bg-pink-700 transition"
          >
            {mostrarFiltros ? "Ocultar filtros" : "Mostrar filtros"}
          </button>
        </div>

        {/* Filtros: visibles en sm+, o toggle en xs */}
        <div
          className={`${
            mostrarFiltros ? "flex" : "hidden"
          } flex-wrap flex-col items-center gap-3 text-sm mt-4 sm:mt-0 sm:flex sm:flex-row sm:justify-end sm:items-center`}
        >
          {/* Select Categoría */}
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="border border-pink-600 text-pink-600 rounded px-3 py-1 focus:outline-none focus:ring-1 focus:ring-pink-400 cursor-default sm:w-auto"
            style={{ width: "224px" }}
          >
            <option value="">Categoría</option>
            <option value="">Todas las categorías</option>
            <option value="remeras y musculosas">Remeras y Musculosas</option>
            <option value="calzas">Calzas</option>
            <option value="bikers">Bikers</option>
            <option value="tops">Tops</option>
            <option value="conjuntos">Conjuntos</option>
          </select>

          {/* Select Ordenar */}
          <select
            value={orden}
            onChange={(e) => setOrden(e.target.value)}
            className="border border-pink-600 text-pink-600 rounded px-3 py-1 focus:outline-none focus:ring-1 focus:ring-pink-400 cursor-default sm:w-auto"
            style={{ width: "224px" }}
          >
            <option value="destacado">Destacado</option>
            <option value="menor_precio">Precio: menor a mayor</option>
            <option value="mayor_precio">Precio: mayor a menor</option>
          </select>

          {/* Buscador */}
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar productos..."
              className="border border-pink-600 text-pink-600 rounded pl-9 pr-3 py-1 focus:outline-none focus:ring-1 focus:ring-pink-400 placeholder:text-pink-400 text-sm cursor-default"
              style={{ width: "224px" }}
            />
            <MagnifyingGlassIcon className="w-5 h-5 text-pink-600 absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default FiltersBar;
