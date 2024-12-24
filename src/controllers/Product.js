const { addProduct, allProducts } = require("../services/Product");

const AddProduct = async (req, res) => {
    try {
        const response = await addProduct(req);
        return res.status(response.status).json({
            message: response.message,
            product: response.product || null,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
const AllProducts = async (req, res) => {
    
    try {
        const response = await allProducts(req);
        return res.status(response.status).json({
            message: response.message,
            products: response.products || null,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = { 
    AddProduct
    , AllProducts
 };