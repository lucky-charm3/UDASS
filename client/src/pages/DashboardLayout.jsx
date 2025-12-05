import {useState} from 'react';
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { 
  FaSignOutAlt, 
  FaUser, 
  FaShieldAlt, 
  FaHome, 
  FaBullhorn,
  FaHistory,
  FaTimes,
  FaBars
} from "react-icons/fa";

const DashboardLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActiveMember = user?.isMembershipActive;
  const isAdmin = user?.role === "admin";

  return (
    <div className="min-h-screen bg-gray-50 flex ">
    <div className="md:hidden bg-white p-4 flex items-center justify-between shadow-sm sticky top-0 z-40">
  <span className="font-bold text-primary-700">UDASS</span>
  <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="text-gray-600">
    {isSidebarOpen ? <FaTimes /> : <FaBars />}
  </button>
</div>
      <aside className={`
  w-64 bg-white shadow-lg fixed top-0 bottom-0 left-0 z-50 transition-transform duration-300
  ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
  md:translate-x-0 
`}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="p-3 bg-primary-600 rounded-full">
              <FaShieldAlt className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary-700">UDASS</h1>
              <p className="text-xs text-gray-500">Member Portal</p>
            </div>
          </div>

          <nav className="space-y-2">
            <NavLink onClick={() => setSidebarOpen(false)}
              to="/dashboard"
              className={({isActive}) => `
                flex items-center gap-3 px-4 py-3 rounded-lg 
                ${isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-700'}
                hover:bg-primary-50 hover:text-primary-700 transition
              `}
              end
            >
              <FaHome className="w-5 h-5" />
              Dashboard
            </NavLink>

            {isActiveMember && (
              <NavLink onClick={() => setSidebarOpen(false)}
                to="/dashboard/announcements"
                className={({isActive}) => `
                  flex items-center gap-3 px-4 py-3 rounded-lg 
                  ${isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-700'}
                  hover:bg-primary-50 hover:text-primary-700 transition
                `}
              >
                <FaBullhorn className="w-5 h-5" />
                Announcements
              </NavLink>
            )}

            {isAdmin && isActiveMember && (
              <>
                <NavLink onClick={() => setSidebarOpen(false)}
                  to="/dashboard/admin"
                  className={({isActive}) => `
                    flex items-center gap-3 px-4 py-3 rounded-lg 
                    ${isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-700'}
                    hover:bg-primary-50 hover:text-primary-700 transition
                  `}
                >
                  <FaShieldAlt className="w-5 h-5" />
                  Admin Panel
                </NavLink>
                
                {/* <NavLink onClick={() => setSidebarOpen(false)}
                  to="/dashboard/admin/logs"
                  className={({isActive}) => `
                    flex items-center gap-3 px-4 py-3 rounded-lg 
                    ${isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-700'}
                    hover:bg-primary-50 hover:text-primary-700 transition
                  `}
                >
                  <FaHistory className="w-5 h-5" />
                  Activity Logs
                </NavLink> */}
              </>
            )}
          </nav>
        </div>

        <div className="absolute bottom-0 w-64 p-6 border-t">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <FaUser className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{user?.fullName}</p>
              <p className="text-xs text-gray-500">{user?.regNumber}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 text-sm font-medium"
          >
            <FaSignOutAlt className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-8 md:ml-64">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;