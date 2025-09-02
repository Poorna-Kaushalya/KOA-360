import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.8.102:5000", 
});

// Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
