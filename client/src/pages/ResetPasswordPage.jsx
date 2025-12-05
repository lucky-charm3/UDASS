import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useResetPassword } from "../queries/authQuery"; 

const ResetPasswordPage = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const { token } = useParams(); 
  const navigate = useNavigate();
  
  const resetMutation = useResetPassword();

  const onSubmit = (data) => {
    resetMutation.mutate(
      { token, password: data.password }, 
      {
        onSuccess: () => {
          navigate("/login");
        }
      }
    );
  };

  const password = watch("password");

  return (
    <div className="min-h-screen items-center bg-gray-50 flex flex-col justify-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="card max-w-md w-full p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Set New Password</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">New Password</label>
            <input 
              {...register("password", { required: "Required", minLength: { value: 6, message: "Min 6 chars" } })} 
              type="password" 
              className="w-full p-3 border rounded-lg mt-1"
            />
             {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input 
              {...register("confirmPassword", { 
                validate: value => value === password || "Passwords do not match"
              })} 
              type="password" 
              className="w-full p-3 border rounded-lg mt-1"
            />
            {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword.message}</p>}
          </div>

          <button 
            type="submit" 
            disabled={resetMutation.isPending} 
            className="btn-primary w-full disabled:opacity-50"
          >
            {resetMutation.isPending ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;