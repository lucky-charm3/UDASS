import { useState } from 'react';
import { useCreateStudent } from '../queries/studentsQuery';
import { FaSpinner, FaUser, FaEnvelope, FaPhone, FaIdCard, FaLock, FaCheck } from 'react-icons/fa';
import toast from 'react-hot-toast';

const initialFormState = {
  fullName: '',
  email: '',
  phone: '',
  regNumber: '',
  password: '',
  isMembershipActive: false,
};

export default function AddMemberForm({ onClose }) {
  const [formData, setFormData] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState({});
  const { mutate, isPending } = useCreateStudent();

  const validateForm = () => {
    const errors = {};
    
    if (!formData.fullName.trim()) {
      errors.fullName = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }
    
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
      errors.phone = 'Invalid phone number';
    }
    
    if (!formData.regNumber.trim()) {
      errors.regNumber = 'Registration number is required';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    mutate(formData, {
      onSuccess: () => {
        toast.success('Member added successfully!');
        onClose();
      },
      onError: (error) => {
        const errorMessage = error.response?.data?.message || 'Failed to add member';
        toast.error(errorMessage);
      }
    });
  };

  const InputField = ({ label, name, type = 'text', placeholder, icon: Icon, error }) => (
    <div className="space-y-1">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type={type}
          id={name}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          placeholder={placeholder}
          className={`
            block w-full pl-10 pr-3 py-3 border rounded-lg 
            focus:ring-2 focus:ring-primary-500 focus:border-transparent
            ${error ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'}
            transition
          `}
        />
      </div>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <InputField
          label="Full Name"
          name="fullName"
          placeholder="Ramadhan Semboni"
          icon={FaUser}
          error={formErrors.fullName}
        />

        <InputField
          label="Email Address"
          name="email"
          type="email"
          placeholder="ramadhanSemboni@example.com"
          icon={FaEnvelope}
          error={formErrors.email}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Phone Number"
            name="phone"
            type="tel"
            placeholder="+255 123 456 789"
            icon={FaPhone}
            error={formErrors.phone}
          />

          <InputField
            label="Registration Number"
            name="regNumber"
            placeholder="T24-03-16678"
            icon={FaIdCard}
            error={formErrors.regNumber}
          />
        </div>

        <InputField
          label="Password"
          name="password"
          type="password"
          placeholder="••••••••"
          icon={FaLock}
          error={formErrors.password}
        />

        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center h-5">
            <input
              type="checkbox"
              id="isMembershipActive"
              name="isMembershipActive"
              checked={formData.isMembershipActive}
              onChange={handleChange}
              className="h-5 w-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="isMembershipActive" className="font-medium text-gray-700">
              Activate Membership
            </label>
            <p className="text-sm text-gray-500 mt-1">
              Member will be able to access all features immediately. Payment can be recorded later.
            </p>
          </div>
          {formData.isMembershipActive && (
            <FaCheck className="h-5 w-5 text-green-500" />
          )}
        </div>
      </div>

      <div className="bg-gray-50 -mx-6 -mb-6 p-6 rounded-b-lg">
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <FaSpinner className="animate-spin" />
                Registering...
              </>
            ) : (
              <>
                <FaUser />
                Register Member
              </>
            )}
          </button>
        </div>
        
        <div className="mt-4 text-xs text-gray-500 text-center">
          <p>All fields are required. Password must be at least 6 characters long.</p>
        </div>
      </div>
    </form>
  );
}