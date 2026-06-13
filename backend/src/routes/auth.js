const router = require('express').Router();
const { register, login, me, updateProfile, changePassword, deleteAccount } = require('../controllers/authController');

const auth = require('../middleware/auth');
const { loginLimiter } = require('../middleware/rateLimiter');

router.get('/me', auth, me);
router.put('/profile', auth, updateProfile);
router.put('/change-password', auth, changePassword);
router.delete('/delete-account', auth, deleteAccount);
router.post('/register', register);
router.post('/login', loginLimiter, login);
router.get('/me', auth, me);

module.exports = router;