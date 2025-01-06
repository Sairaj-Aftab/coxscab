import axiosInstance from "./url.service";

export const getVehicles = async ({ typeId, search, page = 1, limit = 10 }) => {
  try {
    const response = await axiosInstance.get(`/vehicle`, {
      params: {
        typeId,
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
// Create Vehicle
export const createVehicle = async (data) => {
  try {
    const response = await axiosInstance.post(`/vehicle`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
// Update Vehicle
export const updateVehicle = async (data) => {
  const { id, ...formData } = data;
  try {
    const response = await axiosInstance.put(`/vehicle/${id}`, formData);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
// Delete Vehicle
export const deleteVehicle = async (id) => {
  try {
    const response = await axiosInstance.delete(`/vehicle/delete/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
/**
 * Vehicle Condition
 */
// Get all vehicle conditions
export const getVehicleConditions = async () => {
  try {
    const response = await axiosInstance.get(`/vehicle-condition`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
// Create Vehicle Condition
export const createVehicleCondition = async (data) => {
  try {
    const response = await axiosInstance.post(`/vehicle-condition`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
/**
 * Vehicle Type
 */
// Get all vehicle conditions
export const getVehicleTypes = async () => {
  try {
    const response = await axiosInstance.get(`/vehicle-type`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
// Create Vehicle Condition
export const createVehicleType = async (data) => {
  try {
    const response = await axiosInstance.post(`/vehicle-type`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
