import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useForgotPassword } from "../queries/authQuery"; // Import the hook

const ForgotPasswordPage = () => {
  const { register, handleSubmit } = useForm();
  const [emailSent, setEmailSent] = useState(false);
  
  const forgotPasswordMutation = useForgotPassword();

  const onSubmit = (data) => {
    forgotPasswordMutation.mutate(data.email, {
      onSuccess: () => {
        setEmailSent(true);
      }
    });
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="card max-w-md w-full p-8 text-center animate-in fade-in zoom-in duration-300">
          <h2 className="text-2xl font-bold text-green-600 mb-4">Check your email</h2>
          <p className="text-gray-600">We have sent a password reset link to your email address.</p>
          <p className="text-sm text-gray-500 mt-2">If you don't see it, check your spam folder.</p>
          <Link to="/login" className="btn-primary mt-6 inline-block">Back to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen items-center bg-gray-50 flex flex-col justify-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="card max-w-md w-full p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Reset Password</h2>
          <p className="text-sm text-gray-500 mt-1">Enter your email to receive instructions</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input 
              {...register("email", { 
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Invalid email address",
                }
              })} 
              type="email" 
              placeholder="e.g john@udom.ac.tz"
              className="w-full p-3 border rounded-lg mt-1 focus:ring-2 focus:ring-primary-600 focus:border-transparent"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={forgotPasswordMutation.isPending} 
            className="btn-primary w-full disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
          >
            {forgotPasswordMutation.isPending ? (
              <span>Sending...</span>
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>
        
        <div className="mt-6 text-center border-t pt-4">
           <Link to="/login" className="text-sm font-medium text-primary-600 hover:text-primary-500">
             &larr; Back to Login
           </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;