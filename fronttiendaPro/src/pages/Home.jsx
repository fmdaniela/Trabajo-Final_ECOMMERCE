import BannerCarousel from '../components/BannerCarousel'
import DestacadosCarousel from '../components/DestacadosCarousel'
import HeroBlock from '../components/HeroBlock'
import InfoTienda from "../components/InfoTienda";
import PromosCarousel from "../components/PromosCarousel";
import ListadoCategorias from './ListadoCategorias';

function Home() {

   
  return (
    <div>
       <BannerCarousel />
       <PromosCarousel />
       <DestacadosCarousel />   
       <ListadoCategorias />
       <HeroBlock />
       <InfoTienda />
   
    </div>
  )
}

export default Home