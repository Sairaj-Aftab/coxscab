"use client";
import Image from "next/image";
import img1 from "@/public/images/bg_1.jpeg";
import img2 from "@/public/images/bg_2.jpg";
import img3 from "@/public/images/bg_3.jpeg";
import img4 from "@/public/images/bg_4.jpg";
import img5 from "@/public/images/bg_5.jpeg";
import img6 from "@/public/images/bg_6.jpeg";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css/pagination";
import "@/app/styles/components/main-slider.css";

const MainSlider = () => {
  // console.log(images);
  return (
    <div className="slider">
      <div className="coulmn">
        <h1>Travel with Confidence: Ultimate Comfort and Security Await</h1>
      </div>
      <Swiper
        pagination={{ clickable: true }}
        spaceBetween={0}
        loop={true}
        autoplay={{ delay: 3000 }}
        modules={[Autoplay]}
      >
        <SwiperSlide>
          <div className="main-slide">
            <Image src={img6} alt="Slider" height={0} width={0} sizes="100vw" />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="main-slide">
            <Image src={img1} alt="Slider" height={0} width={0} sizes="100vw" />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="main-slide">
            <Image src={img2} alt="Slider" height={0} width={0} sizes="100vw" />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="main-slide">
            <Image src={img3} alt="Slider" height={0} width={0} sizes="100vw" />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="main-slide">
            <Image src={img4} alt="Slider" height={0} width={0} sizes="100vw" />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="main-slide">
            <Image src={img5} alt="Slider" height={0} width={0} sizes="100vw" />
          </div>
        </SwiperSlide>
      </Swiper>
      <div className="coulmn">
        <h1>"Smart Bangladesh Award" Winner Innovation</h1>
      </div>
    </div>
  );
};

export default MainSlider;
