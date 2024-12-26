const express = require("express");

const userRouter = express.Router();

const { getMeController, RegisterEmployee } = require("../controllers/user");

userRouter.get("/me", getMeController);
userRouter.post("/registerEmployee", RegisterEmployee);

module.exports = userRouter;
