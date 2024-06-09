"use client";
import Image from "next/image";
import logo from "@/public/images/logo.png";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import "@/app/styles/components/header.css";

const menuItem = [
  {
    name: "Home",
    path: "/",
  },
  // {
  //   name: "Gallery",
  //   path: "/gallery",
  // },
  {
    name: "About",
    path: "/about",
  },
  {
    name: "Login",
    path: "/login",
  },
  {
    name: "Services",
    path: "#",
    item: [
      {
        name: "Online Bus Terminal (Schedule & Booking)",
        path: "/bus-schedules-booking",
      },
      {
        name: "CoxsCar (Rent-A-Car)",
        path: "/admin",
      },
      {
        name: "Tourist Bus Entry Permission",
        path: "/tourist-bus-entry-permission",
      },
      {
        name: "Top Rated Hotels & Resorts",
        path: "/hotel-resorts",
      },
      {
        name: "Top Rated Cafe & Restaurants",
        path: "/cafe-restaurants",
      },
      {
        name: "Popular Tourist Spot",
        path: "/tourist-spot-park",
      },
      {
        name: "Tours and Travels Operators",
        path: "/admin",
      },
      {
        name: "Transport Fare Chart",
        path: "/fare-chart",
      },
      {
        name: "Admin",
        path: "/admin",
      },
    ],
  },
];

const Header = () => {
  const path = usePathname();
  const [moMenu, setMoMenu] = useState(false);
  return (
    <header className="header">
      <div className="top-bar">
        <div className="container">
          <div className="wrap">
            <ul className="contact-info">
              <li>
                <a href="/">
                  <i className="fi fi-tr-envelope-download"></i>
                  <span>demo@gmail.com</span>
                </a>
              </li>
              <li>
                <a href="/">
                  <i className="fi fi-rr-phone-call"></i>
                  <span>1-888-452-1505</span>
                </a>
              </li>
            </ul>
            <ul className="social-info">
              <li>
                <a href="">
                  <i className="fi fi-brands-facebook"></i>
                </a>
              </li>
              <li>
                <a href="">
                  <i className="fi fi-brands-youtube"></i>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="main-header">
        <div className="container">
          <div className="wrap">
            <Link href="/" className="logo">
              <Image
                src={logo}
                alt="CoxsCab"
                width={0}
                height={0}
                sizes="100vw"
              />
            </Link>
            <ul className="menu">
              {menuItem?.map((data, index) => (
                <li key={index}>
                  <Link
                    href={`${data.path}`}
                    className={`${path == data.path && "active"}`}
                  >
                    {data.name}
                  </Link>
                  {data?.item && <i className="fi fi-rr-caret-down"></i>}
                  {data?.item && (
                    <ul className="inner-menu">
                      {data?.item?.map((data, index) => (
                        <li key={index}>
                          <Link
                            href={`${data.path}`}
                            className={`${path == data.path && "active"}`}
                          >
                            {data.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
            {/* Mobile Menu */}
            {moMenu ? (
              <i
                className="fi fi-br-cross"
                onClick={() => {
                  setMoMenu(!moMenu);
                }}
              ></i>
            ) : (
              <i
                className="fi fi-br-menu-burger"
                onClick={() => {
                  setMoMenu(!moMenu);
                }}
              ></i>
            )}
            <ul className={`mobile-menu ${moMenu && "active"}`}>
              {menuItem?.map((data, index) => (
                <li key={index}>
                  <Link href={`${data.path}`}>
                    {data.name}{" "}
                    {data?.item && <i className="fi fi-rr-caret-down"></i>}
                  </Link>

                  {data?.item && (
                    <ul className="mobile-inner-menu">
                      {data?.item?.map((data, index) => (
                        <li key={index}>
                          <Link href={`${data.path}`}>{data.name}</Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
