const db = require('../db/database');
const { generateQuizQuestions } = require('../services/openai.service');

const DEFAULT_QUESTIONS = 10;

const startQuiz = async (req, res, next) => {
  try {
    const { major, job_title, total_questions } = req.body;

    if (!major || !job_title) {
      return res.status(400).json({ message: 'major and job_title are required' });
    }

    const questionCount = total_questions || DEFAULT_QUESTIONS;

    // Check free tier limit
    if (req.user.plan === 'free') {
      const [usage] = await db.query(
        'SELECT COUNT(*) as count FROM usage_tracking WHERE user_id = ? AND feature = ?',
        [req.user.id, 'quiz']
      );
      if (usage[0].count >= 3) {
        return res.status(403).json({
          message: 'Free plan limit reached. Upgrade to take more quizzes.',
          upgrade: true
        });
      }
    }

    // Generate questions
    const questions = await generateQuizQuestions(major, job_title, questionCount);

    // Create quiz session
    const [result] = await db.query(
      'INSERT INTO quiz_sessions (user_id, major, job_title, total_questions) VALUES (?, ?, ?, ?)',
      [req.user.id, major, job_title, questionCount]
    );

    const quizSessionId = result.insertId;

    // Save all questions
    for (const q of questions) {
      await db.query(
        'INSERT INTO quiz_questions (quiz_session_id, question, options, correct_answer) VALUES (?, ?, ?, ?)',
        [quizSessionId, q.question, JSON.stringify(q.options), q.correct_answer]
      );
    }

    // Track usage
    await db.query(
      'INSERT INTO usage_tracking (user_id, feature) VALUES (?, ?)',
      [req.user.id, 'quiz']
    );

    // Fetch saved questions with IDs
    const [savedQuestions] = await db.query(
      'SELECT id, question, options FROM quiz_questions WHERE quiz_session_id = ?',
      [quizSessionId]
    );

    res.status(201).json({
      message: 'Quiz started',
      quiz_session_id: quizSessionId,
      total_questions: questionCount,
      questions: savedQuestions.map((q) => ({
        id: q.id,
        question: q.question,
        options: q.options
      }))
    });
  } catch (err) {
    next(err);
  }
};

const submitQuiz = async (req, res, next) => {
  try {
    const { answers } = req.body;
    const quizSessionId = req.params.id;

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ message: 'answers array is required' });
    }

    // Get session
    const [sessions] = await db.query(
      'SELECT * FROM quiz_sessions WHERE id = ? AND user_id = ?',
      [quizSessionId, req.user.id]
    );

    if (sessions.length === 0) {
      return res.status(404).json({ message: 'Quiz session not found' });
    }

    // Get all questions
    const [questions] = await db.query(
      'SELECT * FROM quiz_questions WHERE quiz_session_id = ?',
      [quizSessionId]
    );

    let correctCount = 0;
    const results = [];

    for (const answer of answers) {
      const question = questions.find((q) => q.id === answer.question_id);
      if (!question) continue;

      const isCorrect = question.correct_answer === answer.selected_answer;
      if (isCorrect) correctCount++;

      await db.query(
        'UPDATE quiz_questions SET user_answer = ?, is_correct = ? WHERE id = ?',
        [answer.selected_answer, isCorrect, answer.question_id]
      );

      results.push({
        question_id: answer.question_id,
        question: question.question,
        your_answer: answer.selected_answer,
        correct_answer: question.correct_answer,
        is_correct: isCorrect
      });
    }

    const score = ((correctCount / questions.length) * 100).toFixed(2);

    // Update session
    await db.query(
      'UPDATE quiz_sessions SET correct_answers = ?, score = ?, completed_at = NOW() WHERE id = ?',
      [correctCount, score, quizSessionId]
    );

    // Generate roadmap items for wrong answers
    const wrongAnswers = results.filter((r) => !r.is_correct);
    if (wrongAnswers.length > 0) {
      await db.query(
        'INSERT INTO roadmap_items (user_id, type, suggestion, priority) VALUES (?, ?, ?, ?)',
        [
          req.user.id,
          'quiz',
          `Review these topics from your ${sessions[0].job_title} quiz: ${wrongAnswers.map((w) => w.question.slice(0, 50)).join(' | ')}`,
          'medium'
        ]
      );
    }

    res.json({
      message: 'Quiz completed',
      score: parseFloat(score),
      correct_answers: correctCount,
      total_questions: questions.length,
      results
    });
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

const getQuiz = async (req, res, next) => {
  try {
    const [sessions] = await db.query(
      'SELECT * FROM quiz_sessions WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (sessions.length === 0) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    const [questions] = await db.query(
      'SELECT * FROM quiz_questions WHERE quiz_session_id = ?',
      [req.params.id]
    );

    res.json({ session: sessions[0], questions });
  } catch (err) {
    next(err);
  }
};

module.exports = { startQuiz, submitQuiz, getQuizHistory, getQuiz };