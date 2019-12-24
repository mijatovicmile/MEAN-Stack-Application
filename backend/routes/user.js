const express = require("express");

// User Controller
const UserController = require("../controllers/user");

// Express router
const router = express.Router();

// Signup
router.post("/signup", UserController.signup);

// Login
router.post("/login", UserController.login);

// Export the user router module
module.exports = router;
