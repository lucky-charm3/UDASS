import { useState, useEffect, useRef } from 'react';
import { 
  FaFilter, 
  FaSearch, 
  FaSpinner, 
  FaSync, 
  FaUser, 
  FaCheckCircle, 
  FaTimesCircle,
  FaInfoCircle,
  FaTrash,
  FaDownload
} from 'react-icons/fa';
import { format, formatDistanceToNow } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import toast from 'react-hot-toast';
import ProtectedRoute from '../components/ProtectedRoute';

const fetchActivityLogs = async (queryParams = {}) => {
  const queryString = new URLSearchParams(queryParams).toString();
  const { data } = await api.get(`/activityRoutes/activity-logs?${queryString}`);
  return data.data;
};

const exportLogsToCSV = (logs) => {
  const headers = ["Timestamp", "User", "Action", "Description", "Status", "IP Address", "User Agent"];
  
  const rows = logs.map(log => [
    format(new Date(log.createdAt), "yyyy-MM-dd HH:mm:ss"),
    log.userId?.fullName || 'System',
    log.action,
    log.description || '-',
    log.status || 'success',
    log.ip || '-',
    log.userAgent || '-'
  ]);

  const csv = [headers, ...rows].map(row => row.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `activity_logs_${format(new Date(), "yyyy-MM-dd_HH-mm")}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

export default function ActivityLogsPage() {
  const [filters, setFilters] = useState({
    search: '',
    action: '',
    status: '',
    userId: '',
    startDate: '',
    endDate: '',
    page: 1,
    limit: 20
  });

  const [autoRefresh, setAutoRefresh] = useState(false);
  const autoRefreshInterval = useRef(null);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['activity-logs', filters],
    queryFn: () => fetchActivityLogs(filters),
    refetchInterval: autoRefresh ? 10000 : false, // Refresh every 10 seconds if auto-refresh is enabled
  });

  const logs = data?.logs || [];
  const pagination = data?.pagination || {};
  const users = data?.users || [];

  // Set up auto-refresh interval
  useEffect(() => {
    if (autoRefresh) {
      autoRefreshInterval.current = setInterval(() => {
        refetch();
      }, 10000);
    } else {
      if (autoRefreshInterval.current) {
        clearInterval(autoRefreshInterval.current);
      }
    }

    return () => {
      if (autoRefreshInterval.current) {
        clearInterval(autoRefreshInterval.current);
      }
    };
  }, [autoRefresh, refetch]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: key !== 'page' ? 1 : value // Reset to page 1 when changing filters
    }));
  };

  const handleExport = () => {
    if (logs.length === 0) {
      toast.error('No logs to export');
      return;
    }
    exportLogsToCSV(logs);
    toast.success('Logs exported successfully');
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      action: '',
      status: '',
      userId: '',
      startDate: '',
      endDate: '',
      page: 1,
      limit: 20
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <FaCheckCircle className="text-green-500" />;
      case 'error':
        return <FaTimesCircle className="text-red-500" />;
      default:
        return <FaInfoCircle className="text-blue-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const handleClearLogs = async () => {
    if (!window.confirm('Are you sure you want to clear all logs older than 30 days? This action cannot be undone.')) {
      return;
    }

    try {
      await api.delete('/admin/activity-logs/clear');
      toast.success('Old logs cleared successfully');
      refetch();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to clear logs');
    }
  };

  if (isError) {
    return (
      <div className="card p-8 text-center">
        <FaTimesCircle className="text-4xl text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Failed to Load Logs</h2>
        <p className="text-gray-600 mb-4">{error.message}</p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <ProtectedRoute adminOnly>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Activity Logs</h1>
            <p className="text-gray-600 mt-2">Monitor all system activities in real-time</p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${autoRefresh ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}
            >
              <FaSync className={`${autoRefresh ? 'animate-spin' : ''}`} />
              {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
            </button>
            
            <button
              onClick={handleExport}
              disabled={logs.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
            >
              <FaDownload />
              Export
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="card p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FaFilter className="text-gray-500" />
            <h2 className="font-semibold text-gray-700">Filters</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  placeholder="Search logs..."
                  className="w-full p-2 pl-10 border rounded-lg"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Action Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Action
              </label>
              <select
                value={filters.action}
                onChange={(e) => handleFilterChange('action', e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="">All Actions</option>
                <option value="LOGIN">Login</option>
                <option value="LOGOUT">Logout</option>
                <option value="CREATE">Create</option>
                <option value="UPDATE">Update</option>
                <option value="DELETE">Delete</option>
                <option value="EXPORT">Export</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="">All Statuses</option>
                <option value="success">Success</option>
                <option value="error">Error</option>
              </select>
            </div>

            {/* User Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                User
              </label>
              <select
                value={filters.userId}
                onChange={(e) => handleFilterChange('userId', e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="">All Users</option>
                {users.map(user => (
                  <option key={user._id} value={user._id}>
                    {user.fullName} ({user.regNumber})
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date Range
              </label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  className="flex-1 p-2 border rounded-lg"
                />
                <span className="self-center">to</span>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  className="flex-1 p-2 border rounded-lg"
                />
              </div>
            </div>

            {/* Limit */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Items per page
              </label>
              <select
                value={filters.limit}
                onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
                className="w-full p-2 border rounded-lg"
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
          </div>

          <div className="flex justify-between mt-4">
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Clear Filters
            </button>
            
            <button
              onClick={handleClearLogs}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-800"
            >
              <FaTrash />
              Clear Old Logs
            </button>
          </div>
        </div>

        {/* Logs Table */}
        <div className="card overflow-hidden">
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="text-xl font-bold">
              Recent Activities
              {isLoading && (
                <FaSpinner className="animate-spin ml-2 inline" />
              )}
            </h2>
            <div className="text-sm text-gray-500">
              Showing {logs.length} of {pagination.total || 0} logs
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    IP Address
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {isLoading && logs.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-8">
                      <FaSpinner className="animate-spin text-2xl text-primary-500 mx-auto" />
                      <p className="mt-2 text-gray-500">Loading logs...</p>
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-gray-500">
                      No activity logs found
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">
                            {format(new Date(log.createdAt), 'MMM dd, yyyy')}
                          </div>
                          <div className="text-gray-500">
                            {format(new Date(log.createdAt), 'HH:mm:ss')}
                          </div>
                          <div className="text-xs text-gray-400">
                            {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <FaUser className="text-gray-400" />
                          <div>
                            <div className="font-medium">
                              {log.userId?.fullName || 'System'}
                            </div>
                            {log.userId?.regNumber && (
                              <div className="text-sm text-gray-500">
                                {log.userId.regNumber}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <code className="px-2 py-1 bg-gray-100 rounded text-sm font-mono">
                          {log.action}
                        </code>
                      </td>
                      <td className="px-6 py-4 max-w-xs">
                        <div className="text-sm">
                          {log.description || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(log.status)}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(log.status)}`}>
                            {log.status || 'success'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="font-mono">{log.ip || '-'}</div>
                          {log.userAgent && (
                            <div className="text-xs text-gray-500 truncate max-w-xs" title={log.userAgent}>
                              {log.userAgent.substring(0, 50)}...
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="px-6 py-4 border-t flex justify-between items-center">
              <div className="text-sm text-gray-700">
                Page {pagination.currentPage} of {pagination.totalPages}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleFilterChange('page', pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="px-4 py-2 border rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => handleFilterChange('page', pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="px-4 py-2 border rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}