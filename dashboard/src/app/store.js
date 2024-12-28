import { configureStore } from "@reduxjs/toolkit";
// Or from '@reduxjs/toolkit/query/react'
import { setupListeners } from "@reduxjs/toolkit/query";
import authSlice from "../features/auth/authSlice";
import { authUsersApi } from "./services/authUsersApi";
import { permissionApi } from "./services/permissionsApi";
import permissionsSlice from "../features/permissionsSlice";
import rolesSlice from "../features/rolesSlice";
import { roleApi } from "./services/rolesApi";
import { vehicleTypeApi } from "./services/vehicleTypeApi";
import vehicleTypeSlice from "../features/vehicleTypeSlice";
import { vehicleConditionApi } from "./services/vehicleConditionApi";
import vehicleConditionSlice from "../features/vehicleConditionSlice";
import { vehicleApi } from "./services/vehicleApi";
import vehicleSlice from "../features/vehicleSlice";
import { driverActivitiesApi } from "./services/driverActivitiesApi";
import driverActivitiesSlice from "../features/driverActivitiesSlice";
import { driverStatusApi } from "./services/driverStatusApi";
import driverStatusSlice from "../features/driverStatusSlice";
import { driverApi } from "./services/driverApi";
import { garageApi } from "./services/garageApi";
import { chartApi } from "./services/chartApi";
import { reviewApi } from "./services/reviewApi";
import { packageApi } from "./services/packageApi";
import { userApi } from "./services/userApi";

export const store = configureStore({
  reducer: {
    // Add the generated reducer as a specific top-level slice
    auth: authSlice,
    [authUsersApi.reducerPath]: authUsersApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [chartApi.reducerPath]: chartApi.reducer,
    [vehicleTypeApi.reducerPath]: vehicleTypeApi.reducer,
    vehicleType: vehicleTypeSlice,
    [driverActivitiesApi.reducerPath]: driverActivitiesApi.reducer,
    driverActivities: driverActivitiesSlice,
    [driverStatusApi.reducerPath]: driverStatusApi.reducer,
    driverStatus: driverStatusSlice,
    [vehicleConditionApi.reducerPath]: vehicleConditionApi.reducer,
    vehicleCondition: vehicleConditionSlice,
    [vehicleApi.reducerPath]: vehicleApi.reducer,
    vehicle: vehicleSlice,
    [driverApi.reducerPath]: driverApi.reducer,
    [garageApi.reducerPath]: garageApi.reducer,
    [packageApi.reducerPath]: packageApi.reducer,
    [reviewApi.reducerPath]: reviewApi.reducer,
    [roleApi.reducerPath]: roleApi.reducer,
    roles: rolesSlice,
    [permissionApi.reducerPath]: permissionApi.reducer,
    permissions: permissionsSlice,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authUsersApi.middleware,
      userApi.middleware,
      chartApi.middleware,
      vehicleTypeApi.middleware,
      vehicleConditionApi.middleware,
      vehicleApi.middleware,
      driverApi.middleware,
      driverActivitiesApi.middleware,
      driverStatusApi.middleware,
      garageApi.middleware,
      packageApi.middleware,
      reviewApi.middleware,
      roleApi.middleware,
      permissionApi.middleware
    ),
});

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch);
