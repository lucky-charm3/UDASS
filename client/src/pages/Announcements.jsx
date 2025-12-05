import { useState, useEffect } from 'react';
import { 
  FaBullhorn, 
  FaPlus, 
  FaSearch, 
  FaFilter, 
  FaCalendarAlt,
  FaExclamationTriangle,
  FaInfoCircle,
  FaEye,
  FaEdit,
  FaTrash,
  FaSpinner,
  FaClock,
  FaTag,
  FaUser,
  FaSort,
  FaSortUp,
  FaSortDown
} from 'react-icons/fa';
import { format, formatDistanceToNow } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import AnnouncementModal from '../components/AnnouncementModal';
import {
  useGetAnnouncements,
  useGetDashboardAnnouncements,
  useDeleteAnnouncement,
  useMarkAsViewed
} from '../queries/announcementsQuery';

const priorityColors = {
  urgent: 'bg-red-100 text-red-800 border-red-200',
  high: 'bg-orange-100 text-orange-800 border-orange-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  low: 'bg-blue-100 text-blue-800 border-blue-200'
};

const categoryIcons = {
  general: FaBullhorn,
  event: FaCalendarAlt,
  payment: FaInfoCircle,
  emergency: FaExclamationTriangle,
  academic: FaInfoCircle,
  other: FaTag
};

