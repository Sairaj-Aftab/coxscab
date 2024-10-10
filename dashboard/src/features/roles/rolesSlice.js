import { createSlice } from "@reduxjs/toolkit";
import {
  createRole,
  deleteRole,
  editRole,
  getAllRoles,
  updateRoleStatus,
} from "./rolesApiSlice";

const rolesSlice = createSlice({
  name: "roles",
  initialState: {
    roles: [],
    error: null,
    message: null,
    loader: false,
  },
  reducers: {
    setMessageEmpty: (state) => {
      state.error = null;
      state.message = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllRoles.rejected, (state, action) => {
        state.error = action.error.message;
        state.loader = false;
      })
      .addCase(getAllRoles.fulfilled, (state, action) => {
        state.roles = action.payload.roles;
        state.loader = false;
      })
      .addCase(createRole.pending, (state) => {
        state.loader = true;
      })
      .addCase(createRole.rejected, (state, action) => {
        state.error = action.error.message;
        state.loader = false;
      })
      .addCase(createRole.fulfilled, (state, action) => {
        state.roles.push(action.payload.role);
        state.message = action.payload.message;
        state.loader = false;
      })
      .addCase(deleteRole.rejected, (state, action) => {
        state.error = action.error.message;
        state.loader = false;
      })
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.roles = state.roles.filter(
          (item) => item.id !== action.payload.role.id
        );
        state.loader = false;
      })
      .addCase(updateRoleStatus.rejected, (state, action) => {
        state.error = action.error.message;
        state.loader = false;
      })
      .addCase(updateRoleStatus.fulfilled, (state, action) => {
        state.roles[
          state.roles.findIndex((data) => data.id == action.payload.role.id)
        ] = action.payload.role;
        state.loader = false;
      })
      .addCase(editRole.pending, (state) => {
        state.loader = true;
      })
      .addCase(editRole.rejected, (state, action) => {
        state.error = action.error.message;
        state.loader = false;
      })
      .addCase(editRole.fulfilled, (state, action) => {
        state.roles[
          state.roles.findIndex((data) => data.id == action.payload.role.id)
        ] = action.payload.role;
        state.message = action.payload.message;
        state.loader = false;
      });
  },
});

// Export Selector
export const getRoles = (state) => state.roles;

// Actions
export const { setMessageEmpty } = rolesSlice.actions;

// exports
export default rolesSlice.reducer;
