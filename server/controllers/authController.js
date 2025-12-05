const asyncHandler=require("../middlewares/asyncHandler.js");
const authService =require ("../services/authService.js");
const sendEmail=require('../services/emailService');
const AppError=require('../utils/appError')

 const register = asyncHandler(async (req, res) => {
  const { student } = await authService.registerStudent(req);

  res.status(201).json({
    status: "success",
    data: {
      student,
    },
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { student, token } = await authService.loginStudent(req);

  res.status(200).json({
    status: "success",
    token,
    data: {
      student,
    },
  });
});

const getMe=asyncHandler(async(req,res)=>{
  const me=await authService.getMe(req);

  res.status(200).json({
    status:"success",
    data:{me}
  })
})

const forgotPassword=asyncHandler(async (req,res)=>{
  let user;
  try{
const data=await authService.forgotPassword(req);
user=data.user
await sendEmail({to:user.email,subject:'Reset Password',html:data.html});
res.status(200).json({success:true,message:"Token sent to email"})
  }
  catch(error)
  {
    if(user)
    {
    user.resetPasswordToken=undefined;
    user.tokenExpiresAt=undefined;
    user.save({validateBeforeSave:false})
    throw new AppError(error.message)
    }
  }
});

const resetPassword=asyncHandler(async (req,res)=>{
await authService.resetPassword(req);

res.status(200).json({success:true,message:'Password reset successfully'})
})

module.exports={register,login,forgotPassword,resetPassword,getMe};