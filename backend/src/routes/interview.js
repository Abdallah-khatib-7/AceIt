const router = require('express').Router();
const auth = require('../middleware/auth');
const {
  startSession,
  submitAnswer,
  completeSession,
  getHistory,
  getSession
} = require('../controllers/interviewController');

router.post('/start', auth, startSession);
router.post('/:id/answer', auth, submitAnswer);
router.post('/:id/complete', auth, completeSession);
router.get('/history', auth, getHistory);
router.get('/:id', auth, getSession);

module.exports = router;