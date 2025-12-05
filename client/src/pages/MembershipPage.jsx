import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import PaymentModal from "../components/PaymentModal";
import ProtectedRoute from "../components/ProtectedRoute";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaCalendarAlt,
  FaExclamationCircle,
  FaHistory,
  FaCreditCard,
  FaUserShield
} from "react-icons/fa";

const MembershipPage = () => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isActive = user?.isMembershipActive || false;
  const expiryDate = user?.membershipExpiry
    ? new Date(user.membershipExpiry).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  const handlePaymentSuccess = () => {
    window.location.reload(); 
  };

  if (user?.role === 'admin') {
    return (
      <ProtectedRoute>
        <div className="max-w-4xl mx-auto py-8 text-center">
          <div className="card p-12">
            <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaUserShield className="w-12 h-12 text-primary-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Administrator Profile</h1>
            <p className="text-xl text-gray-600 mb-8">
              You are logged in as an Administrator. You have full access to manage students, announcements, and view system logs.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto text-left">
              <div className="p-4 bg-gray-50 rounded-lg border">
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-semibold text-gray-900">{user.fullName}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border">
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-semibold text-gray-900">{user.email}</p>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-10 text-center">
          Membership Status
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="card p-10 text-center">
            {isActive ? (
              <>
                <FaCheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
                <h2 className="text-3xl font-bold text-green-600 mb-2">ACTIVE MEMBER</h2>
                <p className="text-gray-600 text-lg">Welcome to UDASS Family!</p>
              </>
            ) : (
              <>
                <FaTimesCircle className="w-24 h-24 text-red-500 mx-auto mb-6" />
                <h2 className="text-3xl font-bold text-red-600 mb-2">INACTIVE</h2>
                <p className="text-gray-600 text-lg">Complete payment to activate</p>
              </>
            )}
          </div>

          <div className="card p-10 space-y-8">
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wider">Annual Fee</p>
              <p className="text-4xl font-bold text-primary-600 mt-2">Tsh 2,000</p>
            </div>

            {isActive ? (
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wider">Valid Until</p>
                <div className="flex items-center gap-3 mt-3">
                  <FaCalendarAlt className="w-6 h-6 text-primary-600" />
                  <p className="text-2xl font-semibold text-gray-800">{expiryDate}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <FaExclamationCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                  Your membership is inactive.<br />
                  Pay Tsh 2,000 to activate your account.
                </p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="btn-primary text-xl px-12 py-5 shadow-lg hover:shadow-xl transition flex items-center gap-3 mx-auto"
                >
                  <FaCreditCard className="w-6 h-6" />
                  Pay Now — Tsh 2,000
                </button>
              </div>
            )}
          </div>
        </div>

        {user?.paymentHistory && user.paymentHistory.length > 0 && (
          <div className="mt-12 card p-8">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <FaHistory className="text-primary-600" />
              Payment History
            </h3>
            <div className="space-y-6">
              {user.paymentHistory.map((payment, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-5 border-b border-gray-200 last:border-0"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <FaCheckCircle className="w-7 h-7 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-lg">Tsh 2,000</p>
                      <p className="text-sm text-gray-600">{payment.method || "M-Pesa"}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {new Date(payment.paidAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                    {payment.reference && (
                      <p className="text-xs text-gray-500 mt-1">Ref: {payment.reference}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handlePaymentSuccess}
      />
    </ProtectedRoute>
  );
};

export default MembershipPage;