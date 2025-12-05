import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import {  FaEnvelope,  FaLock,  FaArrowLeft} from "react-icons/fa";

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <div className="w-32 h-32 rounded-full">
              <img src='udass.jpg' alt='UDASS logo' className='w-full h-full rounded-full'/>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
          <p className="mt-2 text-gray-600">Log in to your UDASS account</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                < FaEnvelope className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "Invalid email",
                    },
                  })}
                  type="email"
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                  placeholder="john@udom.ac.tz"
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
            </div>

            <div>
             <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
               <Link 
                  to="/forgot-password" 
                  className="text-sm font-medium text-primary-600 hover:text-primary-500"
                  >
                  Forgot password?
              </Link>
                    </div>
              <div className="relative">
                < FaLock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  {...register("password", { required: "Password is required" })}
                  type="password"
                  placeholder="xxxxxxx"
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
              {isSubmitting ? "Logging in..." : "Log In"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            New here?{" "}
            <Link to="/register" className="font-medium text-primary-600 hover:text-primary-700">
              Create account
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

export default LoginPage;