import axiosInstance from "./url.service";

export const registerUser = async (data) => {
  try {
    const result = await axiosInstance.post(`/auth/register-user`, data);
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
    const result = await axiosInstance.post(`/auth/send-otp`, data);
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
    const result = await axiosInstance.post(`/auth/login-user`, data);
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
    const result = await axiosInstance.get(`/auth/user`);
    return result?.data;
  } catch (error) {
    throw error;
  }
};
export const logOut = async (id) => {
  try {
    const result = await axiosInstance.post(`/auth/logout-user/${id}`);
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
