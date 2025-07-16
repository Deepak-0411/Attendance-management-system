// axiosInstance.js

import axios from "axios";
import axiosRetry from "axios-retry";

// Create an axios instance
const axiosInstance = axios.create({
  baseURL: "https://gbu-server.vercel.app/api", // Change if needed
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Optional: Automatic retry on network or server errors
axiosRetry(axiosInstance, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) =>
    axiosRetry.isNetworkOrIdempotentRequestError(error) ||
    error.response?.status >= 500,
});

// ✅ Interceptor: Global error handler
axiosInstance.interceptors.response.use(
  (response) => response, // pass successful response
  (error) => {
    const status = error.response?.status;

    if (!error.response) {
      console.error("❌ Network error: No response received.");
      // Optional: show toast
      // toast.error("Network error: Please check your connection.");
    } else if (status === 401) {
      console.warn("⚠️ Unauthorized: Redirecting to login...");
      window.location.href = "/login"; // or use router if you're in React
    } else if (status === 403) {
      console.warn("❌ Forbidden access.");
      // Optional: toast.error("You do not have permission to access this.");
    } else if (status >= 500) {
      console.error("🔥 Server error:", error.response?.data?.message || "Unknown");
      // Optional: toast.error("Server error. Please try again later.");
    }

    return Promise.reject(error); // Let caller handle it if needed
  }
);

export default axiosInstance;




// apiRequest.js

// import axiosInstance from "./axiosInstance";

// const apiRequest = async ({
//   url,
//   method = "GET",
//   body = null,
//   token = "",
//   headers = {},
//   bodyStringify = true,
//   setLoading = () => {},
//   setError = () => {},
// }) => {
//   try {
//     setLoading(true);
//     if (setError) setError(null);

//     const isFormData = body instanceof FormData;

//     const config = {
//       url,
//       method,
//       headers: {
//         ...(isFormData ? {} : { "Content-Type": "application/json" }),
//         ...headers,
//       },
//       data: bodyStringify && !isFormData ? JSON.stringify(body) : body,
//     };

//     if (token) {
//       config.headers["Authorization"] = `Bearer ${token}`;
//     }

//     // Axios doesn't support sending body in GET/DELETE
//     if (["GET", "DELETE"].includes(method.toUpperCase())) {
//       delete config.data;
//     }

//     const response = await axiosInstance(config);

//     return {
//       status: "success",
//       message: "Request successful",
//       data: response.data,
//     };
//   } catch (error) {
//     const message =
//       error.response?.data?.message || error.message || "Unknown error occurred";

//     return {
//       status: "error",
//       message,
//       data: error.response?.data || null,
//     };
//   } finally {
//     setLoading(false);
//   }
// };

// export default apiRequest;
