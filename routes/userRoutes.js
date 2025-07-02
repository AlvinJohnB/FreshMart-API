const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { verify, verifyAdmin } = require("../middleware/auth");

router.post("/register", userController.registerUser);

router.post("/login", userController.loginUser);

router.post("/user-details", verify, userController.userDetails);

router.patch("/make-admin", verify, verifyAdmin, userController.makeAdmin);

router.patch("/reset-password", verify, userController.resetPassword);

module.exports = router;
