const Product  = require('../models/products');


const addProduct = async (req) => {
    console.log(req.body);
    
    const { name, price, quantity, unit, shopId,image,quantityInStock } = req.body;

    // Validate input (if not using a middleware)
    if (!name || !price || !quantity || !unit || !shopId) {
        return {
            status: 400,
            message: 'All fields are required',
        };
    }

    try {
        // Sanitize input (you might want to add additional checks here)
        const sanitizedName = name.trim();
        const sanitizedUnit = unit.trim();

        const newProduct = await Product.create({
            name: sanitizedName,
            price: parseFloat(price),
            quantity: parseInt(quantity, 10),
            unit: sanitizedUnit,
            shopId: shopId.trim(),
            image:image,
            quantityInStock: parseInt(quantityInStock, 10),
            
        });

        return {
            status: 201,
            message: 'Product added successfully',
            product: newProduct,
        };
    } catch (error) {
        console.error('Error adding product:', error);

        return {
            status: 500,
            message: error.message || 'Internal Server Error',
        };
    }
};
const allProducts = async (req) => {
    try {
        const products = await Product.find(req.params.shopId ? { shopId: req.params.shopId } : {});
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
