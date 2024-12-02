import { Marker } from "react-map-gl";
import locationImg from "@/public/location.png";
import userLocationImg from "@/public/user-location.png";
import Image from "next/image";
import { useMapCoordinates } from "@/store/mapCoordinates";

const MapMarker = () => {
  const { userCoordinates, picupCoordinates, destinationCoordinates } =
    useMapCoordinates();
  return (
    <>
      {/* {coxsBazarPlaces.map((place, index) => (
        <Marker
          key={index}
          longitude={place.lng}
          latitude={place.lat}
          anchor="bottom"
        >
          <MapPin className="w-6 h-6 text-red-600" />
          <Car className="w-6 h-6 text-primary" />
        </Marker>
      ))} */}
      {userCoordinates && (
        <Marker
          longitude={userCoordinates.lng}
          latitude={userCoordinates.lat}
          anchor="bottom"
        >
          <Image src={userLocationImg} alt="" width={40} height={40} />
        </Marker>
      )}
      {picupCoordinates && (
        <Marker
          longitude={picupCoordinates.lng}
          latitude={picupCoordinates.lat}
          anchor="bottom"
        >
          {picupCoordinates.me ? (
            <Image src={userLocationImg} alt="" width={40} height={40} />
          ) : (
            <div className="w-[40px] h-[40px] relative">
              <Image src={locationImg} alt="" width={40} height={40} />
              <span className="absolute top-[4px] left-1/2 transform -translate-x-1/2 text-center text-white text-sm font-semibold bg-primary rounded-full w-5 h-5 flex items-center justify-center">
                A
              </span>
            </div>
          )}
        </Marker>
      )}
      {destinationCoordinates && (
        <Marker
          longitude={destinationCoordinates.lng}
          latitude={destinationCoordinates.lat}
          anchor="bottom"
        >
          <div className="w-[40px] h-[40px] relative">
            <Image src={locationImg} alt="" width={40} height={40} />
            <span className="absolute top-[4px] left-1/2 transform -translate-x-1/2 text-center text-white text-sm font-semibold bg-blue-600 rounded-full w-5 h-5 flex items-center justify-center">
              B
            </span>
          </div>
        </Marker>
      )}
    </>
  );
};

export default MapMarker;
