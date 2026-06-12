const router = require('express').Router();
const auth = require('../middleware/auth');
const { getRoadmap, markDone, deleteItem } = require('../controllers/roadmapController');

router.get('/', auth, getRoadmap);
router.patch('/:id/toggle', auth, markDone);
router.delete('/:id', auth, deleteItem);

module.exports = router;