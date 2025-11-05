import { BrowserRouter, Route, Routes } from "react-router-dom"
import Header from "./components/Header"
import Footer from "./components/Footer"
import CuponProvider from "./context/CuponProvider.jsx"
import { GoogleOAuthProvider } from '@react-oauth/google';
import Carrito from "./pages/Carrito";
import AvisoCarrito from "./components/ui/AvisoCarrito";

import Home from "./pages/Home"
import ListadoProductos from "./pages/ListadoProductos"
import ProductoDetalle from "./pages/ProductoDetalle"
// import Bienestar from "./pages/Bienestar"
import SobreNosotras from "./pages/SobreNosotras"
import Contacto from "./pages/Contacto"
import ListadoCategorias from "./pages/ListadoCategorias"


import Register from "./pages/Register"
import Login from "./pages/Login.jsx"
import PrivateRoute from "./components/PrivateRoute";
import Perfil from "./pages/Perfil";

// 💬 Importá el chatbot
import ChatBot from "./components/chat/ChatBot";

import { Toaster } from "react-hot-toast";




function App() {
  
  return (
    <GoogleOAuthProvider clientId="794673668825-j6nl7hrls1elnbtvsma7jt3368tmvejg.apps.googleusercontent.com">
    <CuponProvider>
    <Toaster position="top-right" reverseOrder={false} />   
     <AvisoCarrito /> {/* <-- acá se muestra el aviso */}
    <BrowserRouter>
      <Header />
      <main className="pt-[64px]"> {/* espacio para que no quede tapado por el header fijo */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/productos" element={<ListadoProductos />} />
        <Route path="/producto/:id" element={<ProductoDetalle />} />
        <Route path="/categorias" element={<ListadoCategorias />} />
        {/* <Route path="/bienestar" element={<Bienestar />} /> */}
        <Route path="/sobrenosotras" element={<SobreNosotras />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/perfil" element= {
          <PrivateRoute>
            <Perfil />
          </PrivateRoute>  
        }  
      />
           
       
      </Routes>
      </main>
      <Footer />  
    </BrowserRouter>

      {/* ChatBot flotante (fuera del router para que esté en todas las páginas) */}
      <ChatBot />
    </CuponProvider>
    </GoogleOAuthProvider>
        
  )
}

export default App

