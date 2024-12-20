const express = require("express");
const router = express.Router();

const userRouter = require("./user");
const auth = require("../../middleware/auth");

const { signupController, loginController } = require("../controllers/index");

router.post("/signup", signupController);
router.post("/login", loginController);

router.use("/user", auth, userRouter);

module.exports = router;
