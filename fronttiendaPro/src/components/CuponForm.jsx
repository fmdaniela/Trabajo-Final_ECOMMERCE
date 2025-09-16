import { useState } from "react";
import useCupon from "../hooks/useCupon";
import cuponDescuentoService from "../services/cuponDescuentoService";

const CuponForm = () => {
  const { cuponActivo, aplicarCupon, quitarCupon } = useCupon();
  const [codigo, setCodigo] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleAplicar = async () => {
    if (!codigo.trim()) {
      setMensaje("Por favor, ingresá un código de cupón.");
      quitarCupon();
      return;
    }

    try {
      const data = await cuponDescuentoService.validarCuponPorCodigo(codigo.trim());

      if (data) {
        aplicarCupon(data);
        setMensaje(`Cupón "${data.nombreCupon}" (${data.porcentajeDescuento}%) aplicado.`);
      } 
    } catch (err) {
      console.error("Error al aplicar cupón:", err);
      quitarCupon();
      setMensaje("El cupón ingresado no es válido o ha expirado.");
    }
  };

  const handleQuitar = () => {
    quitarCupon();
    setMensaje(""); // Limpiamos el mensaje
    setCodigo("");  // Limpiamos el input
  };

  return (
    <div className="mb-6 text-center">
      <h2 className="text-xl font-semibold mb-2">¿Tenés un cupón?</h2>
      <div className="flex justify-center gap-2">
        <input
          type="text"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          placeholder="Código de cupón"
          className="border px-3 py-1 rounded"
        />
        <button
          onClick={handleAplicar}
          className="bg-[#E91E63] hover:bg-[#d81b60] text-white px-3 py-1 rounded cursor-pointer"
        >
          Aplicar
        </button>
        {(cuponActivo || mensaje) && (
          <button
            onClick={handleQuitar}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Quitar
          </button>
        )}
      </div>
      {mensaje && <p className="mt-2 text-sm text-gray-700">{mensaje}</p>}
    </div>
  );
};

export default CuponForm;

/*
↓  ← El usuario escribe el código del cupón
↓  → Llama al backend para validar el cupón
↓  → Si es válido: aplicarCupon(data)
↓  → Si no: quitarCupon()
*/
