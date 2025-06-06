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
