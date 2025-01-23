import socket from "@/lib/socket";
import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import userIconSvg from "../../assets/svg/userIcon.svg";
import policeUserIconSvg from "../../assets/svg/policeUserIcon.svg";
import { Badge } from "@/components/ui/badge";

const setIcon = (icon) => {
  return L.icon({
    iconUrl: icon,
    iconSize: [30, 30], // size of the icon
    popupAnchor: [-3, -20], // point from which the popup should open relative to the iconAnchor
    className: "marker",
  });
};
const UsersMap = () => {
  const [activeUsers, setActiveUsers] = useState([]);

  useEffect(() => {
    if (socket) {
      socket.on("allUsers", (data) => {
        setActiveUsers(data);
      });
      return () => {
        socket.off("allUsers");
      };
    }
  }, []);
  return (
    <div className="w-full h-full relative">
      <div className="absolute bottom-3 left-3 z-[9999] flex gap-1">
        <Badge
          variant="secondary"
          className="text-sm font-semibold bg-black/50 text-white px-2 py-1"
        >
          Users:{" "}
          <span className="text-green-400 ml-1">{activeUsers.length}</span>
        </Badge>
        {/* <Badge
          variant="secondary"
          className="text-sm font-semibold bg-black/50 text-white px-2 py-1"
        >
          Drivers:{" "}
          <span className="text-green-400 ml-1">{activeDrivers?.length}</span>
        </Badge>
        <Badge
          variant="secondary"
          className="text-sm font-semibold bg-black/50 text-white px-2 py-1"
        >
          Admins:{" "}
          <span className="text-green-400 ml-1">{activeAdmins?.length}</span>
        </Badge> */}
      </div>
      <MapContainer
        className="w-full h-full"
        center={[21.446717897966725, 91.97569339597321]}
        zoom={13}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {activeUsers
          ?.filter(
            (user) =>
              user?.location?.latitude !== undefined &&
              user?.location?.longitude !== undefined
          )
          .map((user) => (
            <Marker
              key={user.id}
              position={[user?.location.latitude, user?.location.longitude]}
              icon={setIcon(
                user?.role === "CUSTOMER" ? userIconSvg : policeUserIconSvg
              )}
            >
              <Popup>{user?.firstName || "Unknown"}</Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
};

export default UsersMap;
