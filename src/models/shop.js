const mongoose = require("mongoose");
// import { default as accounts } from "razorpay/dist/types/accounts";

const { Schema } = mongoose;

const shopSchema = new Schema({

  shopName: {
    type: String,
    required: true,
  },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    country: { type: String, required: true },
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
  // orders: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "Order",
  //   },
  // ],
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
  shopId: {
    type: String,
    required: true,
  },
});

module.exports= mongoose.model("Shop", shopSchema);


