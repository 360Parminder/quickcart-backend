

const express = require("express");
const { GeneratePayment, GetAllPayments, GenerateOrderId } = require("../controllers/payments");

const PaymentRouter = express.Router();



PaymentRouter.post("/generatePayment", GeneratePayment);
PaymentRouter.get("/allPayments",GetAllPayments );
PaymentRouter.post("/generateOrderId",GenerateOrderId );
module.exports = PaymentRouter;
