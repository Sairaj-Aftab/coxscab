import axiosInstance from "./url.service";

export const getVehicleCharts = async () => {
  try {
    const response = await axiosInstance.get(`/chart/vehicle`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
export const getDriverCharts = async () => {
  try {
    const response = await axiosInstance.get(`/chart/driver`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
