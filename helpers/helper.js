const User = require("../models/User");
const Cart = require("../models/Cart");
const { errorHandler } = require("../middleware/errorHandler");


module.exports.checkUserExistInCart = (userID) => {
	return Cart.findOne({ userId : userID })
    .then(result => {
    console.log(result)
        if (result) {
            return result._id;
        } else {
            return false;
        };
    })
    .catch(error => errorHandler(error, req, res));
};


module.exports.checkCartHasThisProductId = (productIdToCheck) => {
	Cart.findById(productIdToCheck)
	.then(result => {
		console.log(result)
		return result.some(item => item.productId.toString() === productIdToCheck.toString());
	})
	
};






