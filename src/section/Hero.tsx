'use client';

import React, { useEffect } from 'react';
import { heroSlides } from '@/data/data';
import './hero.css';

// Import AOS
import AOS from 'aos';
import 'aos/dist/aos.css';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// Import required Swiper modules
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import HeroSlide from '@/app/components/HeroSlide';

export default function Hero() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false,
    });
  }, []);

  return (
    <section className="hero-slider">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <Swiper
              slidesPerView={1}
              speed={1000}
              effect={'fade'}
              fadeEffect={{
                crossFade: true
              }}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
              pagination={{
                el: '.swiper-pagination',
                type: 'bullets',
                clickable: true,
              }}
              navigation={{
                nextEl: '.custom-swiper-button-next',
                prevEl: '.custom-swiper-button-prev',
              }}
              modules={[Autoplay, Pagination, Navigation]}
              loop={true}
              className="slideFeaturedPosts"
            >
              {heroSlides.map((slide, index) => (
                <SwiperSlide key={slide.id || index}>
                  {/* Include customized hero slide template */}
                  <HeroSlide slide={slide} />
                </SwiperSlide>
              ))}

              {/* Custom Navigation Buttons */}
              <div className="custom-swiper-button-next">
                <span className="bi-chevron-right"></span>
              </div>
              <div className="custom-swiper-button-prev">
                <span className="bi-chevron-left"></span>
              </div>

              <div className="swiper-pagination"></div>
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
}
