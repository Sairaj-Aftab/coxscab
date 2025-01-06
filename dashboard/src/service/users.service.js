import axiosInstance from "./url.service";

export const getAllUsers = async ({ search, status, role, page, limit }) => {
  try {
    const response = await axiosInstance.get(`/user/all-users`, {
      params: { search, status, role, page, limit },
    });

    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const updateUserStatus = async (data) => {
  const { id, status } = data;

  try {
    const response = await axiosInstance.put(`/user/status/${id}`, { status });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
