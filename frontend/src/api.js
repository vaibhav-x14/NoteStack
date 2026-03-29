import axios from "axios";

const API = axios.create({
  baseURL: "https://notestack-v7ns.onrender.com/api",
});

// OPTIONAL: token automatically attach karega (pro feature)
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
