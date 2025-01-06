import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

const useAuth = create(
  persist(
    (set) => ({
      isAuthenticated: false,
      auth: null,
      loader: false,
      message: null,
      error: null,

      setAuthMessageEmpty: () => {
        set({ loader: false, message: null, error: null });
      },

      setLogin: async (data) => {
        set({ loader: true, error: null, message: null });
        try {
          const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/auth/login`,
            data,
            { withCredentials: true }
          );
          set({
            isAuthenticated: true,
            auth: response?.data.user,
          });
        } catch (error) {
          set({
            error: error.response?.data?.message,
            auth: null,
          });
        } finally {
          set({ loader: false });
        }
      },

      setLogedInUser: async () => {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/auth/me`,
            {
              withCredentials: true,
            }
          );
          set({ isAuthenticated: true, auth: response.data });
        } catch (error) {
          set({
            isAuthenticated: false,
            auth: null,
          });
        } finally {
          set({ loader: false });
        }
      },

      setLogout: async () => {
        set({ loader: true, error: null });
        try {
          await axios.post(`${import.meta.env.VITE_API_URL}/auth/logout`, "", {
            withCredentials: true,
          });
          set({ isAuthenticated: false, auth: null });
          localStorage.removeItem("auth-user");
          // eslint-disable-next-line no-undef
          setAuthMessageEmpty();
        } catch (error) {
          set({
            error: error.response?.data?.message,
          });
        } finally {
          set({ loader: false });
        }
      },
    }),
    {
      name: "auth-user", // Key under which the state will be saved in localStorage
      storage: {
        getItem: (key) => JSON.parse(localStorage.getItem(key)),
        setItem: (key, value) =>
          localStorage.setItem(key, JSON.stringify(value)),
        removeItem: (key) => localStorage.removeItem(key),
      }, // Can also use sessionStorage
    }
  )
);

export default useAuth;
