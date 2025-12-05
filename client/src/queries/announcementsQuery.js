// queries/announcementsQuery.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";
import toast from "react-hot-toast";

// Fetch all announcements
const fetchAnnouncements = async (queryParams = {}) => {
  // FIX: Filter out empty strings, null, or undefined values
  const cleanParams = Object.fromEntries(
    Object.entries(queryParams).filter(([_, value]) => value !== '' && value != null)
  );

  const queryString = new URLSearchParams(cleanParams).toString();
  
  // Now calls /announcements?page=1&limit=10 (without category=)
  const { data } = await api.get(`/announcements?${queryString}`); 
  return data.data;
};


// Fetch dashboard announcements
const fetchDashboardAnnouncements = async () => {
  const { data } = await api.get('/announcements/dashboard');
  return data.data;
};

// Fetch single announcement
const fetchAnnouncement = async (id) => {
  const { data } = await api.get(`/announcements/${id}`);
  return data.data;
};

// Create announcement
const createAnnouncement = async (announcementData) => {
  const { data } = await api.post('/announcements', announcementData);
  return data;
};

// Update announcement
const updateAnnouncement = async ({ id, updateData }) => {
  const { data } = await api.put(`/announcements/${id}`, updateData);
  return data;
};

// Delete announcement
const deleteAnnouncement = async (id) => {
  const { data } = await api.delete(`/announcements/${id}`);
  return data;
};

// React Query Hooks
export const useGetAnnouncements = (filters = {}) => {
  return useQuery({
    queryKey: ['announcements', filters],
    queryFn: () => fetchAnnouncements(filters),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useGetDashboardAnnouncements = () => {
  return useQuery({
    queryKey: ['dashboard-announcements'],
    queryFn: fetchDashboardAnnouncements,
    refetchInterval: 30000, // Auto-refresh every 30 seconds
    staleTime: 1000 * 30, // 30 seconds
  });
};

export const useGetAnnouncement = (id, options = {}) => {
  return useQuery({
    queryKey: ['announcement', id],
    queryFn: () => fetchAnnouncement(id),
    enabled: !!id,
    ...options
  });
};

export const useCreateAnnouncement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAnnouncement,
    onSuccess: (data) => {
      toast.success(data.message || "Announcement created successfully");
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-announcements'] });
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || "Failed to create announcement";
      const validationErrors = error.response?.data?.errors;
      
      if (validationErrors) {
        validationErrors.forEach(err => {
          toast.error(`${err.field}: ${err.message}`);
        });
      } else {
        toast.error(errorMessage);
      }
    }
  });
};

export const useUpdateAnnouncement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAnnouncement,
    onSuccess: (data) => {
      toast.success(data.message || "Announcement updated successfully");
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-announcements'] });
      queryClient.invalidateQueries({ queryKey: ['announcement'] });
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || "Failed to update announcement";
      const validationErrors = error.response?.data?.errors;
      
      if (validationErrors) {
        validationErrors.forEach(err => {
          toast.error(`${err.field}: ${err.message}`);
        });
      } else {
        toast.error(errorMessage);
      }
    }
  });
};

export const useDeleteAnnouncement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAnnouncement,
    onSuccess: (data) => {
      toast.success(data.message || "Announcement deleted successfully");
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-announcements'] });
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || "Failed to delete announcement";
      toast.error(errorMessage);
    }
  });
};

export const useMarkAsViewed = () => {
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await api.get(`/announcements/${id}?incrementView=true`);
      return data.data;
    }
  });
};