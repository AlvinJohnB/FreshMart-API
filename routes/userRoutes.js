// s51
router.post("/user-details", verify, userController.userDetails);
router.patch('/make-admin', verify, verifyAdmin, userController.makeAdmin);
router.patch("/reset-password", verify, userController.resetPassword);
// s51