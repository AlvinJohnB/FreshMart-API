const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { verify, verifyAdmin } = require("../middleware/auth");

router.post("/register", userController.registerUser);

router.post("/login", userController.loginUser);

router.get("/details", verify, userController.userDetails);

router.patch(
  "/:id/set-as-admin",
  verify,
  verifyAdmin,
  userController.makeAdmin
);

router.patch("/update-password", verify, userController.updatePassword);

module.exports = router;
