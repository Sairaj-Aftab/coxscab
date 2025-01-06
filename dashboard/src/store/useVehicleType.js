import { create } from "zustand";

const useVehicleType = create((set) => ({
  types: null,
  loader: false,
  setVehicleTypes: ({ data, loader }) => {
    set({ types: data, loader });
  },
}));

export default useVehicleType;
