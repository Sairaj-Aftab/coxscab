import axiosInstance from "./url.service";

export const getDrivers = async ({ typeId, search, page = 1, limit = 10 }) => {
  try {
    const response = await axiosInstance.get(`/driver`, {
      params: { typeId, search, page, limit },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
// Create Driver
export const createDriver = async (data) => {
  try {
    const response = await axiosInstance.post(`/driver`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
// Update Driver
export const updateDriver = async (data) => {
  const { id, formData } = data;

  try {
    const response = await axiosInstance.put(`/driver/${id}`, formData);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
// Delete Driver
export const deleteDriver = async (id) => {
  try {
    const response = await axiosInstance.delete(`/driver/delete/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

// Driver Activities
// Get Driver Activities
export const getDriverActivities = async () => {
  try {
    const response = await axiosInstance.get(`/driver-activities`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
// Create Driver
export const createDriverActivitie = async (data) => {
  try {
    const response = await axiosInstance.post(`/driver-activities`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

/**
 * Driver Status
 */
// Get Driver Status
export const getDriverStatus = async () => {
  try {
    const response = await axiosInstance.get(`/driver-status`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

// Create Driver Status
export const createDriverStatus = async (data) => {
  try {
    const response = await axiosInstance.post(`/driver-status`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
