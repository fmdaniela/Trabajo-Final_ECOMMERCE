import { useContext } from 'react';
import CuponContext from '../context/CuponContext';

const useCupon = () => useContext(CuponContext);

export default useCupon;

//Esto es el custom hook para acceder fácilmente al contexto en los componentes.
//para importarlo a cualquier componente: import useCupon from '../hooks/useCupon';

/*
↓  ← Hook personalizado que accede al CuponContext
↓  → Devuelve: { cuponActivo, aplicarCupon, quitarCupon }
*/