import axiosInstance from "./url.service";

export const getGarages = async ({ search, page = 1, limit = 10 }) => {
  try {
    const response = await axiosInstance.get(`/garage`, {
      params: {
        search,
        page,
        limit,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
// Create Driver
export const createGarage = async (data) => {
  try {
    const response = await axiosInstance.post(`/garage`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
// Update Driver
export const updateGarage = async (data) => {
  const { id, ...formData } = data;
  try {
    const response = await axiosInstance.put(`/garage/${id}`, formData);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
// Update Driver
export const deleteGarage = async (id) => {
  try {
    const response = await axiosInstance.delete(`/garage/delete/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
