
const { default: axios } = require("axios");
const Payment = require("../models/payment");

const generatePayment = async (req) => {
    const { amount, customerName, paymentMethod, mobile, items, razorpayOrderId, razorpayPaymentId, razorpaySignature,receiptId,status } = req.body;

    if (!amount || !customerName || !paymentMethod || !mobile) {
        return {
            status: 400,
            message: "All fields are required"
        };
    }

    try {
        const paymentData = {
            receiptId,
            amount,
            customerName,
            shopId: req.user.shopId,
            paymentMethod,
            mobile,
            items,
            status
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
    try {
        const payments = await Payment.find({shopId: req.user.shopId});
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
const generateOrderId =async(req)=>{
    const { amount,receiptId } = req.body;
    try {
        const response = await axios.post(
          'https://api.razorpay.com/v1/orders',
          {
            "amount": amount * 100, // Amount in subunits (e.g., 10000 paise for INR 100)
            "currency": "INR",
            "receipt": receiptId,
          },
          {
            auth: {
              username: process.env.RAZORPAY_KEY, // Replace with your Razorpay Test Key
              password: process.env.RAZORPAY_SECRET, // Replace with your Razorpay Test Secret
            },
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
    
        // Return the receipt ID and the order ID returned by the Razorpay API
        console.log('Order created:', response.data);
        
        return {
            receiptId: response.data.receipt,
            orderId: response.data.id,
            success: true,
            status: 200,
            message: "Order created successfully"
         };
      } catch (error) {
        console.log(error);
        
        console.error('Error creating order:', error.response ? error.response.data : error.message);
        return { error: "Failed to create the order." };
      }
}

module.exports = {
    generatePayment,
    getAllPayments,
    generateOrderId
};