"use client";
import Image from "next/image";
import img1 from "@/public/images/bg_1.jpeg";
import img2 from "@/public/images/bg_2.jpg";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css/pagination";
import "@/app/styles/components/main-slider.css";

const MainSlider = () => {
  return (
    <div>
      <Swiper
        pagination={{ clickable: true }}
        spaceBetween={0}
        loop={true}
        autoplay={{ delay: 3000 }}
        modules={[Autoplay, Pagination]}
      >
        <SwiperSlide>
          <div className="main-slide">
            <Image src={img1} alt="Slider" height={0} width={0} sizes="100vw" />
            <div className="inner-slide container">
              <div className="content">
                <h1>Dentist Services that You Can Trust</h1>
                <p>
                  Far far away, behind the word mountains, far from the
                  countries Vokalia and Consonantia, there live the blind texts.
                </p>
                {/* <div className="flex gap-3 lg:items-center flex-col lg:flex-row sm:pr-5 lg:pr-0">
                  <button className="px-6 py-4 rounded-md font-bold text-base shadow-md bg-primary-color text-text-color-white hover:shadow-none">
                    SEE OUR SERVICES &#8594;
                  </button>
                  <button className="px-6 py-4 rounded-md font-bold text-base shadow-md bg-white text-primary-color hover:shadow-none">
                    VIEW COURSE &#8594;
                  </button>
                </div> */}
              </div>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="main-slide">
            <Image src={img2} alt="Slider" height={0} width={0} sizes="100vw" />
            <div className="inner-slide container">
              <div className="content">
                <h1>Dentist Services that You Can Trust</h1>
                <p>
                  Far far away, behind the word mountains, far from the
                  countries Vokalia and Consonantia, there live the blind texts.
                </p>
                {/* <div className="flex gap-3 lg:items-center flex-col lg:flex-row sm:pr-5 lg:pr-0">
                  <button className="px-6 py-4 rounded-md font-bold text-base shadow-md bg-primary-color text-text-color-white hover:shadow-none">
                    SEE OUR SERVICES &#8594;
                  </button>
                  <button className="px-6 py-4 rounded-md font-bold text-base shadow-md bg-white text-primary-color hover:shadow-none">
                    VIEW COURSE &#8594;
                  </button>
                </div> */}
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
      {/* <div className="relative w-full h-[80vh] sm:h-screen after:absolute after:top-0 after:bottom-0 after:left-0 after:w-full sm:after:w-1/2 after:bg-black after:bg-opacity-10">
    <Image
      className="w-full h-full object-cover object-center"
      src={img1}
      alt="Slider"
      height={0}
      width={0}
      sizes="100vw"
    />
    <div className="lg:container p-5 lg:p-0 flex justify-center flex-col sm:flex-row sm:items-center absolute inset-x-0 top-0 bottom-0 z-10">
      <div className="sm:flex-1">
        <h1 className="text-6xl text-text-color-white font-normal mb-5">
          Dentist Services that You Can Trust
        </h1>
        <p className="text-base text-text-color-white font-normal mb-5">
          Far far away, behind the word mountains, far from the countries
          Vokalia and Consonantia, there live the blind texts.
        </p>
        <div className="flex gap-3 lg:items-center flex-col lg:flex-row sm:pr-5 lg:pr-0">
          <button className="px-6 py-4 rounded-md font-bold text-base shadow-md bg-primary-color text-text-color-white hover:shadow-none">
            SEE OUR SERVICES &#8594;
          </button>
          <button className="px-6 py-4 rounded-md font-bold text-base shadow-md bg-white text-primary-color hover:shadow-none">
            VIEW COURSE &#8594;
          </button>
        </div>
      </div>
      <div className="sm:flex-1 hidden sm:block"></div>
    </div>
  </div> */}
    </div>
  );
};

export default MainSlider;
