const Student =require("../models/studentModel.js");

const studentRepository={
  createStudent:async (data)=>{
  return await Student.create(data);
  },
 getAllStudents :async (query, skip, limit, sort) => {
  return await Student.find(query)
    .sort(sort)
    .skip(skip)
    .limit(limit);
},

countStudents:async (query) => {
  return await Student.countDocuments(query);
},

getStudent:async (query)=>{
return await Student.findOne(query)
},

getStudentById :async (id) => {
  return await Student.findById(id).select("-password");
},

getStudentByEmail:async (email)=>{
  return await Student.findOne({email}).select("+password");
},

getStudentByResetToken:async(token)=>{
  return await Student.findOne({passwordResetToken:token})
},

updateStudentById: async (id, updateData) => {
  return await Student.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).select("-password");
},

deleteStudentById: async (id) => {
  return await Student.findByIdAndDelete(id);
},

getAdminStats: async () => {
  const totalStudents = await Student.countDocuments();
  const paidThisYear = await Student.countDocuments({
    isMembershipActive: true,
    membershipExpiry: { $gte: new Date() },
  })
  return { totalStudents, paidThisYear };
}
}

module.exports=studentRepository;