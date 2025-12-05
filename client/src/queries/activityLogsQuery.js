import { useQuery } from "@tanstack/react-query";
import api from "../services/api";

const fetchActivityLogs = async (queryParams = {}) => {
  const queryString = new URLSearchParams(queryParams).toString();
  const { data } = await api.get(`/activityRoutes/activity-logs?${queryString}`);
  return data.data;
};

export const useGetActivityLogs = (filters = {}) => {
  return useQuery({
    queryKey: ['activity-logs', filters],
    queryFn: () => fetchActivityLogs(filters),
    refetchInterval: 30000,
    staleTime: 1000 * 10, 
  });
};

export const useClearOldLogs = () => {
  const clearOldLogs = async () => {
    const { data } = await api.delete('/activityRoutes/activity-logs/clear');
    return data;
  };

  return clearOldLogs;
};