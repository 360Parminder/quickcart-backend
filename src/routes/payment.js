

const express = require("express");
const { GeneratePayment, GetAllPayments } = require("../controllers/payments");

const PaymentRouter = express.Router();



PaymentRouter.post("/generatePayment", GeneratePayment);
PaymentRouter.get("/allPayments",GetAllPayments );
module.exports = PaymentRouter;
