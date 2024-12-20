const express = require("express");

const userRouter = express.Router();

const { getMeController } = require("../controllers/user");

userRouter.get("/me", getMeController);

module.exports = userRouter;
