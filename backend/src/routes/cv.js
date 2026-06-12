const router = require('express').Router();
const multer = require('multer');
const { uploadCv, getCvHistory, getCvReview } = require('../controllers/cvController');
const auth = require('../middleware/auth');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

router.post('/upload', auth, upload.single('cv'), uploadCv);
router.get('/history', auth, getCvHistory);
router.get('/:id', auth, getCvReview);

module.exports = router;