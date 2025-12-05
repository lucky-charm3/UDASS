const studentRepository=require("../repositories/studentRepository")
const generateToken = require("../utils/generateToken.js");
const AppError = require("../utils/appError.js");

const registerStudent = async (req) => {
  const { email, phone, regNumber } = req.body;

  const query={$or:[{email},{phone},{regNumber}]};

  const existingStudent = await studentRepository.getStudent(query);

  if (existingStudent) {

    if (existingStudent.email === email) throw new AppError("Email already in use", 400);
    if (existingStudent.phone === phone) throw new AppError("Phone number already in use", 400);
    if (existingStudent.regNumber === regNumber) throw new AppError("Registration number already exists", 400);
  }

  const student = await studentRepository.createStudent(req.body);

  return { student};
};

const loginStudent = async (req) => {
  const student = await studentRepository.getStudentByEmail(req.body.email);

  if(!student)
  {
    throw new AppError("Student not found",404);
  }

  const passwordMatches=await student.comparePassword(req.body.password);

  if (!passwordMatches) {
    throw new AppError("Incorrect email or password", 401);
  }

  const token = generateToken(student._id);

  student.password = undefined;
  return { student, token };
};

const getMe=async (req)=>{
    const me=await studentRepository.getStudentById(req.user._id);
     if (req.user) {
    return req.user;
  }

    if(!me){
      throw new AppError("User not found",404)
    }

    return me;
  };

const forgotPassword = async (req) => {
  const { email } = req.body; 
  
  if (!email) {
    throw new AppError("Please provide an email address", 400);
  }

  const user = await studentRepository.getStudentByEmail(email); 

  if (!user) {
    throw new AppError("User not found with that email", 404);
  }

  const token = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
  const url = `${clientUrl}/reset-password/${token}`;
  
const html=`<div style="display:flex; flex-direction:column; gap:10px;">
<p>Dear <span style="color:blue;">${user.fullName}</span>,</p>
<p>We received a request to reset the password for your account.</p>
<p style="margin-bottom:20px;">If you made this request, please click the link below to create a new password:</p>
<p>${url}</p>
<p style="margin-top:20px;">If you did not request a password reset, you can safely ignore 
this email—your account is still secure and no changes have been made.</p>
<p>Thank you,</p>
<p>UDASS</p>
</div>
`
return {user,html};
}

const resetPassword=async (req)=>{
const token=req.params.resetToken;
const {password}=req.body;

if(!password)
{
  throw new AppError("Please provide your new password",400)
}

const student=await studentRepository.getStudentByResetToken(token);

if(!student)
{
  throw new AppError("Student not found",404);
}

student.password=password;
student.resetPasswordToken=undefined;
student.passwordTokenExpiresAt=undefined;

await student.save();
}

module.exports={registerStudent,
                                          loginStudent,
                                          forgotPassword,
                                          resetPassword,getMe}