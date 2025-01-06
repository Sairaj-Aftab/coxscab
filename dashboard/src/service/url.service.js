import axios from "axios";

const ApiUrl = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: ApiUrl,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default axiosInstance;
