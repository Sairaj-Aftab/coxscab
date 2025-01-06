import axiosInstance from "./url.service";

export const getPackages = async ({ typeId, search, page = 1, limit = 10 }) => {
  try {
    const response = await axiosInstance.get(`/package/get-all`, {
      params: { typeId, search, page, limit },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
// Create Package
export const createPackage = async (data) => {
  try {
    const response = await axiosInstance.post(`/package`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
// Update Package
export const updatePackage = async (data) => {
  const { id, formData } = data;

  try {
    const response = await axiosInstance.put(`/package/update/${id}`, formData);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
// Delete Package
export const deletePackage = async (id) => {
  try {
    const response = await axiosInstance.delete(`/package/delete/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
