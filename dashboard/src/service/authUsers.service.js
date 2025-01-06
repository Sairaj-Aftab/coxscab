import axiosInstance from "./url.service";

export const getAuthUsers = async () => {
  try {
    const response = await axiosInstance.get(`/auth`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
// Create Admin Auth user
export const createAuth = async (data) => {
  try {
    const response = await axiosInstance.post(`/auth`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
// Update Admin Auth
export const updateAuth = async ({ id, data }) => {
  try {
    const response = await axiosInstance.put(`/auth/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
