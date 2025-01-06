
const { default: axios } = require("axios");
const Payment = require("../models/payment");
const { createBillPDF } = require("../../utils/pdfgenerate");
const { sendEmail } = require("../../utils/nodemailer");
const { sendSMS } = require("../../utils/twillo");
const Shop = require("../models/shop");


const generatePayment = async (req) => {
    const {
        amount,
        customerName,
        paymentMethod,
        mobile,
        email,
        items,
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
        receiptId,
        status
    } = req.body;

    if (!amount || !customerName || !paymentMethod || !mobile) {
        return {
            status: 400,
            message: "All required fields (amount, customerName, paymentMethod, mobile) must be provided."
        };
    }

    try {
        const paymentData = {
            receiptId,
            amount,
            customerName,
            shopId: req.user?.shopId || null,
            paymentMethod,
            mobile,
            email,
            items,
            status
        };

        // Add Razorpay details if payment method is 'online'
        if (paymentMethod === 'online') {
            if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
                return {
                    status: 400,
                    message: "Razorpay details are required for online payments."
                };
            }
            paymentData.razorpayOrderId = razorpayOrderId;
            paymentData.razorpayPaymentId = razorpayPaymentId;
            paymentData.razorpaySignature = razorpaySignature;
        }

        const payment = await Payment.create(paymentData);
        if (!payment) {
            return {
                status: 400,
                message: "Failed to create payment record."
            };
        }

        console.log("Shop ID:", req.user?.shopId);

        const shopDetails = await Shop.findOne({ shopId: req.user?.shopId });
        if (!shopDetails) {
            return {
                status: 404,
                message: "Shop details not found."
            };
        }

        const billDetails = {
            shopName: shopDetails.shopName,
            gstNumber: shopDetails.gstNumber,
            contactDetails: shopDetails.email,
            ownerName: shopDetails.owner,
            createdBy: req.user?.name || "Admin",
            billDate: new Date().toLocaleDateString(),
            products: items,
            totalAmount: amount,
        };

        const billPdf = await createBillPDF(billDetails);
        if (!billPdf) {
            return {
                status: 500,
                message: "Failed to generate bill PDF."
            };
        }

        if (email) {
            try {
                await sendEmail(email, billPdf);
                console.log("Email sent successfully.");
            } catch (emailError) {
                console.error("Failed to send email:", emailError.message);
            }
        }

        try {
            const smsResponse = await sendSMS(mobile, billPdf);
            console.log("SMS sent successfully:", smsResponse);
        } catch (smsError) {
            console.error("Failed to send SMS:", smsError.message);
        }

        return {
            status: 200,
            message: "Payment generated successfully.",
            payment
        };
    } catch (error) {
        console.error("Error generating payment:", error.message);
        return {
            status: 500,
            message: "An internal server error occurred. Please try again later."
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