const express = require('express');
const router = express.Router();
const { registerUser, loginUser, updateProfile } = require('../controller/userController');
const { authenticate } = require('../middleware/auth');

// Serve views
router.get('/register', (req, res) => res.render('user/register', { title: 'Register' }));
router.get('/login', (req, res) => res.render('user/login', { title: 'Login' }));
router.get('/profile/:id', authenticate, async (req, res) => {
  const user = await User.findById(req.params.id);
  res.render('user/profile', { title: 'Profile', user });
});

// API endpoints
router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/profile/:id', authenticate, updateProfile);

module.exports = router;
