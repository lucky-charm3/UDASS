import { useState } from 'react';
import { FaMoneyBillWave, FaPaperPlane } from 'react-icons/fa';
import Modal from './Modal';
import toast from 'react-hot-toast';
import { useRequestPaymentApproval } from '../queries/paymentQuery'; // Import Hook

export default function PaymentModal({ isOpen, onClose }) {
  const [phoneUsed, setPhoneUsed] = useState('');
  const [transactionId, setTransactionId] = useState('');
  
  const requestMutation = useRequestPaymentApproval();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!phoneUsed) return toast.error("Please enter the phone number you paid with");

    requestMutation.mutate(
      { phoneUsed, transactionId },
      {
        onSuccess: () => {
          setPhoneUsed('');
          setTransactionId('');
          onClose();
        }
      }
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Pay Membership Fee">
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
            <FaMoneyBillWave className="text-yellow-600"/> Payment Instructions
          </h3>
          <p className="text-gray-700 text-sm mb-2">Please send <strong>2,000 TZS</strong> to:</p>
          <div className="bg-white p-3 rounded border border-gray-200 mb-2 text-center">
            <p className="font-mono text-lg font-bold">075X XXX XXX</p>
            <p className="text-sm text-gray-500">Name: UDASS TREASURY</p>
          </div>
          <p className="text-xs text-gray-600">
            After paying, fill the form below so the Admin can approve your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number Used
            </label>
            <input
              type="tel"
              required
              placeholder="e.g 0754 123 456"
              value={phoneUsed}
              onChange={(e) => setPhoneUsed(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Transaction ID (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g 8H83J2..."
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <button
            type="submit"
            disabled={requestMutation.isPending}
            className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {requestMutation.isPending ? 'Sending Request...' : (
              <>
                <FaPaperPlane /> I Have Paid - Request Approval
              </>
            )}
          </button>
        </form>
      </div>
    </Modal>
  );
}