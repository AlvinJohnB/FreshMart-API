const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { verify } = require("../middleware/auth");

router.post("/checkout", verify, orderController.checkout);
router.get("/my-orders", verify, orderController.myOrders);
router.get("/all-orders", verify, orderController.allOrders);


module.exports = router;