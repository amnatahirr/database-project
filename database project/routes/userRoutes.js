// routes/userRoutes.js
const express = require("express");
const { registerUser, loginUser, updateProfile } = require("../controller/userController");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

// User registration with role
router.post("/register", registerUser);

// User login
router.post("/login", loginUser);

// Update profile
router.put("/profile", authenticate, updateProfile);

module.exports = router;
