const User = require("../models/User");
const Cart = require("../models/Cart");
const { errorHandler } = require("../middleware/errorHandler");

module.exports.checkUserExistInCart = (userID) => {
  return Cart.findOne({ userId: userID })
    .then((result) => {
      if (result) {
        return result;
      } else {
        return false;
      }
    })
    .catch((error) => errorHandler(error, req, res));
};
