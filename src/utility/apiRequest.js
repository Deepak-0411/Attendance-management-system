// src/utils/apiRequest.js
import { navigateTo } from "./navigation";
import { triggerOfflineHandler } from "./offlineHandler";

const baseURL = "https://ams-gbu.up.railway.app";

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
  const redirectToLogin = (message) => {
    const currentPath = window.location.pathname;
    const loginPaths = ["/admin/login", "/faculty/login"];

    if (message?.toLowerCase().includes("token")) {
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
    setError(null);

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

    const response = await fetch(baseURL + url, options);
    const rawText = await response.text();
    let data;

    try {
      data = rawText ? JSON.parse(rawText) : {};
    } catch {
      data = { message: rawText };
    }

    if (!response.ok) {
      return {
        status: "error",
        statusCode: response.status,
        message: data?.message,
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
    // offline handling
    if (!navigator.onLine) {
      const handler = triggerOfflineHandler();
      if (handler?.trigger) handler.trigger(); // show offline page
      if (handler?.retry)
        handler.retryFn = () =>
          apiRequest({
            url,
            method,
            body,
            bodyStringify,
            headers,
            credentials,
            setLoading,
            setError,
          });
    }

    return {
      status: "offline",
      statusCode: 0,
      message: "No Internet connection",
      data: null,
    };
  } finally {
    setLoading(false);
  }
};

export { apiRequest, baseURL };

// import { navigateTo } from "./navigation";

// const baseURL = "https://ams-gbu.up.railway.app";

// const apiRequest = async ({
//   url,
//   method = "GET",
//   body = null,
//   bodyStringify = true,
//   headers = {},
//   credentials = true,
//   setLoading = () => {},
//   setError = () => {},
// }) => {
//   const redirectToLogin = (message) => {
//     const currentPath = window.location.pathname;
//     const loginPaths = ["/admin/login", "/faculty/login"];

//     if (message?.toLowerCase().includes("token")) {
//       if (!loginPaths.includes(currentPath)) {
//         if (currentPath.startsWith("/admin")) {
//           navigateTo("/admin/login");
//         } else {
//           navigateTo("/faculty/login");
//         }
//       }
//     }
//   };

//   try {
//     setLoading(true);
//     setError(null);

//     const isFormData = body instanceof FormData;

//     const options = {
//       method,
//       ...(credentials && { credentials: "include" }),
//       headers: {
//         ...(isFormData ? {} : { "Content-Type": "application/json" }),
//         ...headers,
//       },
//       ...(body && {
//         body: bodyStringify && !isFormData ? JSON.stringify(body) : body,
//       }),
//     };

//     const response = await fetch(baseURL + url, options);
//     const rawText = await response.text();

//     let data;
//     try {
//       data = rawText ? JSON.parse(rawText) : {};
//     } catch {
//       data = { message: rawText };
//     }

//     if (!response.ok) {
//       redirectToLogin(data.message);
//       return {
//         status: "error",
//         statusCode: response.status,
//         message: data?.message || data?.error || `${response.status}`,
//         data,
//       };
//     }

//     return {
//       status: "success",
//       statusCode: response.status,
//       message: "Request successful",
//       data,
//     };
//   } catch (error) {
//     redirectToLogin(error.message);
//     return {
//       status: "error",
//       statusCode: error?.status || 500,
//       message: error?.message || error?.error || "Network error",
//       data: null,
//     };
//   } finally {
//     setLoading(false);
//   }
// };

// export { apiRequest, baseURL };

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
