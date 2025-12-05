const express =require( "express");
const {
  createStudent,
  getAllStudents,
  getStudent,
  updateStudent,
  deleteStudent,
  getStats,
} =require("../controllers/studentController.js");
const { protect, restrictTo }=require( "../middlewares/authMiddleware.js");

const router = express.Router();

router.use(protect);
router.use(restrictTo("admin"));

router.post("/",createStudent);
router.get("/", getAllStudents);

router.get("/stats", getStats); 

router.get("/:id", getStudent);
router.patch("/:id", updateStudent);

router.delete("/:id", deleteStudent);


module.exports= router;