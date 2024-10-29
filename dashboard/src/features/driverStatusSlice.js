import { createSlice } from "@reduxjs/toolkit";

const driverStatusSlice = createSlice({
  name: "status",
  initialState: {
    status: [],
    loader: false,
  },
  reducers: {
    getStatus: (state, action) => {
      state.loader = action.payload.loader;
      state.status = action.payload.status;
    },
  },
});

// Export Selector
export const getDriverStatusData = (state) => state.driverStatus;

// Actions
export const { getStatus } = driverStatusSlice.actions;

// exports
export default driverStatusSlice.reducer;
