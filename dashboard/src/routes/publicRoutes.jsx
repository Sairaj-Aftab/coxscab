import Login from "@/pages/Login/Login";
import PublicRouteGrid from "./PublicRouteGrid";
import ErrorPage from "@/pages/ErrorPage/ErrorPage";

const publicRoutes = [
  {
    element: <PublicRouteGrid />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
];

export default publicRoutes;
