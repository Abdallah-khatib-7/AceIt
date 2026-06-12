const router = require('express').Router();
const auth = require('../middleware/auth');
const { startQuiz, submitQuiz, getQuizHistory, getQuiz } = require('../controllers/quizController');

router.post('/start', auth, startQuiz);
router.post('/:id/submit', auth, submitQuiz);
router.get('/history', auth, getQuizHistory);
router.get('/:id', auth, getQuiz);

module.exports = router;