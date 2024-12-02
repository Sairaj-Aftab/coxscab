import { useMapCoordinates } from "@/store/mapCoordinates";

const MapRouteDistanceTime = () => {
  const { directionData } = useMapCoordinates();
  return (
    <div className="flex text-sm gap-2">
      <p className="bg-primary py-1 px-2 rounded-md flex gap-1 text-sm font-semibold">
        <span className="text-white">Distance :</span>
        <span className="text-yellow-300">
          {(directionData?.routes[0]?.distance / 1609.34)?.toFixed(2)}
        </span>
        <span className="text-yellow-300">Miles</span>
      </p>
      <p className="bg-primary py-1 px-2 rounded-md flex gap-1 text-sm font-semibold">
        <span className="text-white">Duration :</span>
        <span className="text-yellow-300">
          {Math.floor(directionData?.routes[0]?.duration / 3600)} h{" "}
          {Math.floor((directionData?.routes[0]?.duration % 3600) / 60)} m
        </span>
      </p>
    </div>
  );
};

export default MapRouteDistanceTime;
