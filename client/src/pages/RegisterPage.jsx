import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import {  FaArrowLeft,  FaUser,  FaEnvelope,  FaPhone,  FaHashtag,  FaLock} from "react-icons/fa";

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await registerUser(data);
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
           <div className="w-32 h-32 rounded-full">
              <img src='udass.jpg' alt='UDASS logo' className='w-full h-full rounded-full'/>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Join UDASS</h2>
          <p className="mt-2 text-gray-600">Create your account</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <div className="relative">
                < FaUser className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  {...register("fullName", {
                    required: "Full name is required",
                    minLength: { value: 3, message: "At least 3 characters" },
                  })}
                  type="text"
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                  placeholder="e.g Ramadhan Ally"
                />
              </div>
              {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                < FaEnvelope className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "Invalid email address",
                    },
                  })}
                  type="email"
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                  placeholder="ramadhan@udom.ac.tz"
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <div className="relative">
                < FaPhone className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  {...register("phone", {
                    required: "Phone is required",
                    pattern: {
                      value: /^(\+255|0)[67]\d{8}$/,
                      message: "Use +255 or 0 format e.g +255712345678",
                    },
                  })}
                  type="tel"
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                  placeholder="+255712345678"
                />
              </div>
              {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Registration Number</label>
              <div className="relative">
                < FaHashtag className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                 {...register("regNumber", {
                required: "Registration number is required",
                pattern: {
                  value: /^[TE]\d{2}-\d{2}-\d{5}$/,
                  message: "Invalid format. Use: T24-03-16678 or E25-01-12345",
                },
             })}
                  type="text"
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent uppercase"
                  placeholder="X-XX-XXXXX"
                />
              </div>
              {errors.regNumber && <p className="mt-1 text-sm text-red-600">{errors.regNumber.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                < FaLock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "Minimum 6 characters" },
                  })}
                  type="password"
                  placeholder="xxxxxxxx"
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                />
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary text-lg py-4 disabled:opacity-70"
            >
              {isSubmitting ? "Creating Account..." : "Register"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already a member?{" "}
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-700">
              Log in here
            </Link>
          </p>
        </div>

        <Link to="/" className="mt-8 flex justify-center text-sm text-gray-600 hover:text-primary-600">
          < FaArrowLeft className="w-4 h-4 mr-1" /> Back to Home
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;