export default function Announcements() {
  const { user } = useAuth();
  
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    category: '',
    priority: '',
    search: '',
    sortBy: 'publishedAt',
    sortOrder: 'desc'
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [searchInput, setSearchInput] = useState('');

  const { data, isLoading, error, refetch } = useGetAnnouncements(filters);
  const { data: dashboardData } = useGetDashboardAnnouncements();
  const deleteMutation = useDeleteAnnouncement();
  const markAsViewed = useMarkAsViewed();

  const announcements = data?.announcements || [];
  const pagination = data?.pagination || {};
  const dashboardAnnouncements = dashboardData || [];

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: key !== 'page' ? 1 : value
    }));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handleFilterChange('search', searchInput);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);


  const handleSort = (field) => {
    setFilters(prev => ({
      ...prev,
      sortBy: field,
      sortOrder: prev.sortBy === field && prev.sortOrder === 'desc' ? 'asc' : 'desc'
    }));
  };

  const handleViewAnnouncement = async (announcement) => {
    setSelectedAnnouncement(announcement);
    await markAsViewed.mutateAsync(announcement._id);
  };

  const handleEditAnnouncement = (announcement) => {
    setEditingAnnouncement(announcement);
    setIsModalOpen(true);
  };

  const handleDeleteAnnouncement = (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const handleCreateAnnouncement = () => {
    setEditingAnnouncement(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAnnouncement(null);
  };

  // Render priority badge
  const PriorityBadge = ({ priority }) => (
    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${priorityColors[priority]}`}>
      {priority.toUpperCase()}
    </span>
  );

  // Render category badge
  const CategoryBadge = ({ category }) => {
    const Icon = categoryIcons[category] || FaTag;
    return (
      <span className="flex items-center gap-1 px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
        <Icon className="w-3 h-3" />
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </span>
    );
  };

  // Sort icon
  const SortIcon = ({ field }) => {
    if (filters.sortBy !== field) return <FaSort className="text-gray-400" />;
    return filters.sortOrder === 'desc' ? <FaSortDown /> : <FaSortUp />;
  };

  // Dashboard widget
  const DashboardWidget = () => (
    <div className="card mb-6">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <FaExclamationTriangle className="text-orange-500" />
          Recent Announcements
        </h3>
        <span className="text-sm text-gray-500">
          {dashboardAnnouncements.length} active
        </span>
      </div>
      <div className="p-4">
        {dashboardAnnouncements.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No recent announcements</p>
        ) : (
          <div className="space-y-3">
            {dashboardAnnouncements.map(announcement => {
              const isUnread = !announcement.notifiedUsers?.includes(user?._id);
              return (
                <div 
                  key={announcement._id}
                  className={`p-3 rounded-lg border cursor-pointer hover:bg-gray-50 transition ${
                    isUnread ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                  onClick={() => handleViewAnnouncement(announcement)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900 truncate">
                      {announcement.title}
                      {isUnread && (
                        <span className="ml-2 inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                      )}
                    </h4>
                    <PriorityBadge priority={announcement.priority} />
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                    {announcement.content}
                  </p>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <FaUser className="w-3 h-3" />
                      {announcement.createdBy?.fullName}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaClock className="w-3 h-3" />
                      {formatDistanceToNow(new Date(announcement.publishedAt), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  if (error) {
    return (
      <div className="card p-8 text-center">
        <FaExclamationTriangle className="text-4xl text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Failed to Load Announcements</h2>
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

  if(!user.isMembershipActive) return null;

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Announcements</h1>
            <p className="text-gray-600 mt-2">Stay updated with the latest news and updates</p>
          </div>
          
          {user?.role === 'admin' && (
            <button
              onClick={handleCreateAnnouncement}
              className="btn-success flex items-center gap-2 px-4 py-3 rounded-lg font-medium hover:scale-105 transition"
            >
              <FaPlus />
              Create Announcement
            </button>
          )}
        </div>

        {/* Dashboard Widget */}
        <DashboardWidget />

        {/* Filters */}
        <div className="card p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search announcements..."
                  className="w-full p-2 pl-10 border rounded-lg"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="">All Categories</option>
                <option value="general">General</option>
                <option value="event">Event</option>
                <option value="payment">Payment</option>
                <option value="emergency">Emergency</option>
                <option value="academic">Academic</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                value={filters.priority}
                onChange={(e) => handleFilterChange('priority', e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="">All Priorities</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            {/* Items per page */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Items per page
              </label>
              <select
                value={filters.limit}
                onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
                className="w-full p-2 border rounded-lg"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
            </div>
          </div>
        </div>

        {/* Announcements Table */}
        <div className="card overflow-hidden">
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="text-xl font-bold">
              All Announcements
              {isLoading && <FaSpinner className="animate-spin ml-2 inline" />}
            </h2>
            <div className="text-sm text-gray-500">
              Showing {announcements.length} of {pagination.totalItems || 0} announcements
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                    onClick={() => handleSort('title')}
                  >
                    <div className="flex items-center gap-1">
                      Title
                      <SortIcon field="title" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Category
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                    onClick={() => handleSort('priority')}
                  >
                    <div className="flex items-center gap-1">
                      Priority
                      <SortIcon field="priority" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                    onClick={() => handleSort('publishedAt')}
                  >
                    <div className="flex items-center gap-1">
                      Published
                      <SortIcon field="publishedAt" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Views
                  </th>
                  {user?.role === 'admin' && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {isLoading && announcements.length === 0 ? (
                  <tr>
                    <td colSpan={user?.role === 'admin' ? 6 : 5} className="text-center py-8">
                      <FaSpinner className="animate-spin text-2xl text-primary-500 mx-auto" />
                      <p className="mt-2 text-gray-500">Loading announcements...</p>
                    </td>
                  </tr>
                ) : announcements.length === 0 ? (
                  <tr>
                    <td colSpan={user?.role === 'admin' ? 6 : 5} className="text-center py-8">
                      <FaBullhorn className="text-4xl text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No announcements found</p>
                      {user?.role === 'admin' && (
                        <button
                          onClick={handleCreateAnnouncement}
                          className="mt-4 btn-success px-4 py-2 rounded-lg"
                        >
                          Create First Announcement
                        </button>
                      )}
                    </td>
                  </tr>
                ) : (
                  announcements.map(announcement => (
                    <tr 
                      key={announcement._id} 
                      className="hover:bg-gray-50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="max-w-xs">
                          <button
                            onClick={() => handleViewAnnouncement(announcement)}
                            className="text-left text-gray-900 font-medium hover:text-primary-600 transition"
                          >
                            {announcement.title}
                          </button>
                          <p className="text-sm text-gray-500 truncate">
                            {announcement.content.substring(0, 80)}...
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <CategoryBadge category={announcement.category} />
                      </td>
                      <td className="px-6 py-4">
                        <PriorityBadge priority={announcement.priority} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="text-gray-900">
                            {format(new Date(announcement.publishedAt), 'MMM dd, yyyy')}
                          </div>
                          <div className="text-gray-500">
                            {formatDistanceToNow(new Date(announcement.publishedAt), { addSuffix: true })}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-sm">
                          <FaEye className="text-gray-400" />
                          {announcement.views || 0}
                        </div>
                      </td>
                      {user?.role === 'admin' && (
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditAnnouncement(announcement)}
                              className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"
                              title="Edit"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDeleteAnnouncement(announcement._id, announcement.title)}
                              disabled={deleteMutation.isLoading}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                              title="Delete"
                            >
                              {deleteMutation.isLoading ? <FaSpinner className="animate-spin" /> : <FaTrash />}
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="px-6 py-4 border-t flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-700">
                Page {pagination.currentPage} of {pagination.totalPages}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleFilterChange('page', pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => handleFilterChange('page', pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Announcement Detail Modal */}
        {selectedAnnouncement && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedAnnouncement.title}
                    </h2>
                    <div className="flex items-center gap-2 mt-2">
                      <PriorityBadge priority={selectedAnnouncement.priority} />
                      <CategoryBadge category={selectedAnnouncement.category} />
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedAnnouncement(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="prose max-w-none">
                    {selectedAnnouncement.content.split('\n').map((paragraph, index) => (
                      <p key={index} className="mb-3">{paragraph}</p>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <p className="font-medium mb-1">Published by</p>
                      <div className="flex items-center gap-2">
                        <FaUser className="w-4 h-4" />
                        <span>{selectedAnnouncement.createdBy?.fullName}</span>
                      </div>
                    </div>
                    <div>
                      <p className="font-medium mb-1">Published on</p>
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="w-4 h-4" />
                        <span>
                          {format(new Date(selectedAnnouncement.publishedAt), 'PPP p')}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="font-medium mb-1">Expires on</p>
                      <div className="flex items-center gap-2">
                        <FaClock className="w-4 h-4" />
                        <span>
                          {selectedAnnouncement.expiresAt
                            ? format(new Date(selectedAnnouncement.expiresAt), 'PPP')
                            : 'Never'}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="font-medium mb-1">Views</p>
                      <div className="flex items-center gap-2">
                        <FaEye className="w-4 h-4" />
                        <span>{selectedAnnouncement.views || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {isModalOpen && (
          <AnnouncementModal
            announcement={editingAnnouncement}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}