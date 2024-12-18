const express = require('express');
const router = express.Router();
const { registerUser, loginUser,forgotPassword,resetPassword,uploadResume,refreshToken, logoutUser } = require('../controller/userController');
const { authenticate } = require('../middleware/auth');

const { verifyRefreshToken } = require("../middleware/auth");

// API endpoints
router.post('/register',registerUser);
router.post('/login', loginUser);
router.post('/forgot-password',forgotPassword);
router.post('/reset-password', resetPassword);
router.get("/refresh-token", refreshToken);
router.post("/logout", logoutUser);
router.get('/passwordResetSent', (req, res) => {
    res.render('users/passwordResetSent', { layout: 'layouts/main' });
});


module.exports = router;
