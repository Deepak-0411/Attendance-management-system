import { toast } from "react-toastify";
import { navigateTo } from "./navigation";
import { triggerOfflineHandler } from "./offlineHandler";

const baseURL = "https://ams-gbu.up.railway.app";

const defaultConfig = {
  method: "GET",
  body: null,
  bodyStringify: true,
  headers: {},
  credentials: true,
  retryConfig: { retries: 2, delay: 1000, backoff: true },
  setLoading: () => {},
  setError: () => {},
  onSuccess: () => {},
  onFailure: () => {},
  onComplete: () => {},
};

//  token expiry handler
const handleTokenExpiry = (message) => {
  if (message?.toLowerCase().includes("token")) {
    toast.info("Session Expired. Please re-login");
    const currentPath = window.location.pathname;
    if (!["/admin/login", "/faculty/login"].includes(currentPath)) {
      navigateTo(
        currentPath.startsWith("/admin") ? "/admin/login" : "/faculty/login"
      );
    }
  }
};

const shouldRetry = (error) => {
  // Network-level errors
  if (error.name === "TypeError" || error.message === "Failed to fetch") {
    return true;
  }

  // Retry only on server 5xx errors
  if (error?.status >= 500 && error?.status < 600) {
    return true;
  }

  return false;
};

const retryWithBackoff = async (
  fn,
  { retries, delay, backoff },
  attempt = 0
) => {
  try {
    return await fn();
  } catch (err) {
    if (shouldRetry(err) && attempt < retries) {
      const wait = backoff ? delay * 2 ** attempt : delay;
      await new Promise((res) => setTimeout(res, wait));
      return retryWithBackoff(fn, { retries, delay, backoff }, attempt + 1);
    }
    throw err;
  }
};

//  response parser
const parseResponse = async (response) => {
  const rawText = await response.text();
  try {
    return rawText ? JSON.parse(rawText) : {};
  } catch {
    return { message: rawText };
  }
};

const apiRequest = async (userConfig) => {
  const config = { ...defaultConfig, ...userConfig };
  const {
    url,
    method,
    body,
    bodyStringify,
    headers,
    credentials,
    retryConfig,
    setLoading,
    setError,
    onSuccess,
    onFailure,
    onComplete,
  } = config;

  const fetchFn = async () => {
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
    const data = await parseResponse(response);

    if (!response.ok) {
      handleTokenExpiry(data?.message);
      throw {
        status: response.status,
        message: data?.message || data.error || "Request failed",
        data,
      };
    }

    return {
      status: "success",
      statusCode: response.status,
      message: "Request successful",
      data,
    };
  };

  try {
    const result = await retryWithBackoff(fetchFn, retryConfig);
    onSuccess?.(result);
    return result;
  } catch (error) {
    // Offline handling
    if (!navigator.onLine) {
      const handler = triggerOfflineHandler();
      handler?.trigger?.();
      if (handler?.retry) {
        handler.retryFn = () => apiRequest(userConfig);
      }
      const offlineResp = {
        status: "offline",
        statusCode: 0,
        message: "No Internet connection",
        data: null,
      };
      onFailure?.(offlineResp);
      return offlineResp;
    }

    const errResp = {
      status: "error",
      statusCode: error?.status || 500,
      message: error?.message || "Network error",
      data: error?.data || null,
    };

    setError(errResp.message);
    onFailure?.(errResp);
    return errResp;
  } finally {
    setLoading(false);
    onComplete?.();
  }
};

export { apiRequest, baseURL };

// code 1

// import { toast } from "react-toastify";
// import { navigateTo } from "./navigation";
// import { triggerOfflineHandler } from "./offlineHandler";

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
//       toast.info(`Session Expired. Please re-login`);
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
//       return {
//         status: "error",
//         statusCode: response.status,
//         message: data?.message,
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
//     // offline handling
//     if (!navigator.onLine) {
//       const handler = triggerOfflineHandler();
//       if (handler?.trigger) handler.trigger();
//       if (handler?.retry)
//         handler.retryFn = () =>
//           apiRequest({
//             url,
//             method,
//             body,
//             bodyStringify,
//             headers,
//             credentials,
//             setLoading,
//             setError,
//           });
//       return {
//         status: "offline",
//         statusCode: 0,
//         message: "No Internet connection",
//         data: null,
//       };
//     }
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

// code 2

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
