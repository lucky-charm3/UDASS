import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api"; 
import toast from "react-hot-toast";

const fetchAllStudents = async (queryParams) => {
  const queryString = new URLSearchParams(queryParams).toString();
  
  const url = `/students?${queryString}`; 
  
  const { data } = await api.get(url); 
  return data.data; 
};

const fetchAdminStats = async () => {
  const { data } = await api.get(`/students/stats`);
  return data.data; 
};

const fetchStudentById = async (studentId) => {
  const { data } = await api.get(`/students/${studentId}`);
  return data.data;
};

export const useGetAllStudents = () => {
  return useQuery({
    queryKey: ["all-students"],
    queryFn: fetchAllStudents,
    staleTime: 1000 * 60 * 5, 
    keepPreviousData: true
  });
};

export const useGetAdminStats = () => {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: fetchAdminStats,
    staleTime: 1000 * 60 * 10, 
  });
};

export const useGetStudentById = (studentId) => {
  return useQuery({
    queryKey: ['student', studentId],
    queryFn: () => fetchStudentById(studentId),
    enabled: !!studentId,
  });
};

export const useCreateStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newStudentData) => {
      return api.post(`/students`, newStudentData); 
    },
    onSuccess: () => {
      toast.success("New member added successfully! ");
      queryClient.invalidateQueries({ queryKey: ["all-students"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    },
    onError: (err) => {
      const errorMessage = err.response?.data?.message || "Failed to add member.";
      toast.error(errorMessage);
    },
  });
};


export const useDeleteStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (studentId) => {
      return api.delete(`/students/${studentId}`);
    },
    onSuccess: () => {
      toast.success("Member deleted! ");
      queryClient.invalidateQueries({ queryKey: ["all-students"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    },
    onError: (err) => {
      const errorMessage = err.response?.data?.message || "Failed to delete member.";
      toast.error(errorMessage);
    },
  });
};

export const useUpdateStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updateData }) => {
      return api.patch(`/students/${id}`, updateData);
    },
    onSuccess: () => {
      toast.success("Member details updated! ");
      queryClient.invalidateQueries({ queryKey: ["all-students"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    },
    onError: (err) => {
      const errorMessage = err.response?.data?.message || "Failed to update member.";
      toast.error(errorMessage);
    },
  });
};