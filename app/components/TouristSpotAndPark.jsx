import SliderCard from "./card/SliderCard";
import touristSpots from "@/data/touristSpotAndPark";
import "@/app/styles/components/hotel-resorts.css";

const TouristSpotAndPark = () => {
  return (
    <div className="hotel-resorts">
      <div className="container">
        <div className="wrap">
          {touristSpots?.map((data, index) => (
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

export default TouristSpotAndPark;
