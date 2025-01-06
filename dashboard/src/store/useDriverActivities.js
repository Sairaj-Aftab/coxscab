import { create } from "zustand";

const useDriverActivities = create((set) => ({
  activities: null,
  loader: false,
  setActivities: ({ data, loader }) => {
    set({ activities: data, loader });
  },
}));

export default useDriverActivities;
