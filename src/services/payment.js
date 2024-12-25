
const Payment = require("../models/payment");

const generatePayment = async (req) => {
    const { amount, customerName, shopId, paymentMethod, mobile, items } = req.body;

    if (!amount || !customerName || !shopId || !paymentMethod || !mobile) {
        return {
            status: 400,
            message: "All fields are required"
        }
    }
    try {
        const payment = await Payment.create({
            amount,
            customerName,
            shopId,
            paymentMethod,
            mobile,
            items,

        });
        if (!payment) {
            return {
                status: 400,
                message: "Payment not generated"
            }
        }
        return {
            status: 200,
            message: "Payment generated successfully",
            payment: payment
        }

    } catch (error) {

        return {
            status: 500,
            messagee: error ? error?.message : "Internal server error"
        }
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