const mongoose= require("mongoose");
const bcrypt =require("bcrypt");
const crypto=require("crypto");

const studentSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
    },
regNumber: {
  type: String,
  required: [true, "Registration number is required"],
  unique: true,
  uppercase: true,
  trim: true,
  validate: {
    validator: function (v) {
      return /^[TE]\d{2}-\d{2}-\d{5}$/.test(v);
    },
    message: (props) =>
      `${props.value} is invalid! Use format: T24-03-16678 or E25-01-12345`,
  },
},
    program: {
      type: String,
      enum: ["Actuarial Science"],
      default: "Actuarial Science",
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },
    isMembershipActive: {
      type: Boolean,
      default: false,
    },
    membershipExpiry: {
      type: Date,
    },
    passwordResetToken:String,
    passwordExpiresAt:Date,
    paymentHistory: [
      {
        amount: { type: Number, default: 2000 },
        paidAt: { type: Date, default: Date.now },
        method: { type: String, enum: ["M-Pesa", "Tigo Pesa", "Airtel Money"] },
        status:{type:String,enum:["pending","completed"]},
        checkoutRequestID:String
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

studentSchema.index({ isMembershipActive: 1 });
studentSchema.index({fullName:'text',regNumber:'text'});

studentSchema.pre("save", async function () {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
});

studentSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

studentSchema.methods.createResetPasswordToken=async function(){
const passwordToken=crypto.randomBytes('32').toString("hex");
this.passwordResetToken=crypto.createHash('sha256').update(passwordToken).digest('hex')
this.passwordExpiresAt=Date.now()+(1000*60*60);
return passwordToken;
}

module.exports= mongoose.model("Student", studentSchema);