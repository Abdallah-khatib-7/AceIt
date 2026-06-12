const router = require('express').Router();
const { register, login, me } = require('../controllers/authController');
const auth = require('../middleware/auth');
const { loginLimiter } = require('../middleware/rateLimiter');

router.post('/register', register);
router.post('/login', loginLimiter, login);
router.get('/me', auth, me);

module.exports = router;