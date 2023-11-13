const express = require("express");
const {
  loginController,
  registerController,
  forgotPasswordController,
  resetPasswordController,
  getAllUsersController,
} = require("../controllers/userController");

//router object
const router = express.Router();

//routers
// POST || LOGIN USER
router.post("/login", loginController);

//POST || REGISTER USER
router.post("/register", registerController);

// POST || FORGOT PASSWORD
router.post("/forgot-password", forgotPasswordController);

// POST || RESET PASSWORD
router.post("/reset-password", resetPasswordController);

// GET || GET ALL USERS
router.get("/users", getAllUsersController);

module.exports = router;
