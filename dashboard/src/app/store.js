import { configureStore } from "@reduxjs/toolkit";
// Or from '@reduxjs/toolkit/query/react'
import { setupListeners } from "@reduxjs/toolkit/query";
import { permissionApi } from "./services/permissionsApi";
import permissionsSlice from "../features/permissionsSlice";
import rolesSlice from "../features/rolesSlice";
import { roleApi } from "./services/rolesApi";

export const store = configureStore({
  reducer: {
    [roleApi.reducerPath]: roleApi.reducer,
    roles: rolesSlice,
    [permissionApi.reducerPath]: permissionApi.reducer,
    permissions: permissionsSlice,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(roleApi.middleware, permissionApi.middleware),
});

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch);
