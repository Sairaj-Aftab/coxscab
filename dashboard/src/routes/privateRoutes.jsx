import SideBar from "@/components/SideBar/SideBar";
import AuthUsers from "@/pages/AuthUsers/AuthUsers";
import Dashboard from "@/pages/Dashboard/Dashboard";
import Permissions from "@/pages/Permissions/Permissions";
import Roles from "@/pages/Roles/Roles";
import Vehicles from "@/pages/Vehicles/Vehicles";
import PrivateRouteGird from "./PrivateRouteGrid";
import RequiredCategories from "@/pages/RequiredCategories/RequiredCategories";
import Drivers from "@/pages/Drivers/Drivers";
import Garage from "@/pages/Garage/Garage";

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
            path: "/vehicles/:id",
            element: <Vehicles />,
          },
          {
            path: "/drivers/:id",
            element: <Drivers />,
          },
          {
            path: "/garage/:id",
            element: <Garage />,
          },
          {
            path: "/required-categories",
            element: <RequiredCategories />,
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
