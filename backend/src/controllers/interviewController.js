const db = require('../db/database');
const {
  generateInterviewQuestion,
  scoreInterviewAnswer,
  generateInterviewReport
} = require('../services/openai.service');

const QUESTIONS_PER_SESSION = 7;

const startSession = async (req, res, next) => {
  try {
    const { major, job_title, experience_level, years_of_experience } = req.body;

    if (!major || !job_title || !experience_level || !years_of_experience) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check free tier limit
    if (req.user.plan === 'free') {
      const [usage] = await db.query(
        'SELECT COUNT(*) as count FROM usage_tracking WHERE user_id = ? AND feature = ?',
        [req.user.id, 'interview']
      );
      if (usage[0].count >= 1) {
        return res.status(403).json({
          message: 'Free plan limit reached. Upgrade to start more interviews.',
          upgrade: true
        });
      }
    }

    // Create session
    const [result] = await db.query(
      `INSERT INTO interview_sessions 
       (user_id, major, job_title, experience_level, years_of_experience) 
       VALUES (?, ?, ?, ?, ?)`,
      [req.user.id, major, job_title, experience_level, years_of_experience]
    );

    const sessionId = result.insertId;

    // Generate first question
    const questionData = await generateInterviewQuestion(
      major, job_title, experience_level, years_of_experience, []
    );

    // Save question to DB
    const [qResult] = await db.query(
      'INSERT INTO interview_questions (session_id, question) VALUES (?, ?)',
      [sessionId, questionData.question]
    );

    // Track usage
    await db.query(
      'INSERT INTO usage_tracking (user_id, feature) VALUES (?, ?)',
      [req.user.id, 'interview']
    );

    res.status(201).json({
      message: 'Interview session started',
      session_id: sessionId,
      question_number: 1,
      total_questions: QUESTIONS_PER_SESSION,
      question: {
        id: qResult.insertId,
        text: questionData.question,
        type: questionData.type,
        difficulty: questionData.difficulty
      }
    });
  } catch (err) {
    next(err);
  }
};

const submitAnswer = async (req, res, next) => {
  try {
    const { question_id, answer } = req.body;
    const sessionId = req.params.id;

    if (!question_id || !answer) {
      return res.status(400).json({ message: 'question_id and answer are required' });
    }

    if (answer.trim().length < 10) {
      return res.status(400).json({ message: 'Answer is too short' });
    }

    // Get session
    const [sessions] = await db.query(
      'SELECT * FROM interview_sessions WHERE id = ? AND user_id = ?',
      [sessionId, req.user.id]
    );

    if (sessions.length === 0) {
      return res.status(404).json({ message: 'Session not found' });
    }

    const session = sessions[0];

    if (session.status !== 'in_progress') {
      return res.status(400).json({ message: 'Session is already completed' });
    }

    // Get the question
    const [questions] = await db.query(
      'SELECT * FROM interview_questions WHERE id = ? AND session_id = ?',
      [question_id, sessionId]
    );

    if (questions.length === 0) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Score the answer
    const scoring = await scoreInterviewAnswer(
      questions[0].question,
      answer,
      session.job_title,
      session.experience_level
    );

    // Save answer + feedback
    await db.query(
      'UPDATE interview_questions SET user_answer = ?, ai_feedback = ?, score = ? WHERE id = ?',
      [answer, JSON.stringify(scoring), scoring.score, question_id]
    );

    // Get all asked questions so far
    const [askedQuestions] = await db.query(
      'SELECT question FROM interview_questions WHERE session_id = ?',
      [sessionId]
    );

    const askedCount = askedQuestions.length;
    const isLastQuestion = askedCount >= QUESTIONS_PER_SESSION;

    let nextQuestion = null;

    if (!isLastQuestion) {
      // Generate next question avoiding repeats
      const askedTexts = askedQuestions.map((q) => q.question);
      const nextQuestionData = await generateInterviewQuestion(
        session.major,
        session.job_title,
        session.experience_level,
        session.years_of_experience,
        askedTexts
      );

      const [nqResult] = await db.query(
        'INSERT INTO interview_questions (session_id, question) VALUES (?, ?)',
        [sessionId, nextQuestionData.question]
      );

      nextQuestion = {
        id: nqResult.insertId,
        text: nextQuestionData.question,
        type: nextQuestionData.type,
        difficulty: nextQuestionData.difficulty
      };
    }

    res.json({
      feedback: scoring,
      question_number: askedCount,
      total_questions: QUESTIONS_PER_SESSION,
      is_last_question: isLastQuestion,
      next_question: nextQuestion
    });
  } catch (err) {
    next(err);
  }
};

const completeSession = async (req, res, next) => {
  try {
    const sessionId = req.params.id;

    const [sessions] = await db.query(
      'SELECT * FROM interview_sessions WHERE id = ? AND user_id = ?',
      [sessionId, req.user.id]
    );

    if (sessions.length === 0) {
      return res.status(404).json({ message: 'Session not found' });
    }

    if (sessions[0].status !== 'in_progress') {
      return res.status(400).json({ message: 'Session is already completed' });
    }

    // Get all questions and answers
    const [questionsAndAnswers] = await db.query(
      'SELECT question, user_answer, score FROM interview_questions WHERE session_id = ? AND user_answer IS NOT NULL',
      [sessionId]
    );

    if (questionsAndAnswers.length === 0) {
      return res.status(400).json({ message: 'No answered questions found' });
    }

    const session = sessions[0];

    // Generate final report
    const report = await generateInterviewReport(
      questionsAndAnswers.map((q) => ({
        question: q.question,
        answer: q.user_answer,
        score: q.score
      })),
      session.job_title,
      session.major
    );

    // Update session
    await db.query(
      'UPDATE interview_sessions SET status = ?, overall_score = ? WHERE id = ?',
      ['completed', report.overall_score, sessionId]
    );

    // Generate roadmap items
    for (const area of report.areas_to_improve) {
      await db.query(
        'INSERT INTO roadmap_items (user_id, type, suggestion, priority) VALUES (?, ?, ?, ?)',
        [req.user.id, 'interview', area, 'high']
      );
    }

    res.json({
      message: 'Interview completed',
      report
    });
  } catch (err) {
    next(err);
  }
};

const getHistory = async (req, res, next) => {
  try {
    const [rows] = await db.query(
      `SELECT id, major, job_title, experience_level, years_of_experience, 
       status, overall_score, created_at 
       FROM interview_sessions WHERE user_id = ? ORDER BY created_at DESC`,
      [req.user.id]
    );

    res.json({ sessions: rows });
  } catch (err) {
    next(err);
  }
};

const getSession = async (req, res, next) => {
  try {
    const [sessions] = await db.query(
      'SELECT * FROM interview_sessions WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (sessions.length === 0) {
      return res.status(404).json({ message: 'Session not found' });
    }

    const [questions] = await db.query(
      'SELECT * FROM interview_questions WHERE session_id = ?',
      [req.params.id]
    );

    res.json({
      session: sessions[0],
      questions
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { startSession, submitAnswer, completeSession, getHistory, getSession };