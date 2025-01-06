import { create } from "zustand";
import { persist } from "zustand/middleware";
import axiosInstance from "@/service/url.service";

export const useAuthUser = create(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null, // Stores the user data
      accessToken: null, // Stores the access token
      error: null,
      loader: false,
      message: null,

      // Set Loader
      setLoader: (state) => set({ loader: state }),

      // Set Error
      setError: (error) => set({ error }),

      // Set Message
      setMessage: (message) => set({ message }),

      // Login Function
      setLogin: (data) => {
        set({
          isAuthenticated: true,
          user: data.user,
          accessToken: data.user?.accessToken,
          message: "Login successful!",
        });
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${data.user?.accessToken}`;
      },

      // Fetch Logged-In User
      setLogedInUser: async () => {
        set({ loader: true, error: null, message: null });
        try {
          const response = await axiosInstance.get("/user/user");

          set({ isAuthenticated: true, user: response.data });
        } catch (error) {
          throw error;
        } finally {
          set({ loader: false });
        }
      },

      // Refresh Access Token
      refreshAccessToken: async () => {
        set({ loader: true, error: null, message: null });
        try {
          const response = await axiosInstance.post("/user/auth-refresh");

          set({ accessToken: response.data.accessToken });
          axiosInstance.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${response.data.accessToken}`;
          await get().setLogedInUser(); // Fetch user after token refresh
        } catch (error) {
          throw error;
        } finally {
          set({ loader: false });
        }
      },
      setLogOut: () => {
        localStorage.removeItem("auth-user");
        set({
          isAuthenticated: false,
          user: null,
          accessToken: null,
        });
      },
    }),
    {
      name: "auth-user", // Key in localStorage
      storage: {
        getItem: (key) => JSON.parse(localStorage.getItem(key)),
        setItem: (key, value) =>
          localStorage.setItem(key, JSON.stringify(value)),
        removeItem: (key) => localStorage.removeItem(key),
      }, // Can also use sessionStorage
    }
  )
);
