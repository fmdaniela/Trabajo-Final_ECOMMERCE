import { useContext } from "react";
import AuthContext from "../context/AuthContext";

const useAuth = () => {
  return useContext(AuthContext);
};

export default useAuth;

//Hook personalizado para consumir el contexto.
//  .
//para importarlo a cualquier componente: import useAuth from '../hooks/useAuth';