const express = require("express");
const multer = require("multer");
const { AddProduct, AllProducts } = require("../controllers/Product");

const ProductRouter = express.Router();

// Configure Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log(file);
        cb(null, "uploads/"); // Save files in the 'uploads' folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname); // Unique filename
    },
});

const upload = multer({ storage });

// Apply `upload.single` middleware to handle image uploads
ProductRouter.post("/addProduct", upload.single("image"), AddProduct);
ProductRouter.get("/allProducts", AllProducts);

module.exports = ProductRouter;
