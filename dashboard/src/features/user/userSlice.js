import { createSlice } from "@reduxjs/toolkit";
import {
  createAuthUser,
  deleteAuthUser,
  getAllAuthUser,
  updateAuthUser,
} from "./userApiSllice";

const userSlice = createSlice({
  name: "authUsers",
  initialState: {
    authUsers: [],
    error: null,
    message: null,
    loader: false,
  },
  reducers: {
    setMessageEmpty: (state) => {
      state.error = null;
      state.message = null;
      state.loader = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllAuthUser.rejected, (state, action) => {
        state.error = action.error.message;
        state.loader = false;
      })
      .addCase(getAllAuthUser.pending, (state) => {
        state.loader = true;
      })
      .addCase(getAllAuthUser.fulfilled, (state, action) => {
        state.authUsers = action.payload.users;
        state.loader = false;
      })
      .addCase(createAuthUser.rejected, (state, action) => {
        state.error = action.error.message;
        state.loader = false;
      })
      .addCase(createAuthUser.pending, (state) => {
        state.loader = true;
      })
      .addCase(createAuthUser.fulfilled, (state, action) => {
        state.authUsers.unshift(action.payload.user);
        state.message = action.payload.message;
        state.loader = false;
      })
      .addCase(updateAuthUser.rejected, (state, action) => {
        state.error = action.error.message;
        state.loader = false;
      })
      .addCase(updateAuthUser.pending, (state) => {
        state.loader = true;
      })
      .addCase(updateAuthUser.fulfilled, (state, action) => {
        state.authUsers[
          state.authUsers.findIndex((data) => data.id == action.payload.user.id)
        ] = action.payload.user;
        state.message = action.payload.message;
        state.loader = false;
      })
      .addCase(deleteAuthUser.rejected, (state, action) => {
        state.error = action.error.message;
        state.loader = false;
      })
      .addCase(deleteAuthUser.pending, (state) => {
        state.loader = true;
      })
      .addCase(deleteAuthUser.fulfilled, (state, action) => {
        state.authUsers = state.authUsers.filter(
          (data) => data.id !== action.payload.user.id
        );
        state.loader = false;
      });
  },
});

// Export Selector
export const getAuthUsers = (state) => state.authUsers;

// Actions
export const { setMessageEmpty } = userSlice.actions;

// exports
export default userSlice.reducer;
