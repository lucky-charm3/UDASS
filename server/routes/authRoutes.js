const express =require("express");
const { register, login,getMe,
  resetPassword,forgotPassword }  =require("../controllers/authController.js");
const validate  =require( "../middlewares/validate.js");
const{protect}=require('../middlewares/authMiddleware');
const {
  registerStudentValidator,
  loginValidator,
}  =require( "../validators/authValidator.js");

const router = express.Router();

router.post("/register", validate(registerStudentValidator), register);
router.post("/login", validate(loginValidator), login);

router.get("/getMe",protect,getMe);

router.post("/forgotPassword", forgotPassword); 
router.patch("/resetPassword/:resetToken", resetPassword);


module.exports= router;