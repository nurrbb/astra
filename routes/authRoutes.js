const express = require('express');
const router = express.Router();
const { register, login, updateProfile } = require('../controllers/authController');
const auth = require('../middlewares/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.put('/profile', auth, updateProfile);

module.exports = router;

