const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/Payment");
const { verifyToken } = require("../middleware/VerifyToken");

router.post("/create-order", verifyToken, paymentController.createOrder);
router.post("/verify", verifyToken, paymentController.verifyPayment);

module.exports = router;