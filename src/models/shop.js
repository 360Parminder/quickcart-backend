const mongoose = require("mongoose");
const { default: accounts } = require("razorpay/dist/types/accounts");

const Schema = mongoose.Schema;

const shopSchema = new Schema({

  name: {
    type: String,
    required: true,
  },
  address: {
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  owner: {
    type: String,
    ref: "User",
    required: true,
  },
  accounts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
    },
  ],
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
  ],
  status: {
    type: String,
    default: "active",
    enum: ["active", "inactive"],
  },
  employees: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const Shop = mongoose.model("Shop", shopSchema);

module.exports = Shop;
