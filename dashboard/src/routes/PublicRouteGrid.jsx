import useAuth from "@/store/useAuth";
import { Navigate, Outlet } from "react-router-dom";

const PublicRouteGrid = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return isAuthenticated ? <Navigate to="/" /> : <Outlet />;
  }
  return <Outlet />;
};

export default PublicRouteGrid;
