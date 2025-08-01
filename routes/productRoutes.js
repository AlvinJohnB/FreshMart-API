const express = require("express");
const router = express.Router();

const { verify, verifyAdmin } = require("../middleware/auth");

const productController = require("../controllers/productController");

// GET all products
router.get("/all", verify, verifyAdmin, productController.getAllProducts);

// POST a new product
router.post("/", verify, verifyAdmin, productController.createProduct);

// GET all active products
router.get("/active", productController.getActiveProducts);

router.get("/:productId", productController.getProductById);

router.patch(
  "/:productId/update",
  verify,
  verifyAdmin,
  productController.updateProduct
);

router.patch(
  "/:productId/archive",
  verify,
  verifyAdmin,
  productController.archiveProduct
);

router.patch(
  "/:productId/activate",
  verify,
  verifyAdmin,
  productController.activateProduct
);

router.post("/search-by-name", productController.searchByName);

router.post("/search-by-price", productController.searchByPrice);

module.exports = router;
