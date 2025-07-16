const baseURl = "https://gbu-server.vercel.app/api";
// const baseURl = "/api";

const apiRequest = async ({
  url,
  method = "GET",
  body = null,
  bodyStringify = true,
  token = "",
  headers = {},
  setLoading = () => {},
  setError = () => {},
}) => {
  try {
    setLoading(true);
    if (setError) setError(null);

    const isFormData = body instanceof FormData;

    const options = {
      method,
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...headers,
      },
    };

    if (token) {
      options.headers["Authorization"] = `Bearer ${token}`;
    }

    if (body) {
      options.body = bodyStringify && !isFormData ? JSON.stringify(body) : body;
    }

    const response = await fetch(baseURl + url, options);
    const rawText = await response.text();

    let data;
    try {
      data = rawText ? JSON.parse(rawText) : {};
    } catch {
      data = { message: rawText }; // fallback if not valid JSON
    }

    if (!response.ok) {
      return {
        status: "error",
        message: data?.message || `Error ${response.status}`,
        data,
      };
    }

    return {
      status: "success",
      message: "Request successful",
      data,
    };
  } catch (error) {
    return {
      status: "error",
      message: error.message || "Unknown error occurred",
      data: null,
    };
  } finally {
    setLoading(false);
  }
};

export default apiRequest;

// apiRequest.js
// import axios from "axios";
// import axiosRetry from "axios-retry";

// const baseURl = "https://gbu-server.vercel.app/api";
// // const baseURl = "/api";

// // Configure axios instance
// const axiosInstance = axios.create({
//   baseURL: baseURl,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Retry logic: Retry 3 times on network errors or 5xx responses
// axiosRetry(axiosInstance, {
//   retries: 3,
//   retryDelay: axiosRetry.exponentialDelay, // or a custom delay
//   retryCondition: (error) => {
//     // Retry on network error or 5xx errors
//     return axiosRetry.isNetworkOrIdempotentRequestError(error) || error.response?.status >= 500;
//   },
// });

// const apiRequest = async ({
//   url,
//   method = "GET",
//   body = null,
//   bodyStringify = true,
//   token = "",
//   headers = {},
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

//     // GET and DELETE requests shouldn’t send a body
//     if (["GET", "DELETE"].includes(method.toUpperCase())) {
//       delete config.data;
//     }
//     console.log(config);
    
//     const response = await axiosInstance(config);

//     return {
//       status: "success",
//       message: "Request successful",
//       data: response.data,
//     };
//   } catch (error) {
//     const message =
//       error.response?.data?.message ||
//       error.message ||
//       "Unknown error occurred";

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
