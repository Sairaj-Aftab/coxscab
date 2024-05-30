import "@/app/styles/service-category.css";
import Title from "./Title";
import Link from "next/link";
const ServiceCategory = () => {
  return (
    <div className="service-category">
      <div className="container">
        <Title title1="What we get here!" />
        <div className="wrap">
          <Link href="/">
            <div className="icon">🚌</div>
            <div className="text">
              Online Bus Terminal
              <br />
              (Schedule & Booking)
            </div>
          </Link>
          <Link href="/">
            <div className="icon">🚍</div>
            <div className="text">Tourist Bus Entry Permission</div>
          </Link>
          <Link href="/">
            <div className="icon">☕</div>
            <div className="text">Cafe & Restaurants</div>
          </Link>
          <Link href="/">
            <div className="icon">🛫</div>
            <div className="text">Tours and Travels Operators</div>
          </Link>
          <Link href="/">
            <div className="icon">🚗</div>
            <div className="text">CoxsCar (Rent-A-Car)</div>
          </Link>
          <Link href="/">
            <div className="icon">🏨</div>
            <div className="text">Hotel & Resorts</div>
          </Link>
          <Link href="/">
            <div className="icon">🏞</div>
            <div className="text">Tourist Spot & Park</div>
          </Link>
          <Link href="/">
            <div className="icon">💵</div>
            <div className="text">Transport Fare Chart</div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServiceCategory;
