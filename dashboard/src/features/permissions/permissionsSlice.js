import { createSlice } from "@reduxjs/toolkit";
import {
  createPermission,
  deletePermission,
  getAllPermission,
  updatePermissionStatus,
} from "./permissionsApiSlice";

const permissionsSlice = createSlice({
  name: "permissions",
  initialState: {
    permissions: [],
    status: null,
    error: null,
    message: null,
    success: false,
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
      .addCase(getAllPermission.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(getAllPermission.fulfilled, (state, action) => {
        state.permissions = action.payload.permission;
      })
      .addCase(createPermission.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(createPermission.fulfilled, (state, action) => {
        // state.message = action.payload.message;
        state.permissions.push(action.payload.permission);
      })
      .addCase(deletePermission.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(deletePermission.fulfilled, (state, action) => {
        state.permissions = state.permissions.filter(
          (item) => item.id !== action.payload.permission.id
        );
      })
      .addCase(updatePermissionStatus.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(updatePermissionStatus.fulfilled, (state, action) => {
        state.permissions[
          state.permissions.findIndex(
            (data) => data.id == action.payload.permission.id
          )
        ] = action.payload.permission;
      });
  },
});

// Export Selector
export const getPermissions = (state) => state.permissions;

// Actions
export const { setMessageEmpty } = permissionsSlice.actions;

// exports
export default permissionsSlice.reducer;
