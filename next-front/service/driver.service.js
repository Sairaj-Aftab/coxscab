import axiosInstance from "./url.service";

export const getDriver = async (id) => {
  try {
    const result = await axiosInstance.get(`/driver/getsingle/${id}`);
    return result?.data;
  } catch (error) {
    throw error;
  }
};
