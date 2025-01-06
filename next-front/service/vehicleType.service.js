import axiosInstance from "./url.service";

export const getVehicleTypes = async () => {
  try {
    const response = await axiosInstance.get(`/vehicle-type`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
