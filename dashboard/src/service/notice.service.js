import axiosInstance from "./url.service";

export const getNotices = async () => {
  try {
    const response = await axiosInstance.get(`/notice`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

// Create Notice
export const createNotice = async (data) => {
  try {
    const response = await axiosInstance.post(`/notice`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

// Update Notice
export const updateNotice = async (data) => {
  const { id, formData } = data;

  try {
    const response = await axiosInstance.put(`/notice/update/${id}`, formData);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
