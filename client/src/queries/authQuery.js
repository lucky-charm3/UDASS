import { useMutation } from "@tanstack/react-query";
import api from "../services/api";
import toast from "react-hot-toast";

const forgotPasswordRequest = async (email) => {
  const { data } = await api.post("/auth/forgotPassword", { email });
  return data;
};

const resetPasswordRequest = async ({ token, password }) => {
  const { data } = await api.patch(`/auth/resetPassword/${token}`, { password });
  return data;
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: forgotPasswordRequest,
    onSuccess: (data) => {
      toast.success(data.message || "Reset link sent to your email");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to send email");
    },
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: resetPasswordRequest,
    onSuccess: (data) => {
      toast.success(data.message || "Password reset successfully! Please login.");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to reset password");
    },
  });
};