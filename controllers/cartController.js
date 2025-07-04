const Cart = require("../models/Cart");
const { errorHandler } = require("../middleware/errorHandler");


module.exports.addToCart = async (req, res) => {
  return true;
};


module.exports.getCart = async (req, res) => {
  try {
    const products = await Cart.find();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server error while fetching products" });
  }
};


module.exports.updateCartQuantity = async (req, res) => {
  return true;
};