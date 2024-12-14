const express = require('express');
const router = express.Router();
const { registerUser, loginUser, updateProfile,forgotPassword,resetPassword,uploadResume } = require('../controller/userController');
const { authenticate } = require('../middleware/auth');
const upload = require('../middleware/upload');

// API endpoints
router.post('/register',registerUser);
router.post('/login', loginUser);
router.put('/profile/:id', authenticate, updateProfile);
router.post('/forgot-password',forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/upload-resume/:id', upload.single('resume'), uploadResume);

module.exports = router;
