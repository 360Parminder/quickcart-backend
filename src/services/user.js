const { generateEmployeeId } = require("../../utils/genrateShopeId");
const Shop = require("../models/shop");
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
  const { firstname, lastname, email, password, role, mobile } = req.body;
  const shopId = req.user.shopId;
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
      firstName: firstname,
      lastName: lastname,
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
        firstname: user.firstName,
        lastname: user.lastName,
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
const getAllEmployees = async (req) => {
  try {
    const employees = await User.find({ shopId: req.user.shopId });
    if (!employees) {
      return {
        status: 404,
        message: "Employees not found",
      };
    }

    return {
      status: 200,
      message: "Employees fetched successfully",
      employees: employees,
    };
  } catch (error) {
    console.error("Error fetching employees: ", error);
    return {
      status: 500,
      message: error?error.message:"Server error, please try again later.",
    };
  }
};
const getShop = async (req) => {
  try {
    const shop = await Shop.find({shopId:req.user.shopId});
    if (!shop) {
      return {
        status: 404,
        message: "Shop not found",
      };
    }

    return {
      status: 200,
      message: "Shop fetched successfully",
      shop: shop,
    };
  } catch (error) {
    console.error("Error fetching shop: ", error);
    return {
      status: 500,
      message: "Server error, please try again later.",
    };
  }
};


module.exports = {
  getMe,
  registerEmployee,
  getAllEmployees,
  getShop,
};
