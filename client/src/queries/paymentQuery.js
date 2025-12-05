import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";
import toast from "react-hot-toast";

const requestApproval = async (data) => {
  const response = await api.post("/payments/request-approval", data);
  return response.data;
};

const fetchPaymentHistory = async (queryParams = {}) => {
  const queryString = new URLSearchParams(queryParams).toString();
  const { data } = await api.get(`/payments/history?${queryString}`);
  return data.data;
};


export const useRequestPaymentApproval = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: requestApproval,
    onSuccess: (data) => {
      toast.success(data.message || "Request sent! Check your email.");
      queryClient.invalidateQueries({ queryKey: ["payment-history"] });
      queryClient.invalidateQueries({ queryKey: ["user"] }); 
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || "Failed to send request";
      toast.error(errorMessage);
    },
  });
};

export const useGetPaymentHistory = (filters = {}) => {
  return useQuery({
    queryKey: ["payment-history", filters],
    queryFn: () => fetchPaymentHistory(filters),
    keepPreviousData: true,
  });
};