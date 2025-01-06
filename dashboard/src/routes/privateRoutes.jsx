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
import ErrorPage from "@/pages/ErrorPage/ErrorPage";
import Review from "@/pages/Review/Review";
import Users from "@/pages/Users/Users";
import Rides from "@/pages/Rides/Rides";
import Notification from "@/pages/Notification/Notification";
import Payment from "@/pages/Payment/Payment";
import Places from "@/pages/Places/Places";
import Package from "@/pages/Package/Package";

const privateRoutes = [
  {
    element: <SideBar />,
    errorElement: <ErrorPage />,
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
            path: "/rides",
            element: <Rides />,
          },
          {
            path: "/package/:id",
            element: <Package />,
          },
          {
            path: "/users",
            element: <Users />,
          },
          {
            path: "/review",
            element: <Review />,
          },
          {
            path: "/places",
            element: <Places />,
          },
          {
            path: "/notification",
            element: <Notification />,
          },
          {
            path: "/payment",
            element: <Payment />,
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
