const paymentService = require("../services/paymentService"); 
const sendEmail = require("../services/emailService");
const logActivity = require("../repositories/activityLogRepository");
const asyncHandler = require("../middlewares/asyncHandler"); 

const requestMembershipApproval = asyncHandler(async (req, res) => {
  const { phoneUsed, transactionId } = req.body;
  const user = req.user;

  const payment = await paymentService.createManualPaymentRequest(
    user._id, 
    phoneUsed, 
    transactionId
  );

  await sendEmail({
    to: user.email,
    subject: "UDASS Membership Request Received",
    html: `
      <div>
        <h2>Request Received</h2>
        <p>Dear ${user.fullName},</p>
        <p>We have received your payment details (Phone: ${phoneUsed}).</p>
        <p>An admin will verify it shortly.</p>
      </div>
    `
  });


  const adminEmail = process.env.ADMIN_EMAIL || "admin@udass.co.tz";
  await sendEmail({
    to: adminEmail,
    subject: "Action Required: New Payment",
    html: `
      <div>
        <h3>New Membership Payment</h3>
        <p>User: ${user.fullName} (${user.regNumber})</p>
        <p>Phone: ${phoneUsed}</p>
        <p>Transaction ID: ${transactionId || 'N/A'}</p>
        <p>Please login to dashboard to approve.</p>
      </div>
    `
  });

  await logActivity(user._id, "PAYMENT_REQUEST", "Requested manual membership approval", req);

  res.status(200).json({ 
    success: true, 
    message: "Request sent successfully",
    data: payment
  });
});

const getPaymentHistory = asyncHandler(async (req, res) => {
  const payments = await paymentService.getUserPaymentHistory(req.user._id);
  
  res.status(200).json({ 
    success: true, 
    data: { payments } 
  });
});

module.exports = { requestMembershipApproval, getPaymentHistory };