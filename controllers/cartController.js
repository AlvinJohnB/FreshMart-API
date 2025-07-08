const Cart = require("../models/Cart");
const User = require("../models/User");
const Product = require("../models/Product");
const { errorHandler } = require("../middleware/errorHandler");
const { checkUserExistInCart } = require("../helpers/helper");

module.exports.addToCart = async (req, res) => {
  const userIDFromToken = req.user.id;
  const { productId, quantity, subtotal } = req.body;

  try {
    const cart = await checkUserExistInCart(userIDFromToken);

    if (cart) {
      // Check cart items if product exists
      const productIndex = cart.cartItems.findIndex(
        (item) => item.productId.toString() === productId.toString()
      );
      if (productIndex !== -1) {
        // If product exists, update the quantity and subtotal
        cart.cartItems[productExists].quantity += quantity;
        cart.cartItems[productExists].subtotal += subtotal;
        cart.totalPrice += subtotal; // Update total price
        //   save the updated cart
        await cart.save();

        return res.status(200).json({
          message: "Item quantity updated successfully",
          cart,
        });
      } else {
        // If product does not exist, add it to the cart
        cart.cartItems.push({
          productId,
          quantity,
          subtotal,
        });
        //save the updated cart
        cart.totalPrice += subtotal; // Update total price
        await cart.save();

        return res.status(200).json({
          message: "Item added to cart successfully",
          cart,
        });
      }
    } else {
      // Creates a new cart if it doesn't exist
      const cart = new Cart({
        userId: userIDFromToken,
        cartItems: [
          {
            productId,
            quantity,
            subtotal,
          },
        ],
        totalPrice: subtotal,
      });
      await cart.save();
      return res.status(201).json({
        message: "Cart created and item added successfully",
        cart,
      });
    }
  } catch (error) {
    errorHandler(error, req, res);
  }
};

module.exports.getCart = async (req, res) => {
  const { userId } = req.user.id;
  try {
    const products = await Cart.findOne({ userId });

    if (products == null) {
      res.status(400).json({ message: "No cart found." });
    } else {
      res.status(200).json({ cart: products });
    }
  } catch (error) {
    errorHandler(error, req, res);
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

module.exports.removeFromCart = async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.params;

  const cart = await Cart.findOne({ userId });

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  const productIndex = cart.cartItems.findIndex(
    (item) => item.productId.toString() === productId
  );

  if (productIndex === -1) {
    return res.status(404).json({ message: "Item not found in cart" });
  }

  // Remove the item from the cart
  cart.cartItems.splice(productIndex, 1);

  // Recalculate total price
  cart.totalPrice = cart.cartItems.reduce(
    (total, item) => total + item.subtotal,
    0
  );

  await cart.save();
  return res.status(200).json({
    message: "Item removed from cart successfully",
    updatedCart: cart,
  });
};

module.exports.clearCart = async (req, res) => {
  const userId = req.user.id;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    if (cart.cartItems.length === 0) {
      return res.status(200).json({
        message: "Cart is already empty",
        updatedCart: cart,
      });
    }
    // Clear the cart items and reset total price
    cart.cartItems = [];
    cart.totalPrice = 0;
    await cart.save();
    return res.status(200).json({
      message: "Cart cleared successfully",
      updatedCart: cart,
    });
  } catch (error) {
    return errorHandler(error, req, res);
  }
};
