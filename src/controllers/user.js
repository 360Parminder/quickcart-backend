const {
    getMe,
    registerEmployee,
    getShop,
    getAllEmployees

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
  const GetAllEmployees = async(req,res)=>{
    try {
      const response = await getAllEmployees(req);
      return res.status(response.status).json({
        message: response.message,
        employees: response.employees || null,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  const GetShop = async(req,res)=>{
    try {
      const response = await getShop(req);
      return res.status(response.status).json({
        message: response.message,
        shop: response.shop || null,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

module.exports = {
    getMeController,
    RegisterEmployee,
    GetAllEmployees,
    GetShop
};