const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError.js");
const Student = require("../models/studentModel.js");

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("You are not logged in. Please log in to get access.", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const currentUser = await Student.findById(decoded.id);

  if (!currentUser) {
    return next(new AppError("The user belonging to this token no longer exists.", 401));
  }

  req.user = currentUser;
  next();
};

const restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("You do not have permission to perform this action.", 403));
    }
    next();
  };

module.exports= { protect, restrictTo };