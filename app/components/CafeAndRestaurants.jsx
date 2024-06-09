import cafeRestaurants from "@/data/cafeRestaurants";
import SliderCard from "./card/SliderCard";
import "@/app/styles/components/hotel-resorts.css";
const CafeAndRestaurants = () => {
  return (
    <div className="hotel-resorts">
      <div className="container">
        <div className="wrap">
          {cafeRestaurants?.map((data, index) => (
            <SliderCard
              key={index}
              img={data.images}
              name={data.name}
              fb={data.fb}
              web={data.web}
              location={data.location}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CafeAndRestaurants;
