import { BrowserRouter, Route, Routes } from "react-router-dom"
import Header from "./components/Header"
import Footer from "./components/Footer"
import CuponProvider from "./context/CuponProvider.jsx"

import Home from "./pages/Home"
import ListadoProductos from "./pages/ListadoProductos"
import ProductoDetalle from "./pages/ProductoDetalle"
import Bienestar from "./pages/Bienestar"
import SobreNosotras from "./pages/SobreNosotras"
import Contacto from "./pages/Contacto"
import ListadoCategorias from "./pages/ListadoCategorias"
import DetalleCategoria from "./pages/DetalleCategoria"
import Register from "./pages/Register"
import Login from "./pages/Login.jsx"
import PrivateRoute from "./components/PrivateRoute";
import Perfil from "./pages/Perfil";





function App() {
  
  return (
    <CuponProvider>
    <BrowserRouter>
      <Header />
      <main className="pt-[64px]"> {/* espacio para que no quede tapado por el header fijo */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/productos" element={<ListadoProductos />} />
        <Route path="/producto/:id" element={<ProductoDetalle />} />
        <Route path="/categorias" element={<ListadoCategorias />} />
        <Route path="/categoria/:id" element={<DetalleCategoria />} />
        <Route path="/bienestar" element={<Bienestar />} />
        <Route path="/sobrenosotras" element={<SobreNosotras />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
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
    </CuponProvider>
    
  )
}

export default App

