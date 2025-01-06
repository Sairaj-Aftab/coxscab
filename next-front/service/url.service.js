import axios from "axios";

const ApiUrl = process.env.NEXT_PUBLIC_API;

const axiosInstance = axios.create({
  baseURL: ApiUrl,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Intercept requests to handle token expiration
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     if (error.response?.status === 401) {
//       try {
//         // Attempt to refresh the token
//         const { data } = await axios.post(
//           `${ApiUrl}/user/auth-refresh`,
//           {},
//           {
//             withCredentials: true,
//           }
//         );
//         console.log("hello ref" + data);

//         axios.defaults.headers.common[
//           "Authorization"
//         ] = `Bearer ${data.accessToken}`;
//         axiosInstance.defaults.headers.common[
//           "Authorization"
//         ] = `Bearer ${data.accessToken}`;
//         error.config.headers["Authorization"] = `Bearer ${data.accessToken}`;
//         return axios(error.config);
//       } catch (refreshError) {
//         console.error("Token refresh failed:", refreshError);
//         // Redirect to login or handle logout
//         window.location.href = "/auth-login";
//       }
//     }
//     return Promise.reject(error);
//   }
// );

export default axiosInstance;
