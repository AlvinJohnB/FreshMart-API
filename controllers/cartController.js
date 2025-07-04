const Cart = require("../models/Cart");
const User = require("../models/User");
const Product = require("../models/Product");
const { errorHandler } = require("../middleware/errorHandler");
const { checkUserExistInCart, checkCartHasThisProductId } = require("../helpers/helper");



module.exports.addToCart = async (req, res) => {
  	const userIDFromToken = req.user.id;
  	const isUserCartExist = await checkUserExistInCart(userIDFromToken)

  	const cartItems = req.body.cartItems;
  	if(isUserCartExist){
  		console.log(isUserCartExist)
  		// return res.status(400).json({ message: 'Already has cart.' });

  		// check if the cart id 
  		for (let item of cartItems) {
  		  if (checkCartHasThisProductId(item.productId)) {
  		  	console.log('found')
  		    throw new Error(`Duplicate product detected: ${item.productId}`);
  		  }

  		  // process normally if not duplicate
  		}

  	}

  	// console.log(isUserCartExist,checkUsersCart)

  	// 
  	try {
  	    const { userId, cartItems } = req.body;

  	    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
  	      return res.status(400).json({ message: 'Cart must contain at least one item.' });
  	    }

  	    let totalPrice = 0;

  	    // Calculate subtotal for each item
  	    const updatedItems = await Promise.all(
  	      cartItems.map(async (item) => {
  	        const product = await Product.findById(item.productId);
  	        if (!product) {
  	          throw new Error(`Product not found: ${item.productId}`);
  	        }

  	        const subtotal = product.price * item.quantity;
  	        totalPrice += subtotal;

  	        return {
  	          productId: item.productId,
  	          quantity: item.quantity,
  	          subtotal,
  	        };
  	      })
  	    );

  	    const newCart = new Cart({
  	      userId,
  	      cartItems: updatedItems,
  	      totalPrice,
  	    });

  	    const savedCart = await newCart.save();

  	    res.status(201).json({
  	    	message: "Item added to cart succesfully",
  	    	cart:savedCart
  	    });
  	  } catch (error) {
  	    console.error(error);
  	    res.status(500).json({ message: error.message || 'Failed to create cart' });
  	  }
  	// 
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