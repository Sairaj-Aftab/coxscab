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
const HotelAndResorts = () => {
  return (
    <div className="hotel-resorts">
      <div className="container">
        <div className="wrap">
          <div className="card">
            <Swiper
              navigation={true}
              // pagination={{ clickable: true }}
              spaceBetween={0}
              loop={true}
              // autoplay={{ delay: 3000 }}
              modules={[Autoplay, Pagination, Navigation]}
            >
              <SwiperSlide>
                <Image src={img1} alt="image" sizes="100vw" />
              </SwiperSlide>
              <SwiperSlide>
                <Image src={img2} alt="image" sizes="100vw" />
              </SwiperSlide>
              <SwiperSlide>
                <Image src={img3} alt="image" sizes="100vw" />
              </SwiperSlide>
            </Swiper>
            <div className="card-bottom">
              <h3>Sea Pearl Beach Resort & Spa</h3>
              <div className="button-group">
                <a
                  href="https://web.facebook.com/seapearlcoxsbazar"
                  target="_blank"
                >
                  Facebook
                </a>
                <a
                  href="https://seapearlcoxsbazar.book-onlinenow.net"
                  target="_blank"
                >
                  Website
                </a>
                <a
                  href="https://maps.app.goo.gl/TCePBAQFhJUNerQb8"
                  target="_blank"
                >
                  Location
                </a>
              </div>
            </div>
          </div>
          <div className="card">
            <Swiper
              navigation={true}
              // pagination={{ clickable: true }}
              spaceBetween={0}
              loop={true}
              // autoplay={{ delay: 3000 }}
              modules={[Autoplay, Pagination, Navigation]}
            >
              <SwiperSlide>
                <Image src={img1} alt="image" sizes="100vw" />
              </SwiperSlide>
              <SwiperSlide>
                <Image src={img2} alt="image" sizes="100vw" />
              </SwiperSlide>
              <SwiperSlide>
                <Image src={img3} alt="image" sizes="100vw" />
              </SwiperSlide>
            </Swiper>
            <div className="card-bottom">
              <h3>Sea Pearl Beach Resort & Spa</h3>
              <div className="button-group">
                <a
                  href="https://web.facebook.com/seapearlcoxsbazar"
                  target="_blank"
                >
                  Facebook
                </a>
                <a
                  href="https://seapearlcoxsbazar.book-onlinenow.net"
                  target="_blank"
                >
                  Website
                </a>
                <a
                  href="https://maps.app.goo.gl/TCePBAQFhJUNerQb8"
                  target="_blank"
                >
                  Location
                </a>
              </div>
            </div>
          </div>
          <div className="card">
            <Swiper
              navigation={true}
              // pagination={{ clickable: true }}
              spaceBetween={0}
              loop={true}
              // autoplay={{ delay: 3000 }}
              modules={[Autoplay, Pagination, Navigation]}
            >
              <SwiperSlide>
                <Image src={img1} alt="image" sizes="100vw" />
              </SwiperSlide>
              <SwiperSlide>
                <Image src={img2} alt="image" sizes="100vw" />
              </SwiperSlide>
              <SwiperSlide>
                <Image src={img3} alt="image" sizes="100vw" />
              </SwiperSlide>
            </Swiper>
            <div className="card-bottom">
              <h3>Sea Pearl Beach Resort & Spa</h3>
              <div className="button-group">
                <a
                  href="https://web.facebook.com/seapearlcoxsbazar"
                  target="_blank"
                >
                  Facebook
                </a>
                <a
                  href="https://seapearlcoxsbazar.book-onlinenow.net"
                  target="_blank"
                >
                  Website
                </a>
                <a
                  href="https://maps.app.goo.gl/TCePBAQFhJUNerQb8"
                  target="_blank"
                >
                  Location
                </a>
              </div>
            </div>
          </div>
          <div className="card">
            <Swiper
              navigation={true}
              // pagination={{ clickable: true }}
              spaceBetween={0}
              loop={true}
              // autoplay={{ delay: 3000 }}
              modules={[Autoplay, Pagination, Navigation]}
            >
              <SwiperSlide>
                <Image src={img1} alt="image" sizes="100vw" />
              </SwiperSlide>
              <SwiperSlide>
                <Image src={img2} alt="image" sizes="100vw" />
              </SwiperSlide>
              <SwiperSlide>
                <Image src={img3} alt="image" sizes="100vw" />
              </SwiperSlide>
            </Swiper>
            <div className="card-bottom">
              <h3>Sea Pearl Beach Resort & Spa</h3>
              <div className="button-group">
                <a
                  href="https://web.facebook.com/seapearlcoxsbazar"
                  target="_blank"
                >
                  Facebook
                </a>
                <a
                  href="https://seapearlcoxsbazar.book-onlinenow.net"
                  target="_blank"
                >
                  Website
                </a>
                <a
                  href="https://maps.app.goo.gl/TCePBAQFhJUNerQb8"
                  target="_blank"
                >
                  Location
                </a>
              </div>
            </div>
          </div>
          <div className="card">
            <Swiper
              navigation={true}
              // pagination={{ clickable: true }}
              spaceBetween={0}
              loop={true}
              // autoplay={{ delay: 3000 }}
              modules={[Autoplay, Pagination, Navigation]}
            >
              <SwiperSlide>
                <Image src={img1} alt="image" sizes="100vw" />
              </SwiperSlide>
              <SwiperSlide>
                <Image src={img2} alt="image" sizes="100vw" />
              </SwiperSlide>
              <SwiperSlide>
                <Image src={img3} alt="image" sizes="100vw" />
              </SwiperSlide>
            </Swiper>
            <div className="card-bottom">
              <h3>Sea Pearl Beach Resort & Spa</h3>
              <div className="button-group">
                <a
                  href="https://web.facebook.com/seapearlcoxsbazar"
                  target="_blank"
                >
                  Facebook
                </a>
                <a
                  href="https://seapearlcoxsbazar.book-onlinenow.net"
                  target="_blank"
                >
                  Website
                </a>
                <a
                  href="https://maps.app.goo.gl/TCePBAQFhJUNerQb8"
                  target="_blank"
                >
                  Location
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelAndResorts;
