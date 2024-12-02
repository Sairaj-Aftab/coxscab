import axiosInstance from "./url.service";

export const createReview = async (data) => {
  try {
    const result = await axiosInstance.post(`/review`, data);
    return result?.data;
  } catch (error) {
    throw error;
  }
};
