const express = require("express");
const { resetPassword, forgotPassword } = require("../controller/resetPasswordController");
const router = express.Router();

// Route to handle forgot password (POST request)
router.post('/', forgotPassword); // Update to handle the root path instead of '/forgotPassword'
router.post('/reset', resetPassword); // Change to '/reset' for clarity

module.exports = router;
