import { createSlice } from "@reduxjs/toolkit";

const driverActivitiesSlice = createSlice({
  name: "activities",
  initialState: {
    activities: [],
    loader: false,
  },
  reducers: {
    getActivities: (state, action) => {
      state.loader = action.payload.loader;
      state.activities = action.payload.activities;
    },
  },
});

// Export Selector
export const getDriverActivitiesData = (state) => state.driverActivities;

// Actions
export const { getActivities } = driverActivitiesSlice.actions;

// exports
export default driverActivitiesSlice.reducer;
