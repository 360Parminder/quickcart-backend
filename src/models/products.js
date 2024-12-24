const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema(
  {

    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number, // Changed from Float32Array to Number
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      required: true,
      enum: ['kg', 'g', 'ltr', 'ml', 'pcs'], // Allowed values
  },
    shopId: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    quantitySold: {
      type: Number,
      default: 0,
    },
    quantityInStock: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("Product", productSchema);

