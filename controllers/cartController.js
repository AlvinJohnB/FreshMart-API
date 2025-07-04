const Cart = require("../models/Cart");
const User = require("../models/User");
const Product = require("../models/Product");
const { errorHandler } = require("../middleware/errorHandler");
const { checkUserExistInCart, checkCartHasThisProductId } = require("../helpers/helper");



module.exports.addToCart = async (req, res) => {
  	const userIDFromToken = req.user.id;  
  	const { userId, cartItems } = req.body;
  	const cartID = await checkUserExistInCart(req,res,userIDFromToken)
  	
  	
  	let errorsArray = [];

  
  	if(cartID){ //<< if cart id is present
  		
  		// 
			for (const item of Object.values(cartItems)) {  //<< loop to check cartItems
			  const itemProduct = item.productId;
			  const product = await Product.findById(itemProduct);

			  if (!product) {
			  	errorsArray.push({ productId: itemProduct, error: 'Product not found' });
			    // return res.status(404).json({ message: 'Product not found' });
			    continue;
			  } 

				  const subtotal = product.price * item.quantity;
				  let cart = await Cart.findOne({ userId });

				  const isDuplicate = await checkCartHasThisProductId(req, res, cartID, itemProduct);

				  if (isDuplicate) {
				    // === If it's a duplicate: update the quantity and subtotal
				    const existingItemIndex = cart.cartItems.findIndex(
				      (itemIndex) => itemIndex.productId.toString() === itemProduct.toString()
				    );

				    if (existingItemIndex !== -1) {
				      cart.cartItems[existingItemIndex].quantity += item.quantity;
				      cart.cartItems[existingItemIndex].subtotal += subtotal;
				    }

				    errorsArray.push({ productId: itemProduct, error: 'Duplicate found' }); // track duplicates if needed
				    
				  } else {
				    // === If it's NOT a duplicate: add new item
				    cart.cartItems.push({
				      productId: itemProduct,
				      quantity: item.quantity,
				      subtotal: subtotal,
				    });
				  }

			  // Recalculate total
			  cart.totalPrice = cart.cartItems.reduce((sum, item) => sum + item.subtotal, 0);

			  await cart.save(); // Save after each item, or gather and save once at the end
			}

			// After loop finishes:
			const updatedCart = await Cart.findOne({ userId });
			res.status(201).send({message:"Cart Updated",error:errorsArray,cart:updatedCart});  		

  	}else{ //<<if cart id is not present
  		console.log("normal entry");
  		addToCartNormal(res,req, userId, cartItems)
  	}

};



const addToCartNormal = async (res,req, userId, cartItems) => {
	try {
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
}

const updateCartItems = async (res,req, userId, cartItems) => {}


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