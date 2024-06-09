"use client";
import Image from "next/image";
import img1 from "@/public/images/hotel_1.jpg";
import img2 from "@/public/images/hotel_2.jpg";
import img3 from "@/public/images/hotel_3.jpg";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "@/app/styles/components/modal-show-slider.css";
const ModalShowSlider = ({ setModalShow, img }) => {
  return (
    <div className="modal-slider">
      <i className="fi fi-br-cross" onClick={() => setModalShow(false)}></i>
      <Swiper
        slidesPerView={1}
        navigation={true}
        // pagination={{ clickable: true }}
        spaceBetween={0}
        loop={true}
        // autoplay={{ delay: 3000 }}
        modules={[Autoplay, Pagination, Navigation]}
      >
        {img?.map((data, index) => (
          <SwiperSlide key={index}>
            <Image
              src={data}
              alt="image"
              width={200}
              height={200}
              sizes="100vw"
            />
          </SwiperSlide>
        ))}
        {/* {img?.map((data, index) => (
        ))} */}
      </Swiper>
    </div>
  );
};

export default ModalShowSlider;
