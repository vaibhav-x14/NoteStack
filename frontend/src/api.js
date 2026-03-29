import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5050/api", // ✅ correct port
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;