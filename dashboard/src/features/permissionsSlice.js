import { createSlice } from "@reduxjs/toolkit";

const permissionsSlice = createSlice({
  name: "permissions",
  initialState: {
    permissions: [],
    loader: false,
  },
  reducers: {
    getPermissions: (state, action) => {
      state.loader = action.payload.loader;
      state.permissions = action.payload.permissions;
    },
  },
});

// Export Selector
export const getPermissionsData = (state) => state.permissions;

// Actions
export const { getPermissions } = permissionsSlice.actions;

// exports
export default permissionsSlice.reducer;
