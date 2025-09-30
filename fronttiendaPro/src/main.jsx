import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AuthProvider from './context/AuthProvider.jsx'
import { CarritoProvider } from './context/CarritoContext.jsx'  // <--- Importar

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <CarritoProvider>
      <StrictMode>
        <App />
      </StrictMode>
    </CarritoProvider>
  </AuthProvider>
)
