const { generatePayment, getAllPayments, generateOrderId } = require("../services/payment");


const GeneratePayment = async (req, res) => {
    try {
        const response = await generatePayment(req);
        return res.status(response.status).json({
            message: response.message,
            payment: response.payment || null,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
const GetAllPayments = async (req, res) => {
    try {
        const response = await getAllPayments(req);
        return res.status(response.status).json({
            message: response.message,
            payments: response.payments || null,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
const GenerateOrderId =async (req, res) => {
    try {
        const response = await generateOrderId(req);
        return res.status(response.status).json({
            message: response.message,
            orderId: response.orderId || null,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = {
    GeneratePayment,
    GetAllPayments,
    GenerateOrderId
}