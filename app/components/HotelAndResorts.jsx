"use client";
import Image from "next/image";
import img1 from "@/public/images/hotel_1.jpg";
import img2 from "@/public/images/hotel_2.jpg";
import img3 from "@/public/images/hotel_3.jpg";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "@/app/styles/components/hotel-resorts.css";
import SliderCard from "./card/SliderCard";
import hotelResorts from "@/data/hotelResorts";
const HotelAndResorts = () => {
  return (
    <div className="hotel-resorts">
      <div className="container">
        <div className="wrap">
          {hotelResorts?.map((data, index) => (
            <SliderCard
              key={index}
              img={data.images}
              name={data.name}
              fb={data.fb}
              web={data.web}
              location={data.location}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HotelAndResorts;
