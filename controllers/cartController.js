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
  const userId = req.user.id;
  const { productId, newQuantity } = req.body;

  if (!productId) {
    return res.status(400).json({ message: "Product ID is required" });
  }

  if (newQuantity === undefined || isNaN(newQuantity) || newQuantity < 0) {
    return res.status(400).json({ message: "Valid quantity is required" });
  }

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Find the product in the cart
    const productIndex = cart.cartItems.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (productIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    if (newQuantity === 0) {
      // Remove the item if quantity is 0
      cart.cartItems.splice(productIndex, 1);
    } else {
      // Update quantity and subtotal
      const product = cart.cartItems[productIndex];
      product.quantity = newQuantity;
      product.subtotal = product.quantity * product.price;
    }

    // Recalculate total price
    cart.totalPrice = cart.cartItems.reduce(
      (total, item) => total + item.subtotal,
      0
    );

    await cart.save();
    return res.status(200).json({
      message: "Cart updated successfully",
      updatedCart: cart,
    });
  } catch (error) {
    return errorHandler(error, req, res);
  }
};
