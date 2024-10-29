import { createSlice } from "@reduxjs/toolkit";

const vehicleSlice = createSlice({
  name: "vehicles",
  initialState: {
    vehicles: [],
    loader: false,
  },
  reducers: {
    getVehicles: (state, action) => {
      state.loader = action.payload.loader;
      state.vehicles = action.payload.vehicles;
    },
  },
});

// Export Selector
export const getVehiclesData = (state) => state.vehicle;

// Actions
export const { getVehicles } = vehicleSlice.actions;

// exports
export default vehicleSlice.reducer;
