const Joi= require("joi");

const registerStudentValidator = Joi.object({
  fullName: Joi.string().required().trim().messages({
    "string.empty": "Full name is required",
  }),
  email: Joi.string().email().required().lowercase().messages({
    "string.email": "Please provide a valid email",
    "string.empty": "Email is required",
  }),
  phone: Joi.string()
    .pattern(/^(\+255|0)[67]\d{8}$/)
    .required()
    .messages({
      "string.pattern.base": "Please provide a valid Tanzanian phone number (e.g. +255712345678)",
    }),
  regNumber: Joi.string()
    .uppercase()
    .regex(/^[TE]\d{2}-\d{2}-\d{5}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Invalid registration number. Must be like T24-03-16678 or E25-01-12345",
      "string.empty": "Registration number is required",
    }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters",
  }),
});

const loginValidator = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

module.exports={registerStudentValidator,loginValidator}