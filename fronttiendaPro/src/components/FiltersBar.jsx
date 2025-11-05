import { useState, useEffect } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

// 🔹 función debounce para evitar re-render cada letra
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

function FiltersBar({ onChange, categoriaInicial = "", ordenInicial = "" }) {
  const [categoria, setCategoria] = useState(categoriaInicial);
  const [orden, setOrden] = useState(ordenInicial);
  const [busqueda, setBusqueda] = useState("");
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  // 🔹 sincronizar props iniciales
  useEffect(() => {
    setCategoria(categoriaInicial);
  }, [categoriaInicial]);

  useEffect(() => {
    setOrden(ordenInicial);
  }, [ordenInicial]);

  // 🔹 avisar cambios al padre
  const handleChange = (nuevosFiltros) => {
    const filtrosActualizados = {
      categoria,
      orden,
      busqueda,
      ...nuevosFiltros,
    };
    onChange?.(filtrosActualizados);
  };

  // 🔹 debounce para búsqueda en tiempo real
  const handleBusquedaDebounce = debounce((value) => {
    setBusqueda(value);
    handleChange({ busqueda: value });
  }, 300);

  return (
    <div className="bg-gray-50 px-4 py-6 shadow-lg rounded-md mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Chips opcionales */}
        <div className="flex flex-wrap justify-center sm:justify-start gap-2">
          {["Novedades", "Más Vendidos", "Ofertas", "Envío Gratis"].map(
            (chip) => (
              <button
                key={chip}
                className="text-pink-600 border border-pink-600 px-3 py-1 text-sm rounded-full hover:bg-gray-200 hover:shadow cursor-pointer transition"
              >
                {chip}
              </button>
            )
          )}
        </div>

        {/* Botón toggle (mobile) */}
        <div className="sm:hidden flex justify-center">
          <button
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
            className="mt-2 bg-pink-600 text-white px-4 py-2 rounded-md shadow hover:bg-pink-700 transition"
          >
            {mostrarFiltros ? "Ocultar filtros" : "Mostrar filtros"}
          </button>
        </div>

        {/* Controles */}
        <div
          className={`${
            mostrarFiltros ? "flex" : "hidden"
          } flex-wrap flex-col items-center gap-3 text-sm mt-4 sm:mt-0 sm:flex sm:flex-row sm:justify-end sm:items-center`}
        >
          {/* Select Categoría */}
          <select
            value={categoria}
            onChange={(e) => {
              const nuevaCategoria = e.target.value;
              setCategoria(nuevaCategoria);
              handleChange({ categoria: nuevaCategoria });
            }}
            className="border border-pink-600 text-pink-600 rounded px-3 py-1 focus:outline-none focus:ring-1 focus:ring-pink-400 cursor-default sm:w-auto"
            style={{ width: "224px" }}
          >
            <option value="">Todas las categorías</option>
            <option value="tops">Tops</option>
            <option value="musculosas">Musculosas</option>
            <option value="calzas">Calzas</option>
            <option value="shorts">Shorts</option>
          </select>

          {/* Select Ordenar */}
          <select
            value={orden}
            onChange={(e) => {
              const nuevoOrden = e.target.value;
              setOrden(nuevoOrden);
              handleChange({ orden: nuevoOrden });
            }}
            className="border border-pink-600 text-pink-600 rounded px-3 py-1 focus:outline-none focus:ring-1 focus:ring-pink-400 cursor-default sm:w-auto"
            style={{ width: "224px" }}
          >
            <option value="">Ordenar por...</option>
            <option value="menor_precio">Precio: menor a mayor</option>
            <option value="mayor_precio">Precio: mayor a menor</option>
          </select>

          {/* Buscador */}
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar productos..."
              defaultValue={busqueda}
              onChange={(e) => handleBusquedaDebounce(e.target.value)}
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

