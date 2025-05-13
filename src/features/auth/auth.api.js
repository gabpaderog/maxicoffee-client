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

export const forgotPassword = async (email) => {
  try {
    const response = await axiosInstance.post("/auth/forgot_password", { email });
    return handleAuthResponse(response, 'Failed to send password reset email');
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to send password reset email');
  }
}

export const verifyResetPasswordToken = async (token) => {
  try {
    const response = await axiosInstance.get("/auth/reset_password", { params: { token } });
    return handleAuthResponse(response, 'Failed to verify reset password token');
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to verify reset password token');
  }
}

export const resetPassword = async (newPassword, token) => {
  try {
    const response = await axiosInstance.post("/auth/reset_password", { newPassword, token });
    return handleAuthResponse(response, 'Failed to reset password');
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to reset password');
  }
}