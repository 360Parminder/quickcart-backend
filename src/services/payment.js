
const { default: axios } = require("axios");
const Payment = require("../models/payment");
const { createBillPDF } = require("../../utils/pdfgenerate");
const { sendEmail } = require("../../utils/nodemailer");
const { sendSMS } = require("../../utils/twillo");


const generatePayment = async (req) => {
    const { amount, customerName, paymentMethod, mobile,email, items, razorpayOrderId, razorpayPaymentId, razorpaySignature,receiptId,status } = req.body;

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
            email,
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
        const billDetails = {
            shopName: 'Super Mart',
            gstNumber: '29ABCDE1234FZ1',
            contactDetails: '+91 9876543210',
            ownerName: 'John Doe',
            createdBy: 'Jane Smith',
            billDate: new Date().toLocaleDateString(),
            products: [
                { name: 'Milk', price: 50, quantity: 2 },
                { name: 'Bread', price: 30, quantity: 1 },
                { name: 'Butter', price: 150, quantity: 1 },
            ],
            totalAmount: 280, // Sum of all product totals
        };
       const billPdf= await createBillPDF(billDetails);
       console.log(billPdf);
       const billMail = await sendEmail(email,billPdf);
       console.log(billMail);
       const billPhone = await sendSMS(mobile,billPdf);
         console.log(billPhone);
       
       

        return {
            status: 200,
            message: "Payment generated successfully",
            payment: payment
        };

    } catch (error) {
        console.log(error);
        
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