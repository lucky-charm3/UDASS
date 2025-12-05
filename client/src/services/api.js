import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log("Outgoing request ",config);
  return config;
},
(error)=>{
  console.error(error.message)
  return Promise.reject(error);
}
);

api.interceptors.response.use(
  (response) => {
    console.log("Incoming response ",response);
    return response;
  },
  (error) => {
    const message = error.response?.data?.message || "Something went wrong";
    console.error(message);
    return Promise.reject(error);
  }
);

export default api;