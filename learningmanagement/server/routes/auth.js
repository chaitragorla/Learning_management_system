// server/routes/auth.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  register,
  login,
  getMe,
  updateProfile,
  markNotificationsRead,
} = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/me', protect, upload.single('avatar'), updateProfile);
router.put('/notifications/read', protect, markNotificationsRead);

module.exports = router;
