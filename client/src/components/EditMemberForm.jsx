import { useState, useEffect } from 'react';
import { useUpdateStudent, useGetStudentById } from '../queries/studentsQuery'; // Ensure this hook exists
import toast from 'react-hot-toast';
import { FaSpinner } from 'react-icons/fa';

export default function EditMemberForm({ studentId, onClose }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    regNumber: '',
  });
  
  const { data: student, isLoading: loading } = useGetStudentById(studentId);
  const updateMutation = useUpdateStudent();

  useEffect(() => {
    if (student) {
      setFormData({
        fullName: student.fullName || '',
        email: student.email || '',
        phone: student.phone || '',
        regNumber: student.regNumber || '',
      });
    }
  }, [student]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await updateMutation.mutateAsync({
        id: studentId,
        updateData: formData
      });
      onClose();
    } catch (error) {
   console.error(error.message);
   toast.error(error.message);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <FaSpinner className="animate-spin mx-auto text-2xl text-primary-500" />
        <p className="mt-2">Loading student data...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Registration Number
          </label>
          <input
            type="text"
            name="regNumber"
            value={formData.regNumber}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
          disabled={updateMutation.isPending}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={updateMutation.isPending}
          className="btn-success px-4 py-2 rounded-lg flex items-center gap-2"
        >
          {updateMutation.isPending && (
            <FaSpinner className="animate-spin" />
          )}
          Update Member
        </button>
      </div>
    </form>
  );
}