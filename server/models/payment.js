// models/Payment.js
const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },
  
  amount: {
    type: Number,
    required: true,
    min: 100,
    max: 1000000
  },
  
  currency: {
    type: String,
    default: "TZS"
  },
  
  phone: {
    type: String,
    required: true
  },
  
  provider: {
    type: String,
    required: true,
    enum: ["mpesa", "tigopesa", "airtelmoney", "halopesa"],
    index: true
  },
  
  transactionId: {
    type: String,
    index: true
  },
  
  reference: {
    type: String,
    required: true,
    index: true
  },
  
  status: {
    type: String,
    required: true,
    enum: ["pending", "initiated", "processing", "completed", "failed", "cancelled"],
    default: "pending",
    index: true
  },
  
  providerResponse: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  
  metadata: {
    userAgent: String,
    ip: String,
    device: String,
    browser: String
  },
  
  completedAt: {
    type: Date
  },
  
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// CORRECTED INDEXES - Use string field names with 1 for ascending order
paymentSchema.index({ userId: 1, status: 1 });
paymentSchema.index({ createdAt: -1 });
paymentSchema.index({ provider: 1, status: 1 });
paymentSchema.index({ reference: 1 });

// Virtual for checking if payment is expired
paymentSchema.virtual('isExpired').get(function() {
  return this.expiresAt && new Date() > this.expiresAt && this.status === 'pending';
});

// Virtual for payment duration
paymentSchema.virtual('duration').get(function() {
  if (this.completedAt && this.createdAt) {
    return this.completedAt - this.createdAt;
  }
  return null;
});

paymentSchema.pre('save', async function() {
  if (this.isExpired && this.status === 'pending') {
    this.status = 'cancelled';
  }
});

const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;