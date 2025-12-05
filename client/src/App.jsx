import { createBrowserRouter, RouterProvider,Outlet } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import DashboardLayout from "./pages/DashboardLayout";
import MembershipPage from "./pages/MembershipPage";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from './components/ProtectedRoute';
import Announcements from './pages/Announcements';
// import ActivityLogsPage from './pages/ActivityLogsPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage'
import { Toaster } from "react-hot-toast";
import StudentModalContainer from "./components/StudentModalContainer";

const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/forgot-password", element: <ForgotPasswordPage /> },
  { path: "/reset-password/:token", element: <ResetPasswordPage /> },
  {
    path: "/dashboard",
    element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
    children: [
      { index: true, element: <MembershipPage /> },
      { path: 'announcements', element: <Announcements /> },
      { 
        path: "admin", 
        element: (
          <ProtectedRoute adminOnly>
            <div className="relative">
              <Outlet />
              <StudentModalContainer />
            </div>
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <AdminDashboard /> },
          // { path: "logs", element: <ActivityLogsPage /> },
          { path: "addStudent", element:  <AdminDashboard /> },
          { path: ":studentId/editStudent", element: <AdminDashboard />},
          { path: ":studentId/deleteStudent", element:  <AdminDashboard /> },
        ]
      },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
    </>
  );
}

export default App;