const User = require("../models/User");
const Cart = require("../models/Cart");
const { errorHandler } = require("../middleware/errorHandler");


module.exports.checkUserExistInCart = (req,res,userID) => {
	return Cart.findOne({ userId : userID })
    .then(result => {
    console.log("checkUserExistInCart "+ result)
        if (result) {
            return result._id;
        } else {
            return false;
        };
    })
    .catch(error => errorHandler(error, req, res));
};


module.exports.checkUserExistInUser = (req,res,userID) => {
	return User.findOne({_id : userID })
    .then(result => {
        if (result) {
            return result._id;
        } else {
            return false;
        };
    })
    .catch(error => errorHandler(error, req, res));
};


module.exports.checkCartHasThisProductId = (req,res,cartID,productIdToCheck) => {
	return Cart.findById(cartID)
	.then(result => {
		const currentCartItems = result.cartItems;
		return currentCartItems.some(item => item.productId.toString() === productIdToCheck.toString());
	})
	.catch(error => errorHandler(error, req, res));
};






