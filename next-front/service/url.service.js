import axios from "axios";

const ApiUrl = process.env.NEXT_PUBLIC_API;

const axiosInstance = axios.create({
  baseURL: ApiUrl,
  withCredentials: true,
});

export default axiosInstance;
