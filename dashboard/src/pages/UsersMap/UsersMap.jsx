import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import userIconSvg from "../../assets/svg/userIcon.svg";
import policeUserIconSvg from "../../assets/svg/policeUserIcon.svg";
import { Badge } from "@/components/ui/badge";
import useUsers from "@/store/useUsers";

const setIcon = (icon) => {
  return L.icon({
    iconUrl: icon,
    iconSize: [30, 30], // size of the icon
    popupAnchor: [-3, -20], // point from which the popup should open relative to the iconAnchor
    className: "marker",
  });
};
const UsersMap = () => {
  const { onlineUsers } = useUsers();

  return (
    <div className="w-full h-full relative">
      <div className="absolute bottom-3 left-3 z-[9999] flex gap-1">
        <Badge
          variant="secondary"
          className="text-sm font-semibold bg-black/50 text-white px-2 py-1"
        >
          Users:{" "}
          <span className="text-green-400 ml-1">{onlineUsers.length}</span>
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
        {onlineUsers
          ?.filter(
            (user) =>
              user?.location?.coordinates[1] !== undefined &&
              user?.location?.coordinates[0] !== undefined
          )
          .map((user) => (
            <Marker
              key={user._id}
              position={[21.416168436869683, 91.98431669489936]}
              // position={[
              //   user?.location.coordinates[1],
              //   user?.location.coordinates[0],
              // ]}
              icon={setIcon(
                user?.role === "CUSTOMER" ? userIconSvg : policeUserIconSvg
              )}
            >
              <Popup>{user?.firstName || "Unknown"}</Popup>
            </Marker>
          ))}
        <Marker
          // key={user._id}
          position={[21.416168436869683, 91.98431669489936]}
          // position={[
          //   user?.location.coordinates[1],
          //   user?.location.coordinates[0],
          // ]}
          icon={setIcon(policeUserIconSvg)}
        >
          <Popup>
            <div className="flex items-center gap-2">
              <h2>Sairaj Aftab</h2>
              <p></p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default UsersMap;
