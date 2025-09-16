import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

function BannerCarousel() {
  const images = [
    'https://images.pexels.com/photos/3823039/pexels-photo-3823039.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1600&q=80',
  ];

  const texts = [
    'Nueva colección de otoño',
    'Vitalia, tu look, tu decisión',
    'Envíos gratis + 3 cuotas sin interés',
  ];


  return (
    <div className="w-full overflow-hidden relative shadow-lg h-[220px] sm:h-[280px] md:h-[320px] lg:h-[360px]">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop={true}
        slidesPerView={1}
        className="h-full"
      >
        {images.map((src, index) => (
          <SwiperSlide key={index}>
            <div className="relative h-full">
              <img
                src={src}
                alt={`Banner ${index + 1}`}
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 grid place-items-center px-4">
                <h2 className="text-white text-lg sm:text-2xl md:text-4xl lg:text-5xl font-semibold text-center drop-shadow-[2px_2px_6px_rgba(0,0,0,0.9)]">
                  {texts[index]}
                </h2>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default BannerCarousel