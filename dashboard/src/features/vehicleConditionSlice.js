import { createSlice } from "@reduxjs/toolkit";

const vehicleConditionSlice = createSlice({
  name: "conditions",
  initialState: {
    conditions: [],
    loader: false,
  },
  reducers: {
    getConditions: (state, action) => {
      state.loader = action.payload.loader;
      state.conditions = action.payload.conditions;
    },
  },
});

// Export Selector
export const getVehicleConditionData = (state) => state.vehicleCondition;

// Actions
export const { getConditions } = vehicleConditionSlice.actions;

// exports
export default vehicleConditionSlice.reducer;
