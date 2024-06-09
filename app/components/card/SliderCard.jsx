"use client";
import { useState } from "react";
import Image from "next/image";
import facebookIcon from "@/public/icon/facebook.png";
import mapsIcon from "@/public/icon/maps.png";
import worldIcon from "@/public/icon/world-wide-web.png";
import img4 from "@/public/images/hotel_4.jpg";
import img5 from "@/public/images/hotel_5.jpg";
import img6 from "@/public/images/hotel_6.jpg";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css/pagination";
import "swiper/css/navigation";
import ModalShowSlider from "./ModalShowSlider";

const SliderCard = ({ img, name, fb, web, location }) => {
  const [modalShow, setModalShow] = useState(false);
  const imageLoader = ({ src, width, quality }) => {
    return `${src}?w=${width}&q=${quality || 75}`;
  };

  const handleImageShow = () => {
    setModalShow(true);
  };
  return (
    <>
      {modalShow && <ModalShowSlider setModalShow={setModalShow} img={img} />}
      <div className="card">
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
                onClick={handleImageShow}
                loader={imageLoader}
                src={data}
                alt="image"
                width={200}
                height={200}
                sizes="100vw"
              />
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="card-bottom">
          <h3>{name}</h3>
          <div className="button-group">
            <a href={`${fb}`} target="_blank">
              {/* <i className="fi fi-brands-facebook"></i> */}
              <Image src={facebookIcon} alt="image" sizes="100vw" />
            </a>
            <a href={`${web}`} target="_blank">
              {/* <i className="fi fi-ts-site"></i> */}
              <Image src={worldIcon} alt="image" sizes="100vw" />
            </a>
            <a href={location} target="_blank">
              {/* <i className="fi fi-ts-land-layer-location"></i> */}
              <Image src={mapsIcon} alt="image" sizes="100vw" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default SliderCard;
