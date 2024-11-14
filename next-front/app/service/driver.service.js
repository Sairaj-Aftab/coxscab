import axiosInstance from "./url.service";

export const getDriver = async (id) => {
  try {
    const result = await axiosInstance.get(`/driver/getsingle/${id}`);
    console.log("Raw Response Data:", result?.data);
    return result?.data;
  } catch (error) {
    console.error("Error in getDriver:", {
      message: error.message,
      code: error.code,
      response: error.response,
      config: error.config,
    });
    throw error;
  }
};