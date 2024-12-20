import { authData } from "@/features/auth/authSlice";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PublicRouteGrid = () => {
  const { auth } = useSelector(authData);

  if (localStorage.getItem("auth")) {
    return auth ? <Navigate to="/" /> : <Outlet />;
  }
  return <Outlet />;
};

export default PublicRouteGrid;
