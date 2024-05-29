import Image from "next/image";
import logo from "@/public/images/logo.png";
import "@/app/styles/header.module.css";

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <div className="header-wrap">
          <div className="top-bar">
            <h1>Welcome to Coxscab</h1>
            <ul>
              <li>
                <a href="/"></a>
              </li>
            </ul>
          </div>
          <div className="top-bar-bottom">
            <div className="logo">
              <Image
                src={logo}
                alt="CoxsCab"
                width={0}
                height={0}
                sizes="100vw"
              />
            </div>
            <ul>
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <a href="/">Gallery</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
