import axiosInstance from "./url.service";

export const getPackages = async ({ limit = 10 }) => {
  try {
    const response = await axiosInstance.get(`/package/get-all`, {
      params: { limit },
    });

    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
