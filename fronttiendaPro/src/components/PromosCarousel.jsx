// src/components/PromosCarousel.jsx
import React from "react";

const promos = [
  { id: 1, texto: "🚚 Envíos gratis en compras mayores a $25.000" },
  { id: 2, texto: "💳 10% OFF abonando por transferencia" },
  { id: 3, texto: "🛍️ Nueva colección primavera 🍂" },
  { id: 4, texto: "🔁 Cambios y devoluciones sin costo" },
  { id: 5, texto: "⭐ Club Vitalia: sumá puntos en cada compra" },
];

function PromosCarousel() {
  return (
    <div className="overflow-hidden bg-whith-100 text-rose-600 py-3 border-t border-rose-100">
      <div className="flex animate-marquee whitespace-nowrap">
        {promos.concat(promos).map((promo, index) => (
          <span
            key={index}
            className="mx-8 text-sm sm:text-base font-medium tracking-wide"
          >
            {promo.texto}
          </span>
        ))}
      </div>
    </div>
  );
}

export default PromosCarousel;
