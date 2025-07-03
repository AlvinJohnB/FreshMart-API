const Product = require('../models/Product');



// POST /products - Create a new product
module.exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, isActive } = req.body;

    // Create a new product instance
    const product = new Product({
      name,
      description,
      price,
      isActive
    });

    // Save to database
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(400).json({ message: error.message });
  }
};


// GET /products - Retrieve all products
module.exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error while fetching products' });
  }
};


// GET /products/active - Retrieve all active products
module.exports.getActiveProducts = async (req, res) => {
  try {
    const activeProducts = await Product.find({ isActive: true });
    res.status(200).json(activeProducts);
  } catch (error) {
    console.error('Error fetching active products:', error);
    res.status(500).json({ message: 'Server error while fetching active products' });
  }
};

