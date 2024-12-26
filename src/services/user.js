const { generateEmployeeId } = require("../../utils/genrateShopeId");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

const getMe = async (req) => {
  try {
    const user = await User.findById(req.user._id).select("-password -authKey");
    if (!user) {
      return {
        status: 404,
        message: "User not found",
      };
    }

    return {
      status: 200,
      message: "User fetched successfully",
      user: user,
    };
  } catch (error) {
    console.error("Error fetching user: ", error);
    return {
      status: 500,
      message: "Server error, please try again later.",
    };
  }
};

const registerEmployee = async (req) => {
  const { name, email, password, role, mobile, shopId } = req.body;

  try {
    // Check if a user with the same mobile number already exists
    const userExists = await User.findOne({ mobile });
    
    if (userExists && userExists.shopId === shopId) {
      return {
        status: 400,
        message: "Employee with this mobile number already exists in this shop.",
      };
    }

    // Hash the password before saving to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      mobile,
      shopId,
      employeeId: generateEmployeeId(),
    });

    if (!user) {
      return {
        status: 400,
        message: "User could not be created.",
      };
    }

    return {
      status: 200,
      message: "User created successfully",
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        mobile: user.mobile,
        shopId: user.shopId,
        employeeId: user.employeeId,
      },
    };
  } catch (error) {
    console.error("Error registering employee: ", error);
    return {
      status: 500,
      message: "Server error, please try again later.",
    };
  }
};

module.exports = {
  getMe,
  registerEmployee,
};
