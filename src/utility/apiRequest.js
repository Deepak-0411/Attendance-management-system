import { navigateTo } from "./navigation";
const baseURl = "https://ams-gbu.up.railway.app";
// const baseURl = "/api";

const apiRequest = async ({
  url,
  method = "GET",
  body = null,
  bodyStringify = true,
  headers = {},
  credentials = true,
  setLoading = () => {},
  setError = () => {},
}) => {
  const redirectTOLogin = (message) => {
    const currentPath = window.location.pathname;
    const loginPaths = ["/admin/login", "/faculty/login"];

    if (message === "No token provided.") {
      if (!loginPaths.includes(currentPath)) {
        if (currentPath.startsWith("/admin")) {
          navigateTo("/admin/login");
        } else {
          navigateTo("/faculty/login");
        }
      }
    }
  };

  try {
    setLoading(true);
    if (setError) setError(null);

    const isFormData = body instanceof FormData;

    const options = {
      method,
      ...(credentials && { credentials: "include" }),
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...headers,
      },
      ...(body && {
        body: bodyStringify && !isFormData ? JSON.stringify(body) : body,
      }),
    };

    const response = await fetch(baseURl + url, options);
    const rawText = await response.text();

    let data;
    try {
      data = rawText ? JSON.parse(rawText) : {};
    } catch {
      data = { message: rawText }; // fallback if not valid JSON
    }

    if (!response.ok) {
      redirectTOLogin(data.message);
      return {
        status: "error",
        statusCode: response.status,
        message: data?.message || data?.error || `${response.status}`,
        data,
      };
    }

    return {
      status: "success",
      statusCode: response.status,
      message: "Request successful",
      data,
    };
  } catch (error) {
    redirectTOLogin(error.message);
    return {
      status: "error",
      statusCode: response.status,
      message: error?.message || error?.error || `${response.status}`,
      data: null,
    };
  } finally {
    setLoading(false);
  }
};

export { apiRequest, baseURl };

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
