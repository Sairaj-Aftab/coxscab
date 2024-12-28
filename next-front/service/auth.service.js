import axiosInstance from "./url.service";

export const registerUser = async (data) => {
  try {
    const result = await axiosInstance.post(`/user/register-user`, data);
    if (result?.data?.user) {
      const expirationTime = new Date(result.data.user.otpExpiresAt).getTime();
      const phoneNumber = result.data.user.phone;

      // Save phone number to localStorage
      localStorage.setItem(
        "phone",
        JSON.stringify({ phone: phoneNumber, expiresAt: expirationTime })
      );
    }
    return result?.data;
  } catch (error) {
    throw error;
  }
};
export const sendLoginOTP = async (data) => {
  try {
    const result = await axiosInstance.post(`/user/send-otp`, data);
    if (result?.data?.user) {
      const expirationTime = new Date(result.data.user.otpExpiresAt).getTime();
      const phoneNumber = result.data.user.phone;

      // Save phone number to localStorage
      localStorage.setItem(
        "phone",
        JSON.stringify({ phone: phoneNumber, expiresAt: expirationTime })
      );
    }
    return result?.data;
  } catch (error) {
    throw error;
  }
};
export const loginUser = async (data) => {
  try {
    const result = await axiosInstance.post(`/user/login-user`, data);
    if (result?.data?.user) {
      localStorage.removeItem("phone");
    }
    return result?.data;
  } catch (error) {
    throw error;
  }
};
export const logedInUser = async () => {
  try {
    const result = await axiosInstance.get(`/user/user`);
    return result?.data;
  } catch (error) {
    throw error;
  }
};
export const logOut = async (id, data) => {
  try {
    const result = await axiosInstance.post(`/user/logout-user/${id}`, data);
    if (result.data) {
      delete axiosInstance.defaults.headers.common["Authorization"];
      // Clear localStorage for this store
      localStorage.removeItem("auth-user");
    }
    return result?.data;
  } catch (error) {
    throw error;
  }
};
