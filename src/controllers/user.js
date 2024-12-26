const {
    getMe,
    registerEmployee

} = require("../services/user.js");

const getMeController = async (req, res) => {
    try {
      const response = await getMe(req);
      return res.status(response.status).json({
        message: response.message,
        user: response.user || null,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  const RegisterEmployee = async (req, res) => {
    try {
      const response = await registerEmployee(req);
      return res.status(response.status).json({
        message: response.message,
        user: response.user || null,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

module.exports = {
    getMeController,
    RegisterEmployee
};