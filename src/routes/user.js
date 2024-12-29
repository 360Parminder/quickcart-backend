const express = require("express");

const userRouter = express.Router();

const { getMeController, RegisterEmployee, GetShop, GetAllEmployees } = require("../controllers/user");

userRouter.get("/me", getMeController);
userRouter.get("/getShop", GetShop);
userRouter.post("/registerEmployee", RegisterEmployee);
userRouter.get("/getAllEmployees", GetAllEmployees);


module.exports = userRouter;
