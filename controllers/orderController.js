const Cart = require("../models/Cart");
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const { errorHandler } = require("../middleware/errorHandler");
const { checkUserExistInCart } = require("../helpers/helper");

module.exports.checkout = async (req, res) => {
  const { userId } = req.user.id;
  try {
    // find user cart
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // check if cart is empty
    if (cart.items.length === 0) {
      return res.status(400).json({ message: "No items to checkout" });
    }

    // create order
    const order = new Order({
      userId,
      productsOrdered: cart.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        subtotal: item.subtotal,
      })),
      total: cart.total,
    });

    await order.save();

    // clear cart
    await Cart.deleteOne({ userId });

    return res
      .status(201)
      .json({ message: "Order created successfully", order });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

module.exports.myOrders = async (req, res) => {
  const userId = req.user.id;
  try {
    // find orders for the user
    const userOrders = await Order.find({ userId });
    if (!userOrders || userOrders.length === 0) {
      return res.status(404).json({ message: "No orders found for this user" });
    }
    return res.status(200).json({ orders: userOrders });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

module.exports.allOrders = async (req, res) => {
  try {
    // find all orders
    const allOrders = await Order.find();
    if (!allOrders || allOrders.length === 0) {
      return res.status(404).json({ message: "No orders found" });
    }
    return res.status(200).json({ orders: allOrders });
  } catch (error) {
    errorHandler(error, req, res);
  }
};
