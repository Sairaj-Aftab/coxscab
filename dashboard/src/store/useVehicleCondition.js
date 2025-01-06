import { create } from "zustand";

const useVehicleCondition = create((set) => ({
  conditions: null,
  loader: false,
  setVehicleConditions: ({ data, loader }) => {
    set({ conditions: data, loader });
  },
}));

export default useVehicleCondition;
