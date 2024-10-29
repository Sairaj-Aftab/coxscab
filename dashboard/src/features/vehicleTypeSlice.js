import { createSlice } from "@reduxjs/toolkit";

const vehicleTypeSlice = createSlice({
  name: "types",
  initialState: {
    types: [],
    loader: false,
  },
  reducers: {
    getTypes: (state, action) => {
      state.loader = action.payload.loader;
      state.types = action.payload.types;
    },
  },
});

// Export Selector
export const getVehicleTypeData = (state) => state.vehicleType;

// Actions
export const { getTypes } = vehicleTypeSlice.actions;

// exports
export default vehicleTypeSlice.reducer;
