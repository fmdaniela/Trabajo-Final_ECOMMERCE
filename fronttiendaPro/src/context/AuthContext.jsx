import { createContext, useContext } from "react";

const AuthContext = createContext(null);

// Hook para usar el contexto más fácilmente
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export default AuthContext;


//Esto es lo que define el contexto y lo exporta. Nada más.
//Solo crea y exporta el contexto.