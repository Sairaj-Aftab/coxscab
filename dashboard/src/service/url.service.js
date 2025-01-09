import axios from "axios";

const ApiUrl = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: ApiUrl,
  withCredentials: true,
});

export default axiosInstance;
