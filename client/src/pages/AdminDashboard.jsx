// pages/AdminDashboard.jsx
import { useMemo, useState, useEffect } from "react";
import { 
  FaDownload, 
  FaUsers, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaDollarSign, 
  FaUserPlus, 
  FaSearch, 
  FaSpinner,
  FaEdit,
  FaTrash
} from "react-icons/fa";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { useSearchParams, useNavigate, useLocation,Outlet } from 'react-router-dom';
import ProtectedRoute from "../components/ProtectedRoute";
import Pagination from "../components/Pagination";
import { 
  useGetAllStudents, 
  useGetAdminStats, 
  useDeleteStudent 
} from "../queries/studentsQuery";

const exportToCSV = (data, filename) => {
  const headers = ["Full Name", "Email", "Phone", "Reg Number", "Status", "Expiry Date", "Paid At"];

  const rows = data.map(s => [
    s.fullName,
    s.email,
    s.phone,
    s.regNumber,
    s.isMembershipActive ? "ACTIVE" : "INACTIVE",
    s.membershipExpiry ? format(new Date(s.membershipExpiry), "dd MMM yyyy") : "-",
    s.paymentHistory.length > 0 ? format(new Date(s.paymentHistory[0].paidAt), "dd MMM yyyy") : "-"
  ]);

  const csv = [headers, ...rows].map(row => row.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
  toast.success("Membership list exported! ✅");
};

const AdminDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const deleteMutation = useDeleteStudent();

  // Check if we're in a modal route
  const isModalRoute = location.pathname.includes('/addStudent') || 
                       location.pathname.includes('/editStudent') || 
                       location.pathname.includes('/deleteStudent');

  // --- 1. Query State Management ---
  const queryParams = useMemo(() => {
    return {
      page: searchParams.get('page') || '1',
      limit: searchParams.get('limit') || '10',
      search: searchParams.get('search') || '',
      membership: searchParams.get('membership') || '',
    };
  }, [searchParams]);

  // Debounced search to prevent too many API calls
  const [searchInput, setSearchInput] = useState(queryParams.search);
  const [debouncedSearch, setDebouncedSearch] = useState(queryParams.search);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    if (debouncedSearch !== queryParams.search) {
      setSearchParams(prev => {
        if (debouncedSearch) {
          prev.set('search', debouncedSearch);
        } else {
          prev.delete('search');
        }
        prev.set('page', '1');
        return prev;
      }, { replace: true });
    }
  }, [debouncedSearch]);

  const { data: stats, isLoading: isLoadingStats } = useGetAdminStats();
  const { 
    data: studentsData, 
    isLoading: isLoadingStudents, 
    isFetching,
    error: studentsError 
  } = useGetAllStudents(queryParams);

  const students = studentsData?.students || [];
  const pagination = studentsData?.pagination || {};
  const totalStudents = pagination.totalStudents || 0;
  
  // Stats Calculations
  const { paidCount, total, revenue } = useMemo(() => {
    if (!stats) return { paidCount: 0, total: 0, revenue: 0 };
    const pCount = stats.paidThisYear || 0;
    const totalCount = stats.totalStudents || 0;
    const rev = pCount * 2000;
    return { paidCount: pCount, total: totalCount, revenue: rev };
  }, [stats]);

  // --- 2. Handlers ---
  const handleExport = async () => {
    try {
      // In production, you might want to fetch all data without pagination
      // For now, we'll use the paginated data but show a warning if there's more
      if (totalStudents > 1000) {
        const confirmExport = window.confirm(
          `You're about to export ${totalStudents} records. This might take a while. Continue?`
        );
        if (!confirmExport) return;
      }
      
      exportToCSV(students, `UDASS_Members_${format(new Date(), "yyyy-MM-dd")}`);
    } catch (error) {
      toast.error("Failed to export data");
      console.error("Export error:", error);
    }
  };

  const handlePageChange = (newPage) => {
    setSearchParams(prev => {
      prev.set('page', newPage.toString());
      return prev;
    }, { replace: true });
  };
  
  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
  };
  
  const handleMembershipFilter = (e) => {
    const value = e.target.value;
    setSearchParams(prev => {
      if (value) {
        prev.set('membership', value);
      } else {
        prev.delete('membership');
      }
      prev.set('page', '1');
      return prev;
    }, { replace: true });
  };

  const handleAddMember = () => {
    navigate('/dashboard/admin/addStudent');
  };

  const handleEditMember = (studentId) => {
    navigate(`/dashboard/admin/${studentId}/editStudent`);
  };

  const handleDeleteMember = (studentId, studentName) => {
    if (window.confirm(`Are you sure you want to delete "${studentName}"? This action cannot be undone.`)) {
      deleteMutation.mutate(studentId);
    }
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        handleAddMember();
      }
      
      if (e.key === 'Escape' && isModalRoute) {
        navigate('/dashboard/admin');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isModalRoute]);

  // Show loading state
  if (isLoadingStats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-primary-600 mx-auto mb-4" />
          <p className="text-lg text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (studentsError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <FaTimesCircle className="text-4xl text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Failed to Load Data</h2>
          <p className="text-gray-600 mb-4">
            {studentsError.message || "Unable to fetch student data. Please try again later."}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute adminOnly>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">UDASS Leadership Panel. </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={handleAddMember}
              className="btn-success flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all hover:scale-105 active:scale-95"
              title="Add new member (Ctrl+N)"
            >
              <FaUserPlus className="w-5 h-5" />
              <span className="hidden sm:inline">Add Member</span>
              <span className="sm:hidden">Add</span>
            </button>
            <button 
              onClick={handleExport}
              disabled={totalStudents === 0}
              className="btn-primary flex items-center gap-2 px-4 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
            >
              <FaDownload className="w-5 h-5" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="card p-6 text-center hover:shadow-lg transition-shadow">
            <FaUsers className="w-10 h-10 text-primary-600 mx-auto mb-3" />
            <p className="text-2xl font-bold text-gray-900">{total.toLocaleString()}</p>
            <p className="text-gray-600 text-sm">Total Students</p>
          </div>
          <div className="card p-6 text-center hover:shadow-lg transition-shadow">
            <FaCheckCircle className="w-10 h-10 text-green-500 mx-auto mb-3" />
            <p className="text-2xl font-bold text-green-600">{paidCount.toLocaleString()}</p>
            <p className="text-gray-600 text-sm">Paid This Year</p>
          </div>
          <div className="card p-6 text-center hover:shadow-lg transition-shadow">
            <FaTimesCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
            <p className="text-2xl font-bold text-red-600">{(total - paidCount).toLocaleString()}</p>
            <p className="text-gray-600 text-sm">Pending Payment</p>
          </div>
          <div className="card p-6 text-center hover:shadow-lg transition-shadow">
            <FaDollarSign className="w-10 h-10 text-blue-600 mx-auto mb-3" />
            <p className="text-2xl font-bold text-blue-600">Tsh {revenue.toLocaleString()}</p>
            <p className="text-gray-600 text-sm">Estimated Revenue</p>
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="p-4 sm:p-6 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold">
                All Members
              </h2>
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {totalStudents.toLocaleString()} total
              </span>
              {isFetching && (
                <FaSpinner className="animate-spin text-primary-500" />
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <input
                  type="search"
                  placeholder="Search name or reg no..."
                  value={searchInput}
                  onChange={handleSearchInputChange}
                  className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>

              <select 
                value={queryParams.membership}
                onChange={handleMembershipFilter}
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">All Statuses</option>
                <option value="active">Active Members</option>
                <option value="expired">Inactive/Expired</option>
              </select>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="hidden md:table-cell px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reg No.
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="hidden md:table-cell px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Paid On
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {isLoadingStudents ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8">
                      <div className="flex justify-center">
                        <FaSpinner className="animate-spin text-2xl text-primary-500" />
                      </div>
                      <p className="mt-2 text-gray-500">Loading members...</p>
                    </td>
                  </tr>
                ) : students.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-12">
                      <div className="text-gray-400 mb-2">
                        <FaUsers className="w-12 h-12 mx-auto opacity-50" />
                      </div>
                      <p className="text-gray-500 font-medium">No members found</p>
                      <p className="text-gray-400 text-sm mt-1">
                        {queryParams.search || queryParams.membership 
                          ? "Try changing your search or filter criteria" 
                          : "Get started by adding your first member"}
                      </p>
                      {!queryParams.search && !queryParams.membership && (
                        <button
                          onClick={handleAddMember}
                          className="mt-4 btn-success px-4 py-2 rounded-lg"
                        >
                          Add First Member
                        </button>
                      )}
                    </td>
                  </tr>
                ) : (
                  students.map((s) => (
                    <tr 
                      key={s._id} 
                      className="hover:bg-gray-50 transition-colors group"
                    >
                      <td className="px-4 sm:px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{s.fullName}</p>
                          <p className="text-sm text-gray-500 truncate max-w-xs">{s.email}</p>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 hidden md:table-cell">
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded font-mono">
                          {s.regNumber}
                        </code>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          s.isMembershipActive 
                            ? "bg-green-100 text-green-800" 
                            : "bg-red-100 text-red-800"
                        }`}>
                          {s.isMembershipActive ? "ACTIVE" : "INACTIVE"}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 hidden md:table-cell">
                        <div className="text-sm">
                          {s.paymentHistory.length > 0 ? (
                            <div>
                              <p className="text-gray-900">
                                {format(new Date(s.paymentHistory[0].paidAt), "dd MMM yyyy")}
                              </p>
                              <p className="text-gray-500 text-xs">
                                {format(new Date(s.paymentHistory[0].paidAt), "HH:mm")}
                              </p>
                            </div>
                          ) : (
                            <span className="text-gray-400 italic">No payments</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEditMember(s._id)}
                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Edit member"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteMember(s._id, s.fullName)}
                            disabled={deleteMutation.isPending}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                            title="Delete member"
                          >
                            {deleteMutation.isPending && deleteMutation.variables === s._id ? (
                              <FaSpinner className="animate-spin" />
                            ) : (
                              <FaTrash />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          {pagination.totalPages > 1 && (
            <Pagination 
              pagination={pagination} 
              onPageChange={handlePageChange}
              isFetching={isFetching}
            />
          )}
        </div>

        {/* --- INFO FOOTER --- */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Showing page {pagination.currentPage || 1} of {pagination.totalPages || 1} • 
            Total members: {totalStudents.toLocaleString()} • 
            Use <kbd className="px-2 py-1 bg-gray-100 rounded border">Ctrl+N</kbd> to quickly add members
          </p>
        </div>
        <Outlet/>
      </div>
    </ProtectedRoute>
  );
};

export default AdminDashboard;