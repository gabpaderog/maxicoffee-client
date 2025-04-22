import { axiosInstance } from "../../config/axios";

const handleAuthResponse = (response, errorMessage) => {
  // Axios does not have an 'ok' property; errors throw exceptions
  if (!response || response.status < 200 || response.status >= 300) {
    throw new Error(errorMessage);
  }
  return response;
};

export const signIn = async (credentials) => {
  try {
    const response = await axiosInstance.post("/auth/login", credentials );
    return handleAuthResponse(response, 'Failed to sign in');
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to sign in');
  }
};

export const signUp = async (credentials) => {
  try {
    const response = await axiosInstance.post("/auth/register", credentials);
    return handleAuthResponse(response, 'Failed to sign up');
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to sign up');
  }
};