import { useState } from 'react';
import { useDeleteStudent } from '../queries/studentsQuery';
import { FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function DeleteMemberForm({ studentId, onClose }) {
  const [confirmText, setConfirmText] = useState('');
  const deleteMutation = useDeleteStudent();

  const handleDelete = async () => {
    if (confirmText.toLowerCase() === 'delete') {
      try {
        await deleteMutation.mutateAsync(studentId);
        onClose();
      } catch (error) {
        console.error(error.message);
        toast.error(error.message);
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-start gap-3 mb-4">
        <FaExclamationTriangle className="text-red-500 text-xl mt-1 flex-shrink-0" />
        <div>
          <h3 className="font-semibold text-gray-900">Delete Member</h3>
          <p className="text-gray-600 mt-1">
            This action cannot be undone. This will permanently delete the member record.
          </p>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-sm text-gray-700 mb-2">
          Type <span className="font-mono font-bold">delete</span> to confirm:
        </p>
        <input
          type="text"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          className="w-full p-2 border rounded-lg"
          placeholder="Type 'delete' to confirm"
        />
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
          disabled={deleteMutation.isPending}
        >
          Cancel
        </button>
        <button
          onClick={handleDelete}
          disabled={confirmText.toLowerCase() !== 'delete' || deleteMutation.isPending}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {deleteMutation.isPending && (
            <FaSpinner className="animate-spin" />
          )}
          Delete Member
        </button>
      </div>
    </div>
  );
}