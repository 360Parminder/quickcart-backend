const express = require("express");
const router = express.Router();
const userRouter = require("./user");
const auth = require("../../middleware/auth");

const { signupController, loginController } = require("../controllers/index");
const ProductRouter = require("./Product");

router.post("/registerShop", signupController);
router.post("/login", loginController);
router.use("/user", auth, userRouter);
router.use("/Product", ProductRouter);


module.exports = router;
