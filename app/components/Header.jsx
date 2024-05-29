import Image from "next/image";
import logo from "@/public/images/logo.png";
import "@/app/styles/header.css";

const menuItem = [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "Gallery",
    path: "/",
  },
  {
    name: "About",
    path: "/",
  },
  {
    name: "More",
    path: "/",
    item: [
      {
        name: "Admin",
        path: "/admin",
      },
      {
        name: "Admin",
        path: "/admin",
      },
      {
        name: "Admin",
        path: "/admin",
      },
    ],
  },
];

const Header = () => {
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
            <div className="logo">
              <Image
                src={logo}
                alt="CoxsCab"
                width={0}
                height={0}
                sizes="100vw"
              />
            </div>
            <ul className="menu">
              {menuItem?.map((data, index) => (
                <li key={index}>
                  <a href={`${data.path}`}>{data.name}</a>
                  {data?.item && (
                    <ul className="inner-menu">
                      {data?.item?.map((data, index) => (
                        <li key={index}>
                          <a href={`${data.path}`}>{data.name}</a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
              {/* <li>
                <a href="/">Gallery</a>
              </li>
              <li>
                <a href="/">More---</a>

                <ul className="inner-menu">
                  <li>
                    <a href="/">admin</a>
                  </li>
                  <li>
                    <a href="/">admin</a>
                  </li>
                  <li>
                    <a href="/">admin</a>
                  </li>
                  <li>
                    <a href="/">admin</a>
                  </li>
                </ul>
              </li> */}
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
