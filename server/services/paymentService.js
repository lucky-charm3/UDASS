const Payment = require("../models/payment");
const AppError = require("../utils/appError");

const createManualPaymentRequest = async (userId, phone, transactionId) => {
  const existingPending = await Payment.findOne({ 
    userId: userId, 
    status: 'pending_approval' 
  });

  if (existingPending) {
    throw new AppError("You already have a pending request. Please wait for Admin approval.", 400);
  }

  const payment = await Payment.create({
    userId: userId,
    amount: 2000,
    phone: phone,
    transactionId: transactionId || `MANUAL_${Date.now()}`,
    provider: 'manual',
    status: 'pending_approval',
    reference: `REQ_${Date.now()}`
  });

  return payment;
};

const getUserPaymentHistory = async (userId) => {
  return await Payment.find({ userId }).sort({ createdAt: -1 });
};

module.exports = {
  createManualPaymentRequest,
  getUserPaymentHistory
};