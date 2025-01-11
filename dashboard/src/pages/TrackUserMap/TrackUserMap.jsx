import socket from "@/lib/socket";
import { Suspense, useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import { useParams } from "react-router-dom";
import userIconSvg from "../../assets/svg/userIcon.svg";

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
  const userIcon = L.icon({
    iconUrl: userIconSvg,
    iconSize: [30, 30], // size of the icon
    popupAnchor: [-3, -20], // point from which the popup should open relative to the iconAnchor
    className: "marker",
  });
  const params = useParams();
  const [activeUser, setActiveUser] = useState(null);

  useEffect(() => {
    if (socket) {
      socket.on("activeUsers", (data) => {
        const user = data?.find((user) => user.id === params.id);
        setActiveUser(user);
      });
      return () => {
        socket.off("activeUsers");
      };
    }
  }, [params.id]);

  const userLocation = activeUser?.location;
  const hasLocation =
    userLocation?.latitude !== undefined &&
    userLocation?.longitude !== undefined;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MapContainer
        className="w-full h-full mt-4 rounded-lg"
        center={
          hasLocation
            ? [userLocation.latitude, userLocation.longitude]
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
            center={[userLocation.latitude, userLocation.longitude]}
          />
        )}

        {/* Marker for active user */}
        {hasLocation && (
          <Marker
            position={[userLocation.latitude, userLocation.longitude]}
            icon={userIcon}
          >
            <Popup>{activeUser?.firstName || "Unknown"}</Popup>
          </Marker>
        )}
      </MapContainer>
    </Suspense>
  );
};

export default TrackUserMap;
