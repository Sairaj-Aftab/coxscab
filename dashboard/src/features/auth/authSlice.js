import { createSlice } from "@reduxjs/toolkit";
import { getLogedInUser, loginAuthUser, logoutAuthUser } from "./authApiSlice";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    auth: localStorage.getItem("auth")
      ? JSON.parse(localStorage.getItem("auth"))
      : null,
    message: null,
    error: null,
    success: false,
    loader: false,
  },
  reducers: {
    setMessageEmpty: (state) => {
      state.message = null;
      state.error = null;
      state.success = false;
      state.loader = false;
    },
    setLogoutUser: (state) => {
      state.message = null;
      state.error = null;
      state.authUser = null;
      state.success = false;
      state.loader = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAuthUser.rejected, (state, action) => {
        state.error = action.error.message;
        state.loader = false;
      })
      .addCase(loginAuthUser.pending, (state) => {
        state.loader = true;
      })
      .addCase(loginAuthUser.fulfilled, (state, action) => {
        state.message = action.payload.message;
        state.auth = action.payload.user;
        localStorage.setItem("auth", JSON.stringify(action.payload.user));
        state.success = true;
        state.loader = false;
      })
      .addCase(getLogedInUser.rejected, (state) => {
        state.auth = null;
        state.loader = false;
      })
      .addCase(getLogedInUser.pending, (state) => {
        state.loader = true;
      })
      .addCase(getLogedInUser.fulfilled, (state, action) => {
        state.auth = action.payload;
        state.success = true;
        state.loader = false;
      })
      .addCase(logoutAuthUser.rejected, (state, action) => {
        state.error = action.error.message;
        state.loader = false;
      })
      .addCase(logoutAuthUser.pending, (state) => {
        state.loader = true;
      })
      .addCase(logoutAuthUser.fulfilled, (state) => {
        state.auth = null;
        localStorage.removeItem("auth");
        state.loader = false;
      });
  },
});

// Export Selector
export const authData = (state) => state.auth;

// Actions
export const { setMessageEmpty, setLogoutUser } = authSlice.actions;

// exports
export default authSlice.reducer;
