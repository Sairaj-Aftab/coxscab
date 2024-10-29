import { createSlice } from "@reduxjs/toolkit";

const rolesSlice = createSlice({
  name: "roles",
  initialState: {
    roles: [],
    loader: false,
  },
  reducers: {
    getRoles: (state, action) => {
      state.loader = action.payload.loader;
      state.roles = action.payload.roles;
    },
  },
});

// Export Selector
export const getRolesData = (state) => state.roles;

// Actions
export const { getRoles } = rolesSlice.actions;

// exports
export default rolesSlice.reducer;
