const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const accountSchema = new Schema({
  accountNumber: {
    type: String,
    required: true,
    unique: true,
  },
  ifsc: {
    type: String,
    required: true,
  },
  holderName: {
    type: String,
    required: true,
  },
  // bankName: {
  //   type: String,
  //   required: true,
  // },
  // branch: {
  //   type: String,
  //   required: true,
  // },
  shopId:{
    type:String,
    required:true,
  }
});

const Account = mongoose.model("Account", accountSchema);

module.exports = Account;
