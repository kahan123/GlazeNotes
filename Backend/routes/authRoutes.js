const express = require('express');
const router = express.Router();
const { registerUser, loginUser, googleLogin, getMe, updateAvatar } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleLogin);
router.get('/me', protect, getMe);
router.put('/avatar', protect, updateAvatar);

module.exports = router;
