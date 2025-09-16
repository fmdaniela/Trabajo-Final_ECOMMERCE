import React, { useState } from 'react';
import CuponContext from './CuponContext';

function CuponProvider({ children }) {
  const [cuponActivo, setCuponActivo] = useState(null);

  const aplicarCupon = (cupon) => {
    setCuponActivo(cupon);
  };

  const quitarCupon = () => {
    setCuponActivo(null);
  };

  return (
    <CuponContext.Provider value={{ cuponActivo, aplicarCupon, quitarCupon }}>
      {children}
    </CuponContext.Provider>
  );
};

export default CuponProvider;

//Esto es el Provider que gestiona el estado y lo expone a toda la app. Define el provider y la lógica de estado
//CuponProvider define el estado global y funciones: aplicarCupon(), quitarCupon()