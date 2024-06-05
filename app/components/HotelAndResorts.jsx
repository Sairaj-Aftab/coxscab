"use client";
import Image from "next/image";
import img1 from "@/public/images/bg_1.jpeg";
import img2 from "@/public/images/bg_2.jpg";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css/pagination";
import "@/app/styles/components/hotel-resorts.css";
const HotelAndResorts = () => {
  return (
    <div className="hotel-resorts">
      <div className="container">
        <div className="wrap">
          <div className="card">
            <Swiper
              pagination={{ clickable: true }}
              spaceBetween={0}
              loop={true}
              autoplay={{ delay: 3000 }}
              modules={[Autoplay, Pagination]}
            >
              <SwiperSlide>
                <Image src={img1} alt="image" sizes="100vw" />
              </SwiperSlide>
              <SwiperSlide>
                <Image src={img2} alt="image" sizes="100vw" />
              </SwiperSlide>
            </Swiper>
            <div className="card-bottom">
              <h3>Sea Pearl Beach Resort & Spa</h3>
              <div className="button-group">
                <button>Website</button>
                <button>Location</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelAndResorts;
