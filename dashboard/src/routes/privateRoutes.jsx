import SideBar from "@/components/SideBar/SideBar";
import AuthUsers from "@/pages/AuthUsers/AuthUsers";
import Dashboard from "@/pages/Dashboard/Dashboard";
import Permissions from "@/pages/Permissions/Permissions";
import Roles from "@/pages/Roles/Roles";
import VehicleAdd from "@/pages/VehicleAdd/VehicleAdd";
import Vehicles from "@/pages/Vehicles/Vehicles";
import PrivateRouteGird from "./PrivateRouteGrid";

const privateRoutes = [
  {
    element: <SideBar />,
    children: [
      {
        element: <PrivateRouteGird />,
        children: [
          {
            path: "/",
            element: <Dashboard />,
          },
          {
            path: "/vehicles",
            element: <Vehicles />,
          },
          {
            path: "/vehicle/add",
            element: <VehicleAdd />,
          },
          {
            path: "/roles",
            element: <Roles />,
          },
          {
            path: "/permissions",
            element: <Permissions />,
          },
          {
            path: "/auth-users",
            element: <AuthUsers />,
          },
        ],
      },
    ],
  },
];

export default privateRoutes;
