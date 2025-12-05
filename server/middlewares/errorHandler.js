const AppError =require("../utils/appError");

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    err = new AppError(`Duplicate ${field}: ${value}. Please use another value.`, 400);
  }

  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((el) => el.message);
    err = new AppError(`Invalid input data: ${errors.join(". ")}`, 400);
  }


  if (err.name === "JsonWebTokenError") err = new AppError("Invalid token. Please log in again.", 401);
  if (err.name === "TokenExpiredError") err = new AppError("Your token has expired. Please log in again.", 401);

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports= errorHandler;