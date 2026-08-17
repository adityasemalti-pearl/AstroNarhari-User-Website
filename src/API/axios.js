import axios from "axios";

const api = axios.create({
  baseURL: "https://api.namahastro.com/api",
  timeout: 40000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ===============================
// Request Interceptor
// ===============================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ===============================
// Response Interceptor
// ===============================
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.log("Unauthorized");
          break;

        case 403:
          console.log("Forbidden");
          break;

        case 404:
          console.log("API Not Found");
          break;

        case 500:
          console.log("Server Error");
          break;

        default:
          console.log(error.response.data?.message);
      }
    }

    return Promise.reject(error);
  }
);

export default api;