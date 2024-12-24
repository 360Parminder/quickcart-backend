
const express = require("express");
const { AddProduct, AllProducts } = require("../controllers/Product");

const ProductRouter = express.Router();



ProductRouter.post("/addProduct", AddProduct);
ProductRouter.get("/allProducts", AllProducts);
module.exports = ProductRouter;
