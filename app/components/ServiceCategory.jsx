import Title from "./Title";
import Link from "next/link";
import "@/app/styles/components/service-category.css";

const ServiceCategory = () => {
  return (
    <div className="service-category">
      <div className="container">
        <Title title1="What we get here!" />
        <div className="wrap">
          <Link href="/bus-schedules-booking">
            <div className="icon">🚌</div>
            <div className="text">
              Online Bus Terminal
              <br />
              (Schedule & Booking)
            </div>
          </Link>
          <Link href="/tourist-bus-entry-permission">
            <div className="icon">🚍</div>
            <div className="text">Tourist Bus Entry Permission</div>
          </Link>
          <Link href="/">
            <div className="icon">🚗</div>
            <div className="text">CoxsCar (Rent-A-Car)</div>
          </Link>
          <Link href="/fare-chart">
            <div className="icon">💵</div>
            <div className="text">Transport Fare Chart</div>
          </Link>
          <Link href="/hotel-resorts">
            <div className="icon">🏨</div>
            <div className="text">Top Rated Hotels & Resorts</div>
          </Link>
          <Link href="/cafe-restaurants">
            <div className="icon">☕</div>
            <div className="text">Top Rated Cafe & Restaurants</div>
          </Link>
          <Link href="/tourist-spot-park">
            <div className="icon">🏞</div>
            <div className="text">Popular Tourist Spot</div>
          </Link>
          <Link href="/">
            <div className="icon">🛫</div>
            <div className="text">Tours and Travels Operators</div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServiceCategory;
