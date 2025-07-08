const Cart = require("../models/Cart");
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const { errorHandler } = require("../middleware/errorHandler");
const { checkUserExistInCart } = require("../helpers/helper");


module.exports.checkout = async (req, res) => {
  try {
  return true;
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

