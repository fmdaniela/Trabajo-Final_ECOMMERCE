import { Truck, ShieldCheck, CreditCard, RefreshCw } from "lucide-react";

const InfoTienda = () => {
  const items = [
    {
      icon: <RefreshCw className="w-8 h-8 text-pink-600 mb-2" />,
      titulo: "CAMBIOS Y DEVOLUCIONES",
      texto:
        "¿No te quedó o no te gustó? El primer cambio o devolución es gratis y lo pasamos a buscar.",
    },
    {
      icon: <Truck className="w-8 h-8 text-pink-600 mb-2" />,
      titulo: "ENVÍOS RÁPIDOS",
      texto:
        "Según tu zona, el envío llega entre 2 y 3 días hábiles dependiendo del método que elijas.",
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-pink-600 mb-2" />,
      titulo: "100% SEGURO",
      texto:
        "Tu información de pago está cifrada por nuestros partners MercadoPago y Mobbex.",
    },
    {
      icon: <CreditCard className="w-8 h-8 text-pink-600 mb-2" />,
      titulo: "3 CUOTAS SIN INTERÉS",
      texto:
        "Con Visa, MasterCard, Banco Provincia, BBVA y más a través de MercadoPago y Mobbex.",
    },
  ];

  return (
    <div className="bg-gray-50 py-10 border-t border-pink-100">
      <div className="max-w-screen-xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
        {items.map((item, index) => (
          <div key={index} className="flex flex-col items-center">
            {item.icon}
            <h3 className="text-gray-800 font-semibold text-base mb-1">
              {item.titulo}
            </h3>
            <p className="text-gray-600 text-sm max-w-[240px]">
              {item.texto}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfoTienda;
