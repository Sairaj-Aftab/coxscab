import Login from "@/pages/Login/Login";
import PublicRouteGrid from "./PublicRouteGrid";

const publicRoutes = [
  {
    element: <PublicRouteGrid />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
];

export default publicRoutes;
