const db = require('../db/database');

const getSummary = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const [[cvStats]] = await db.query(
      `SELECT COUNT(*) as total_reviews, 
       ROUND(AVG(ats_score), 1) as avg_ats_score,
       MAX(ats_score) as best_ats_score
       FROM cv_reviews WHERE user_id = ?`,
      [userId]
    );

    const [[interviewStats]] = await db.query(
      `SELECT COUNT(*) as total_interviews,
       ROUND(AVG(overall_score), 1) as avg_interview_score,
       MAX(overall_score) as best_interview_score
       FROM interview_sessions WHERE user_id = ? AND status = 'completed'`,
      [userId]
    );

    const [[quizStats]] = await db.query(
      `SELECT COUNT(*) as total_quizzes,
       ROUND(AVG(score), 1) as avg_quiz_score,
       MAX(score) as best_quiz_score
       FROM quiz_sessions WHERE user_id = ?`,
      [userId]
    );

    const [recentActivity] = await db.query(
      `(SELECT 'cv_review' as type, filename as title, ats_score as score, created_at 
        FROM cv_reviews WHERE user_id = ?)
       UNION ALL
       (SELECT 'interview' as type, job_title as title, overall_score as score, created_at 
        FROM interview_sessions WHERE user_id = ? AND status = 'completed')
       UNION ALL
       (SELECT 'quiz' as type, job_title as title, score, completed_at as created_at 
        FROM quiz_sessions WHERE user_id = ?)
       ORDER BY created_at DESC LIMIT 10`,
      [userId, userId, userId]
    );

    res.json({
      cv: cvStats,
      interviews: interviewStats,
      quizzes: quizStats,
      recent_activity: recentActivity
    });
  } catch (err) {
    next(err);
  }
};

const getInterviewHistory = async (req, res, next) => {
  try {
    const [rows] = await db.query(
      `SELECT s.*, 
       COUNT(q.id) as questions_answered,
       ROUND(AVG(q.score), 1) as avg_question_score
       FROM interview_sessions s
       LEFT JOIN interview_questions q ON q.session_id = s.id AND q.user_answer IS NOT NULL
       WHERE s.user_id = ?
       GROUP BY s.id
       ORDER BY s.created_at DESC`,
      [req.user.id]
    );

    res.json({ interviews: rows });
  } catch (err) {
    next(err);
  }
};

const getCvHistory = async (req, res, next) => {
  try {
    const [rows] = await db.query(
      `SELECT id, filename, ats_score, 
       JSON_EXTRACT(feedback, '$.formatting_score') as formatting_score,
       JSON_EXTRACT(feedback, '$.content_score') as content_score,
       JSON_EXTRACT(feedback, '$.keywords_score') as keywords_score,
       created_at 
       FROM cv_reviews WHERE user_id = ? ORDER BY created_at DESC`,
      [req.user.id]
    );

    res.json({ reviews: rows });
  } catch (err) {
    next(err);
  }
};

const getQuizHistory = async (req, res, next) => {
  try {
    const [rows] = await db.query(
      `SELECT id, major, job_title, total_questions, correct_answers, score, completed_at
       FROM quiz_sessions WHERE user_id = ? ORDER BY completed_at DESC`,
      [req.user.id]
    );

    res.json({ quizzes: rows });
  } catch (err) {
    next(err);
  }
};

module.exports = { getSummary, getInterviewHistory, getCvHistory, getQuizHistory };