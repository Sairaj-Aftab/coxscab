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
                <h1>
                  "Smart Bangladesh Award" <br /> Winner Innovation
                </h1>
                {/* <p>
                  Far far away, behind the word mountains, far from the
                  countries Vokalia and Consonantia, there live the blind texts.
                </p>
                <div className="flex gap-3 lg:items-center flex-col lg:flex-row sm:pr-5 lg:pr-0">
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
              {/* <div className="content">
                <h1>Dentist Services that You Can Trust</h1>
                <p>
                  Far far away, behind the word mountains, far from the
                  countries Vokalia and Consonantia, there live the blind texts.
                </p>
                <div className="flex gap-3 lg:items-center flex-col lg:flex-row sm:pr-5 lg:pr-0">
                  <button className="px-6 py-4 rounded-md font-bold text-base shadow-md bg-primary-color text-text-color-white hover:shadow-none">
                    SEE OUR SERVICES &#8594;
                  </button>
                  <button className="px-6 py-4 rounded-md font-bold text-base shadow-md bg-white text-primary-color hover:shadow-none">
                    VIEW COURSE &#8594;
                  </button>
                </div>
              </div> */}
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="main-slide">
            <Image src={img3} alt="Slider" height={0} width={0} sizes="100vw" />
            <div className="inner-slide container">
              {/* <div className="content">
                <h1>Dentist Services that You Can Trust</h1>
                <p>
                  Far far away, behind the word mountains, far from the
                  countries Vokalia and Consonantia, there live the blind texts.
                </p>
                <div className="flex gap-3 lg:items-center flex-col lg:flex-row sm:pr-5 lg:pr-0">
                  <button className="px-6 py-4 rounded-md font-bold text-base shadow-md bg-primary-color text-text-color-white hover:shadow-none">
                    SEE OUR SERVICES &#8594;
                  </button>
                  <button className="px-6 py-4 rounded-md font-bold text-base shadow-md bg-white text-primary-color hover:shadow-none">
                    VIEW COURSE &#8594;
                  </button>
                </div>
              </div> */}
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="main-slide">
            <Image src={img4} alt="Slider" height={0} width={0} sizes="100vw" />
            <div className="inner-slide container">
              {/* <div className="content">
                <h1>Dentist Services that You Can Trust</h1>
                <p>
                  Far far away, behind the word mountains, far from the
                  countries Vokalia and Consonantia, there live the blind texts.
                </p>
                <div className="flex gap-3 lg:items-center flex-col lg:flex-row sm:pr-5 lg:pr-0">
                  <button className="px-6 py-4 rounded-md font-bold text-base shadow-md bg-primary-color text-text-color-white hover:shadow-none">
                    SEE OUR SERVICES &#8594;
                  </button>
                  <button className="px-6 py-4 rounded-md font-bold text-base shadow-md bg-white text-primary-color hover:shadow-none">
                    VIEW COURSE &#8594;
                  </button>
                </div>
              </div> */}
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="main-slide">
            <Image src={img5} alt="Slider" height={0} width={0} sizes="100vw" />
            <div className="inner-slide container">
              {/* <div className="content">
                <h1>Dentist Services that You Can Trust</h1>
                <p>
                  Far far away, behind the word mountains, far from the
                  countries Vokalia and Consonantia, there live the blind texts.
                </p>
                <div className="flex gap-3 lg:items-center flex-col lg:flex-row sm:pr-5 lg:pr-0">
                  <button className="px-6 py-4 rounded-md font-bold text-base shadow-md bg-primary-color text-text-color-white hover:shadow-none">
                    SEE OUR SERVICES &#8594;
                  </button>
                  <button className="px-6 py-4 rounded-md font-bold text-base shadow-md bg-white text-primary-color hover:shadow-none">
                    VIEW COURSE &#8594;
                  </button>
                </div>
              </div> */}
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="main-slide">
            <Image src={img6} alt="Slider" height={0} width={0} sizes="100vw" />
            <div className="inner-slide container">
              {/* <div className="content">
                <h1>Dentist Services that You Can Trust</h1>
                <p>
                  Far far away, behind the word mountains, far from the
                  countries Vokalia and Consonantia, there live the blind texts.
                </p>
                <div className="flex gap-3 lg:items-center flex-col lg:flex-row sm:pr-5 lg:pr-0">
                  <button className="px-6 py-4 rounded-md font-bold text-base shadow-md bg-primary-color text-text-color-white hover:shadow-none">
                    SEE OUR SERVICES &#8594;
                  </button>
                  <button className="px-6 py-4 rounded-md font-bold text-base shadow-md bg-white text-primary-color hover:shadow-none">
                    VIEW COURSE &#8594;
                  </button>
                </div>
              </div> */}
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default MainSlider;
