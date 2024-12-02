import axiosInstance from "./url.service";

export const updateUserLocation = async (id, data) => {
  try {
    const result = await axiosInstance.patch(`/auth/user-location/${id}`, data);
    return result?.data;
  } catch (error) {
    throw error;
  }
};
