import { RouterProvider } from "react-router-dom";
import router from "./routes/router";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster as CustomToaster } from "./components/ui/toaster";
import { Toaster } from "react-hot-toast";
import "./App.css";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { useGetPermissionsQuery } from "./app/services/permissionsApi";
import { useGetRolesQuery } from "./app/services/rolesApi";
import { getRoles } from "./features/rolesSlice";
import { getPermissions } from "./features/permissionsSlice";
import { getLogedInUser } from "./features/auth/authApiSlice";
import { useGetVehicleTypesQuery } from "./app/services/vehicleTypeApi";
import { useGetVehicleConditionsQuery } from "./app/services/vehicleConditionApi";
import { getTypes } from "./features/vehicleTypeSlice";
import { getConditions } from "./features/vehicleConditionSlice";
import { useGetDriverStatusQuery } from "./app/services/driverStatusApi";
import { useGetDriverActivitiesQuery } from "./app/services/driverActivitiesApi";
import { getStatus } from "./features/driverStatusSlice";
import { getActivities } from "./features/driverActivitiesSlice";

function App() {
  const dispatch = useDispatch();

  const { data: types, isLoading: typesLoading } = useGetVehicleTypesQuery();
  const { data: conditions, isLoading: conditionsLoading } =
    useGetVehicleConditionsQuery();

  const { data: status, isLoading: statusLoading } = useGetDriverStatusQuery();
  const { data: activities, isLoading: activitiesLoading } =
    useGetDriverActivitiesQuery();

  const { data: permissions, isLoading: permissionsLoading } =
    useGetPermissionsQuery();
  const { data: roles, isLoading: rolesLoading } = useGetRolesQuery();

  useEffect(() => {
    if (localStorage.getItem("auth")) {
      dispatch(getLogedInUser());
    }
  }, [dispatch]);

  useEffect(() => {
    dispatch(getTypes({ loader: typesLoading, types: types?.types }));
    dispatch(
      getConditions({
        loader: conditionsLoading,
        conditions: conditions?.conditions,
      })
    );
    dispatch(getStatus({ loader: statusLoading, status: status?.status }));
    dispatch(
      getActivities({
        loader: activitiesLoading,
        activities: activities?.activities,
      })
    );
    dispatch(getRoles({ loader: rolesLoading, roles: roles?.roles }));
    dispatch(
      getPermissions({
        loader: permissionsLoading,
        permissions: permissions?.permissions,
      })
    );
  }, [
    activities?.activities,
    activitiesLoading,
    conditions,
    conditionsLoading,
    dispatch,
    permissions,
    permissionsLoading,
    roles,
    rolesLoading,
    status?.status,
    statusLoading,
    types,
    typesLoading,
  ]);
  // useEffect(() => {
  //   dispatch(getAllAuthUser());
  // }, [dispatch, auth]);
  return (
    <>
      <Sonner />
      <Toaster />
      <CustomToaster />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
