const asyncHandler= require("../middlewares/asyncHandler.js");
const StudentService = require("../services/studentService.js");

const createStudent=asyncHandler(async(req,res)=>{
  const student=await StudentService.createStudent(req);
  res.status(201).json({
    status:"success",
    data:student
  })
})

 const getAllStudents = asyncHandler(async (req, res) => {
  const students = await StudentService.getAllStudents(req.query);
  res.status(200).json({
    status: "success",
    data:  students ,
  });
});

 const getStudent = asyncHandler(async (req, res) => {
  const student = await StudentService.getStudentById(req.params.id);
  res.status(200).json({
    status: "success",
    data: { student },
  });
});

 const updateStudent = asyncHandler(async (req, res) => {
  const student = await StudentService.updateStudentById(req);
  res.status(200).json({
    status: "success",
    data: { student },
  });
});

 const deleteStudent = asyncHandler(async (req, res) => {
  await StudentService.deleteStudentById(req);
  res.status(200).json({
    status: "success",
    message: "Student deleted successfully",
  });
});

 const getStats = asyncHandler(async (req, res) => {
  const stats = await StudentService.getAdminStats();
  res.status(200).json({
    status: "success",
    data: stats,
  });
});

module.exports={createStudent,getAllStudents,getStudent,
                                  updateStudent,deleteStudent,getStats}