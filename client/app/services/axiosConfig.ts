import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.PORT ?? "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});


export default axiosInstance;
