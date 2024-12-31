
const Payment = require("../models/payment");

const generatePayment = async (req) => {
    const { amount, customerName, paymentMethod, mobile, items, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    if (!amount || !customerName || !paymentMethod || !mobile) {
        return {
            status: 400,
            message: "All fields are required"
        };
    }

    try {
        const paymentData = {
            amount,
            customerName,
            shopId: req.user.shopId,
            paymentMethod,
            mobile,
            items
        };

        // Add Razorpay details if payment method is 'online'
        if (paymentMethod === 'online') {
            paymentData.razorpayOrderId = razorpayOrderId;
            paymentData.razorpayPaymentId = razorpayPaymentId;
            paymentData.razorpaySignature = razorpaySignature;
        }

        const payment = await Payment.create(paymentData);

        if (!payment) {
            return {
                status: 400,
                message: "Payment not generated"
            };
        }

        return {
            status: 200,
            message: "Payment generated successfully",
            payment: payment
        };

    } catch (error) {
        return {
            status: 500,
            message: error ? error.message : "Internal server error"
        };
    }
};

const getAllPayments = async (req) => {
    const shopId = req.params.shopId;
    try {
        const payments = await Payment.find( shopId);
        if (!payments) {
            return {
                status: 400,
                message: "No payments found"
            }
        }
        return {
            status: 200,
            message: "Payments found",
            payments: payments
        }
    } catch (error) {
        return {
            status: 500,
            message: error ? error?.message : "Internal server error"
        }
    }
}

module.exports = {
    generatePayment,
    getAllPayments
};