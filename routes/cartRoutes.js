const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const { verify } = require("../middleware/auth");

router.post("/add-to-cart", verify, cartController.addToCart);
router.get("/get-cart", verify, cartController.getCart);
router.patch(
  "/update-cart-quantity",
  verify,
  cartController.updateCartQuantity
);

module.exports = router;
