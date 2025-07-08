const Cart = require("../models/Cart");
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const { errorHandler } = require("../middleware/errorHandler");
const { checkUserExistInCart } = require("../helpers/helper");


module.exports.checkout = async (req, res) => {
  const userIDFromToken = req.user.id; 
  try {
   const cart = await checkUserExistInCart(userIDFromToken);

    console.log(cart.cartItems.length);
    
    if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
      return res.status(400).send({ error: "No Items to Checkout."})
    }else{
      console.log(cart.cartItems);
      const newOrder = new Order({
            userId: userIDFromToken,
            productsOrdered: cart.cartItems,
            totalPrice: cart.totalPrice,
          });

          await newOrder.save();

          // Step 3: Clear the user's cart
          cart.cartItems = [];
          cart.totalPrice = 0;
          await cart.save();

          res.status(201).json({ orders: newOrder });
    }
  } catch (error) {
    errorHandler(error, req, res);
  }
};


module.exports.myOrders = async (req, res) => {
  try {
  return true;
  } catch (error) {
    errorHandler(error, req, res);
  }
};


module.exports.allOrders = async (req, res) => {
  try {
  return true;
  } catch (error) {
    errorHandler(error, req, res);
  }
};

