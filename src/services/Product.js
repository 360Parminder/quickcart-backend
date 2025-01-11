
const { uploadImage } = require('../../utils/cloudinary');
const { genrateProductId } = require('../../utils/genrateShopeId');
const Product  = require('../models/products');


const addProduct = async (req) => {
    const { name, price, quantity, unit, quantityInStock } = req.body;

    // Validate required fields
    if (!name || !price || !quantity || !unit || !quantityInStock || !req.file) {
        return {
            status: 400,
            message: "All fields are required",
        };
    }

    try {
        // Upload the image to Cloudinary
        const { path: filePath, originalname: fileName } = req.file;
        const uploadResult = await uploadImage(filePath, fileName);
        // Save product details, including the uploaded image URL
        const newProduct = await Product.create({
            name: name.trim(),
            price: parseFloat(price),
            quantity: parseInt(quantity, 10),
            unit: unit.trim(),
            shopId: req.user.shopId.trim(),
            image: uploadResult.url, // Save the Cloudinary URL to the database
            quantityInStock: parseInt(quantityInStock, 10),
            productId:genrateProductId(),
        });

        return {
            status: 201,
            product: newProduct,
            message: "Product added successfully",
        };
    } catch (error) {
        console.error("Error adding product:", error);
        return {
            status: 500,
            message: error.message || "Internal Server Error",
        };
    }
};

const allProducts = async (req) => {
    try {
        const products = await Product.find(req.user.shopId ? { shopId:req.user.shopId } : {});
        return {
            status: 200,
            products,
        };
    } catch (error) {
        return {
            status: 500,
            message: error.message || 'Internal Server Error',
        };
    }
}

module.exports = {
    addProduct,
    allProducts,
};
