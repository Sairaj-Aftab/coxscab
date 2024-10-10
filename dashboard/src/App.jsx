import { RouterProvider } from "react-router-dom";
import router from "./routes/router";
import { Toaster as CustomToaster } from "./components/ui/toaster";
import { Toaster } from "react-hot-toast";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getAllPermission } from "./features/permissions/permissionsApiSlice";
import { getAllRoles } from "./features/roles/rolesApiSlice";
import { getAllAuthUser } from "./features/user/userApiSllice";
import { getLogedInUser } from "./features/auth/authApiSlice";
import { authData } from "./features/auth/authSlice";

function App() {
  const dispatch = useDispatch();
  const { auth } = useSelector(authData);

  useEffect(() => {
    if (localStorage.getItem("auth")) {
      dispatch(getLogedInUser());
    }
    dispatch(getAllRoles());
    dispatch(getAllPermission());
  }, [dispatch]);
  useEffect(() => {
    dispatch(getAllAuthUser());
  }, [dispatch, auth]);
  return (
    <>
      <Toaster />
      <CustomToaster />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
