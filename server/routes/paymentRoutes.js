const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const auth = require("../middlewares/authMiddleware");

router.use(auth.protect);

router.post("/request-approval", paymentController.requestMembershipApproval);
router.get("/history", paymentController.getPaymentHistory);

module.exports = router;