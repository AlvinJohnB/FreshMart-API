const Product = require("../models/Product");
const { errorHandler } = require("../middleware/errorHandler");

// POST /products - Create a new product
module.exports.createProduct = async (req, res) => {
  try {
    const { name, description, price } = req.body;

    // Create a new product instance
    const product = new Product({
      name,
      description,
      price,
    });

    // Save to database
    const savedProduct = await product.save();
    return res.status(201).json(savedProduct);
  } catch (error) {
    errorHandler(error, req, res);
  }
};

// GET /products - Retrieve all products
module.exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server error while fetching products" });
  }
};

// GET /products/active - Retrieve all active products
module.exports.getActiveProducts = async (req, res) => {
  try {
    const activeProducts = await Product.find({ isActive: true });
    res.status(200).json(activeProducts);
  } catch (error) {
    console.error("Error fetching active products:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching active products" });
  }
};

module.exports.getProductById = async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    errorHandler(error, req, res);
  }
};

module.exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    const updateData = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updateData,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product updated successfully",
      success: true,
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

module.exports.archiveProduct = async (req, res) => {
  try {
    const productId = req.params.productId;

    // Find the product
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }

    // Check if product is already archived
    if (!product.isActive) {
      return res.status(200).json({
        message: "Product is already archived",
        archivedProduct: product,
      });
    }

    // Archive the product
    product.isActive = false;
    await product.save();

    return res.status(200).json({
      message: "Product archived successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error archiving product:", error);
    return errorHandler(error, req, res);
  }
};

module.exports.activateProduct = async (req, res) => {
  try {
    const productId = req.params.productId;

    // check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).send({ error: "Product not found" });
    }
    // check if product is already active
    if (product.isActive === true) {
      return res.status(200).json({
        message: "Product is already active",
        activateProduct: product,
      });
    } else {
      // Activate the product
      product.isActive = true;
      await product.save();
      return res.status(200).send({
        message: "Product activated successfully",
        success: true,
      });
    }
  } catch (error) {
    errorHandler(error, req, res);
  }
};
