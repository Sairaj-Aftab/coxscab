import { RouterProvider } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import router from "./routes/router";
import logoImg from "/logo1.png";
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
import useAuth from "./store/useAuth";
import { getDriverActivities, getDriverStatus } from "./service/driver.service";
import useDriverActivities from "./store/useDriverActivities";
import useDriverStatus from "./store/useDriverStatus";
import {
  getVehicleConditions,
  getVehicleTypes,
} from "./service/vehicle.service";
import useVehicleCondition from "./store/useVehicleCondition";
import useVehicleType from "./store/useVehicleType";
import socket from "./lib/socket";
import addNotification, { Notifications } from "react-push-notification";
import useUsers from "./store/useUsers";

function App() {
  const dispatch = useDispatch();
  const { setLogedInUser } = useAuth();
  const { setOnlineUsers } = useUsers();
  const { setActivities } = useDriverActivities();
  const { setDriverStatus } = useDriverStatus();
  const { setVehicleConditions } = useVehicleCondition();
  const { setVehicleTypes } = useVehicleType();

  const { data: activities, isLoading: activitiesLoading } = useQuery({
    queryKey: ["driverActivities"],
    queryFn: () => getDriverActivities(),
  });
  const { data: status, isLoading: statusLoading } = useQuery({
    queryKey: ["driverStatus"],
    queryFn: () => getDriverStatus(),
  });
  const { data: conditions, isLoading: conditionsLoading } = useQuery({
    queryKey: ["vehicleConditions"],
    queryFn: () => getVehicleConditions(),
  });
  const { data: types, isLoading: typesLoading } = useQuery({
    queryKey: ["vehicleTypes"],
    queryFn: () => getVehicleTypes(),
  });

  const { data: permissions, isLoading: permissionsLoading } =
    useGetPermissionsQuery();
  const { data: roles, isLoading: rolesLoading } = useGetRolesQuery();

  useEffect(() => {
    const fetchUser = async () => {
      await setLogedInUser();
    };
    fetchUser();
  }, [setLogedInUser]);
  // Set Driver Activities
  useEffect(() => {
    setActivities({ data: activities?.activities, loader: activitiesLoading });
  }, [activities?.activities, activitiesLoading, setActivities]);
  // Set Driver Status
  useEffect(() => {
    setDriverStatus({ data: status?.status, loader: statusLoading });
  }, [setDriverStatus, status?.status, statusLoading]);
  // Set Vehicle Condition
  useEffect(() => {
    setVehicleConditions({
      data: conditions?.conditions,
      loader: conditionsLoading,
    });
  }, [conditions?.conditions, conditionsLoading, setVehicleConditions]);
  // Set Vehicle Types
  useEffect(() => {
    setVehicleTypes({
      data: types?.types,
      loader: typesLoading,
    });
  }, [setVehicleTypes, types?.types, typesLoading]);

  useEffect(() => {
    socket.on("connect", () => {
      socket.on("allUsers", (data) => {
        setOnlineUsers(data);
      });
    });
    return () => {
      socket.off("allUsers");
    };
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.on("newReview", (data) => {
        addNotification({
          title: "New Review",
          message: data?.comment,
          theme: "darkblue",
          native: true, // when using native, your OS will handle theming.
          duration: 10000,
          vibrate: [200, 100, 200],
          icon: logoImg,
        });
      });
      socket.on("newUser", (data) => {
        addNotification({
          title: "Register New User",
          message: data?.firstName,
          theme: "darkblue",
          native: true, // when using native, your OS will handle theming.
          duration: 10000,
          vibrate: [200, 100, 200],
          icon: logoImg,
        });
      });
      return () => {
        socket.off("newReview");
        socket.off("newUser");
      };
    }
  }, []);

  useEffect(() => {
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

  return (
    <>
      <Notifications />
      <Sonner />
      <Toaster />
      <CustomToaster />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
