import { Suspense, useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import { useParams } from "react-router-dom";
import userIconSvg from "../../assets/svg/userIcon.svg";
import policeUserIconSvg from "../../assets/svg/policeUserIcon.svg";
import useUsers from "@/store/useUsers";

const setIcon = (icon) => {
  return L.icon({
    iconUrl: icon,
    iconSize: [30, 30], // size of the icon
    popupAnchor: [-3, -20], // point from which the popup should open relative to the iconAnchor
    className: "marker",
  });
};

// Utility to dynamically update the map center
const DynamicCenter = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
};

const TrackUserMap = () => {
  const { onlineUsers } = useUsers();
  const params = useParams();

  // useEffect(() => {
  //   if (socket) {
  //     socket.on("allUsers", (data) => {
  //       const user = ;
  //       setActiveUser(user);
  //     });
  //     return () => {
  //       socket.off("allUsers");
  //     };
  //   }
  // }, [params.id]);

  const activeUser = onlineUsers?.find((user) => user._id === params.id);

  const userLocation = activeUser?.location;
  const hasLocation =
    userLocation?.coordinates[0] !== undefined &&
    userLocation?.coordinates[1] !== undefined;

  console.log("hello map", hasLocation);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MapContainer
        className="w-full h-full mt-4 rounded-lg"
        center={
          hasLocation
            ? [userLocation.coordinates[1], userLocation.coordinates[0]]
            : [21.446717897966725, 91.97569339597321]
        }
        zoom={15}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Dynamically update the center */}
        {hasLocation && (
          <DynamicCenter
            center={[userLocation.coordinates[1], userLocation.coordinates[0]]}
          />
        )}

        {/* Marker for active user */}
        {hasLocation && (
          <Marker
            position={[
              userLocation.coordinates[1],
              userLocation.coordinates[0],
            ]}
            icon={setIcon(
              activeUser?.role === "CUSTOMER" ? userIconSvg : policeUserIconSvg
            )}
          >
            <Popup>{activeUser?.firstName || "Unknown"}</Popup>
          </Marker>
        )}
      </MapContainer>
    </Suspense>
  );
};

export default TrackUserMap;
