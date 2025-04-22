import axios from "axios";

const BASE_URL = "http://localhost:8080/api/v1";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers:{
    "Content-Type": "application/json",
  }
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response.data ? response.data : response
  }
  ,(error) => {
    return Promise.reject(error.response.data)
  }
)