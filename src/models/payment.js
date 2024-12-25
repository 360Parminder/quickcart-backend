const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const paymentSchema = new Schema(
    {
        shopId: {
            type: String,
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        paymentMethod: {
            type: String,
            required: true,
            enum: ['online', 'cash'],
        },
        customerName: {
            type: String,
            required: true,
        },
        mobile: {
            type: String,
            required: true,
        },
        items: [
            {
                productId: {
                    type: String,
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                },
            },
        ],
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
);

module.exports = mongoose.model("Payment", paymentSchema);