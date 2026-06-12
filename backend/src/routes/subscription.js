const router = require('express').Router();
const auth = require('../middleware/auth');
const {
  getPlans,
  getCurrentSubscription,
  upgradePlan,
  cancelSubscription
} = require('../controllers/subscriptionController');

router.get('/plans', getPlans);
router.get('/current', auth, getCurrentSubscription);
router.post('/upgrade', auth, upgradePlan);
router.post('/cancel', auth, cancelSubscription);

module.exports = router;