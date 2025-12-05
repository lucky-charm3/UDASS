const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
    action: { type: String, required: true },
    description: { type: String },
    status:{type:String,enum:["success","error"]},
    ip: String,
    userAgent: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("ActivityLog", activityLogSchema);
