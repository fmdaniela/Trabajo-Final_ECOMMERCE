import BannerCarousel from '../components/BannerCarousel'
import FiltersBar from '../components/FiltersBar'
import ProductList from '../components/ProductList'
import HeroBlock from '../components/HeroBlock'

function Home() {
  return (
    <div>
       <BannerCarousel />
       <FiltersBar />
       <ProductList />
       <HeroBlock />
       
    </div>
  )
}

export default Home