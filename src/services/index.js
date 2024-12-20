const User = require("../models/user");
const Account = require("../models/accounts");
const Shop = require("../models/shop");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const signup = async (req) => {
    try {
      const {
        shopName,
        ownerName,
        email,
        accountNumber,
        holderName,
        ifsc,
        street,
        city,
        state,
        zip,
        country,
        mobile,
        role,
        password,

      } = req.body;
  
      // Validate required fields
      if (
        !ownerName ||
        !mobile ||
        !password ||
        !role||
        !shopName||
        !email||
        !accountNumber||
        !holderName||
        !ifsc||
        !street||
        !city||
        !state||
        !zip||
        !country

      ) {
        return { status: 400, message: "All fields are required" };
      }
  
      // Check for existing user
      const existingUser = await User.findOne({ mobile });
      if (existingUser) {
        return { status: 400, message: "User already exists" };
      }
  
      // Hash password and create new user
      const hashedPassword = await bcryptjs.hash(password, 12);
      const user = await User.create({
          ownerName,
          mobile,
          role,
          password: hashedPassword,
      });
      const account = await Account.create({
        accountNumber,
        holderName,
        ifsc,
        shopId: user._id, // create a shop id
      });
      const shop = await Shop.create({
        shopName,
        email,
        street,
        city,
        state,
        zip,
        country,
        owner: user._id,
      });
  
      return { status: 201, message: "User created successfully", user };
    } catch (error) {
      return { status: 500, message: error.message };
    }
  };
  
  const login = async (req) => {
    try {
      const { mobile, password } = req.body;
  
      // Validate required fields
      if (!mobile || !password) {
        return { status: 400, message: "Mobile and password are required" };
      }
  
      // Find user by mobile
      const user = await User.findOne({ mobile });
      if (!user) {
        return { status: 404, message: "User not found" };
      }
  
      // Validate password
      const isPasswordValid = await bcryptjs.compare(password, user.password);
      if (!isPasswordValid) {
        return { status: 401, message: "Invalid password" };
      }
  
      // Generate JWT token
      const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
        expiresIn: "7d",
      });
  
      // Update auth key in user record
      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        { authKey: token },
        { new: true }
      );
      if (!updatedUser) {
        return { status: 500, message: "Authentication failed" };
      }
  
      return {
        status: 200,
        message: "User logged in successfully",
        token,
      };
    } catch (error) {
      return { status: 500, message: error.message };
    }
  };

  module.exports = { signup, login };