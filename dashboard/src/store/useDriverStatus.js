import { create } from "zustand";

const useDriverStatus = create((set) => ({
  status: null,
  loader: false,
  setDriverStatus: ({ data, loader }) => {
    set({ status: data, loader });
  },
}));

export default useDriverStatus;
