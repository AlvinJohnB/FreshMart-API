const express = require('express');
const router = express.Router();

const { verify, verifyAdmin } = require("../middleware/auth");

const productController = require('../controllers/productController');

// GET all products
router.get('/getAllProducts', productController.getAllProducts);

// POST a new product
router.post('/createProduct', verify, verifyAdmin, productController.createProduct);

// GET all active products
router.get('/getActiveProducts', productController.getActiveProducts);


module.exports = router;
