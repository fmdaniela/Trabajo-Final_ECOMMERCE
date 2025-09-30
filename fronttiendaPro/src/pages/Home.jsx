import BannerCarousel from '../components/BannerCarousel'
import FiltersBar from '../components/FiltersBar'
import ProductList from '../components/ProductList'
import HeroBlock from '../components/HeroBlock'

import { useCarrito } from '../context/CarritoContext';


function Home() {
   const { agregarProducto } = useCarrito();

  return (
    <div>
       <BannerCarousel />
       <FiltersBar />
       <ProductList />
       <HeroBlock />
       
       {/* Botón de prueba para agregar productos mock */}
      <div className="p-4">
        <button
          onClick={() =>
            agregarProducto({ id: 1, nombre: 'Producto Test', cantidad: 1 })
          }
          className="bg-pink-600 text-white px-4 py-2 rounded"
        >
          Agregar Producto Test
        </button>
        <button
          onClick={() =>
            agregarProducto({ id: 2, nombre: 'Otro Producto', cantidad: 2 })
          }
          className="bg-pink-800 text-white px-4 py-2 rounded ml-2"
        >
          Agregar Otro Producto
        </button>
      </div>

       
    </div>
  )
}

export default Home