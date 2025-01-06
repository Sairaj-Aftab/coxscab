import axiosInstance from "./url.service";

export const getReviews = async ({
  search,
  status,
  typeFilter,
  page = 1,
  limit = 10,
}) => {
  try {
    const response = await axiosInstance.get(`/review/all`, {
      params: { search, status, typeFilter, page, limit },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
// Update Review
export const updateReviewStatus = async (data) => {
  const { id, status } = data;

  try {
    const response = await axiosInstance.put(`/review/status/${id}`, {
      status,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
