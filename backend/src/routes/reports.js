const router = require('express').Router();
const auth = require('../middleware/auth');
const { getSummary, getInterviewHistory, getCvHistory, getQuizHistory } = require('../controllers/reportsController');

router.get('/summary', auth, getSummary);
router.get('/interviews', auth, getInterviewHistory);
router.get('/cv', auth, getCvHistory);
router.get('/quizzes', auth, getQuizHistory);

module.exports = router;