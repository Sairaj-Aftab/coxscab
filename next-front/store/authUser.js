import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import axiosInstance from "@/service/url.service";

export const useAuthUser = create(
  devtools(
    persist(
      (set, get) => ({
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

            set({ user: response.data });
          } catch (error) {
            set({
              error: error.response?.data.message || "Failed to fetch user",
            });
            if (error.response?.status === 401) {
              await get().refreshAccessToken();
            }
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
            set({
              error: "Failed to refresh token",
            });
            // get().logout(); // Logout if token refresh fails
          } finally {
            set({ loader: false });
          }
        },
        setLogOut: () => {
          localStorage.removeItem("auth-user");
          set({
            user: null,
            accessToken: null,
          });
        },
      }),
      {
        name: "auth-user", // Key in localStorage
        getAuthStorage: () => localStorage, // Use localStorage for persistence
      }
    ),
    {
      name: "Auth User",
    }
  )
);
