import { create } from "zustand";

const useUsers = create((set) => ({
  onlineUsers: [],
  loader: false,
  setOnlineUsers: (data) => {
    set({ onlineUsers: data });
  },
}));

export default useUsers;
