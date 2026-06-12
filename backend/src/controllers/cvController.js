const db = require('../db/database');
const { uploadToS3, getPresignedUrl } = require('../services/s3.service');
const { analyzeCv } = require('../services/openai.service');
const { extractTextFromPdf } = require('../utils/cvParser');
const { v4: uuidv4 } = require('uuid');

const uploadCv = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Check free tier limit (1 CV review)
    if (req.user.plan === 'free') {
      const [usage] = await db.query(
        'SELECT COUNT(*) as count FROM usage_tracking WHERE user_id = ? AND feature = ?',
        [req.user.id, 'cv_review']
      );
      if (usage[0].count >= 1) {
        return res.status(403).json({
          message: 'Free plan limit reached. Upgrade to review more CVs.',
          upgrade: true
        });
      }
    }

    // Extract text from PDF
    const cvText = await extractTextFromPdf(req.file.buffer);

    if (!cvText || cvText.trim().length < 100) {
      return res.status(400).json({ message: 'Could not extract text from PDF. Make sure it is not a scanned image.' });
    }

    // Upload to S3
    const fileName = `cvs/${req.user.id}/${uuidv4()}.pdf`;
    const s3Url = await uploadToS3(req.file.buffer, fileName, 'application/pdf');

    // Analyze with OpenAI
    const feedback = await analyzeCv(cvText);

    // Save to database
    const [result] = await db.query(
      'INSERT INTO cv_reviews (user_id, filename, s3_url, ats_score, feedback) VALUES (?, ?, ?, ?, ?)',
      [req.user.id, req.file.originalname, s3Url, feedback.ats_score, JSON.stringify(feedback)]
    );

    // Track usage
    await db.query(
      'INSERT INTO usage_tracking (user_id, feature) VALUES (?, ?)',
      [req.user.id, 'cv_review']
    );

    // Generate roadmap items from weaknesses
    for (const weakness of feedback.weaknesses) {
      await db.query(
        'INSERT INTO roadmap_items (user_id, type, suggestion, priority) VALUES (?, ?, ?, ?)',
        [req.user.id, 'cv', weakness, 'high']
      );
    }

    res.status(201).json({
      message: 'CV analyzed successfully',
      review: {
        id: result.insertId,
        filename: req.file.originalname,
        ats_score: feedback.ats_score,
        feedback
      }
    });
  } catch (err) {
    next(err);
  }
};

const getCvHistory = async (req, res, next) => {
  try {
    const [rows] = await db.query(
      'SELECT id, filename, ats_score, created_at FROM cv_reviews WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );

    res.json({ reviews: rows });
  } catch (err) {
    next(err);
  }
};

const getCvReview = async (req, res, next) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM cv_reviews WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Review not found' });
    }

    const review = rows[0];
    const presignedUrl = await getPresignedUrl(review.s3_url.split('.amazonaws.com/')[1]);

    res.json({
      review: {
        ...review,
        feedback: review.feedback,
        download_url: presignedUrl
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { uploadCv, getCvHistory, getCvReview };