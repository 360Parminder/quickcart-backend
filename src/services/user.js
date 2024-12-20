const User = require("../models/user");

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
      return {
        status: 500,
        message: error.message,
      };
    }
  };

module.exports = {
    getMe
};