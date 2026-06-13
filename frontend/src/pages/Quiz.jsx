import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import {
  ArrowLeft, Zap, ArrowRight, CheckCircle, XCircle,
  ChevronRight, RotateCcw, Trophy, Clock
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};

const MAJORS = ['Computer Science', 'Software Engineering', 'Data Science', 'Cybersecurity', 'DevOps', 'UI/UX Design', 'Product Management', 'Business Analysis'];
const QUESTION_COUNTS = [5, 10, 15, 20];

const Navbar = ({ navigate }) => (
  <nav style={{ position: 'sticky', top: 0, zIndex: 100, display: 'flex', alignItems: 'center', padding: '0 48px', height: 64, background: 'rgba(10,10,10,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
    <button onClick={() => navigate('/dashboard')}
      style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: 14, fontWeight: 500, padding: '8px 0', marginRight: 24 }}
      onMouseEnter={e => e.currentTarget.style.color = '#fff'}
      onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}>
      <ArrowLeft size={16} /> Dashboard
    </button>
    <span style={{ fontSize: 18, fontWeight: 900, background: 'linear-gradient(135deg, #a78bfa, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Skill Quiz</span>
  </nav>
);

const selectStyle = {
  width: '100%', padding: '12px 14px',
  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 10, color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box', cursor: 'pointer'
};

const optStyle = { background: '#161616', color: '#fff' };

export default function Quiz() {
  const navigate = useNavigate();
  const [view, setView] = useState('setup');
  const [setup, setSetup] = useState({ major: '', job_title: '', total_questions: 10 });
  const [quizSession, setQuizSession] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [selectedOption, setSelectedOption] = useState(null);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleStart = async () => {
    if (!setup.major || !setup.job_title) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/quiz/start', setup);
      setQuizSession(res.data);
      const parsedQuestions = res.data.questions.map(q => ({
        ...q,
        options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options
      }));
      setQuestions(parsedQuestions);
      setCurrentIndex(0);
      setSelectedAnswers({});
      setSelectedOption(null);
      setView('quiz');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to start quiz');
      if (err.response?.data?.upgrade) navigate('/settings?tab=plan');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (option) => {
    setSelectedOption(option);
    setSelectedAnswers(prev => ({ ...prev, [questions[currentIndex].id]: option }));
  };

  const handleNext = () => {
    if (!selectedOption) { toast.error('Please select an answer'); return; }
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(selectedAnswers[questions[currentIndex + 1]?.id] || null);
    }
  };

  const handleSubmit = async () => {
    if (Object.keys(selectedAnswers).length < questions.length) {
      toast.error('Please answer all questions');
      return;
    }
    setSubmitting(true);
    try {
      const answers = Object.entries(selectedAnswers).map(([question_id, selected_answer]) => ({
        question_id: parseInt(question_id),
        selected_answer
      }));
      const res = await api.post(`/quiz/${quizSession.quiz_session_id}/submit`, { answers });
      setResult({ ...res.data, questions });
      setView('result');
      toast.success('Quiz completed!');
    } catch {
      toast.error('Failed to submit quiz');
    } finally {
      setSubmitting(false);
    }
  };

  const loadHistory = async () => {
    try {
      const res = await api.get('/quiz/history');
      setHistory(res.data.quizzes);
      setView('history');
    } catch {
      toast.error('Failed to load history');
    }
  };

  const resetQuiz = () => {
    setView('setup');
    setQuizSession(null);
    setQuestions([]);
    setCurrentIndex(0);
    setSelectedAnswers({});
    setSelectedOption(null);
    setResult(null);
  };

  const scoreColor = (score) => score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';
  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;
  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
      <Navbar navigate={navigate} />

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '48px 48px' }}>

        {/* Tab switcher */}
        {(view === 'setup' || view === 'history') && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 40 }}>
            {[{ id: 'setup', label: 'New Quiz' }, { id: 'history', label: 'Past Quizzes' }].map(tab => (
              <button key={tab.id}
                onClick={() => tab.id === 'history' ? loadHistory() : setView('setup')}
                style={{
                  padding: '9px 20px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600,
                  background: view === tab.id ? 'rgba(124,58,237,0.15)' : 'rgba(255,255,255,0.04)',
                  color: view === tab.id ? '#a78bfa' : 'rgba(255,255,255,0.4)', transition: 'all 0.2s'
                }}>
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Setup */}
        {view === 'setup' && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible">
            <div style={{ marginBottom: 32 }}>
              <h1 style={{ fontSize: 26, fontWeight: 900, marginBottom: 6, letterSpacing: '-0.5px' }}>Skill Quiz</h1>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>AI-generated questions tailored to your tech stack and job position.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 28 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>Major / Field</label>
                <select value={setup.major} onChange={e => setSetup({ ...setup, major: e.target.value })} style={selectStyle}>
                  <option value="" style={optStyle}>Select your major</option>
                  {MAJORS.map(m => <option key={m} value={m} style={optStyle}>{m}</option>)}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>Job Title</label>
                <input
                  placeholder="e.g. Full Stack Developer, Data Scientist..."
                  value={setup.job_title}
                  onChange={e => setSetup({ ...setup, job_title: e.target.value })}
                  style={{ ...selectStyle, cursor: 'text' }}
                  onFocus={e => e.target.style.borderColor = 'rgba(124,58,237,0.6)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>Number of Questions</label>
                <div style={{ display: 'flex', gap: 10 }}>
                  {QUESTION_COUNTS.map(count => (
                    <button key={count} onClick={() => setSetup({ ...setup, total_questions: count })}
                      style={{
                        flex: 1, padding: '12px', borderRadius: 10, border: `1px solid ${setup.total_questions === count ? 'rgba(124,58,237,0.5)' : 'rgba(255,255,255,0.1)'}`,
                        background: setup.total_questions === count ? 'rgba(124,58,237,0.1)' : 'rgba(255,255,255,0.03)',
                        color: setup.total_questions === count ? '#a78bfa' : 'rgba(255,255,255,0.5)',
                        fontSize: 14, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s'
                      }}>
                      {count}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleStart} disabled={loading}
              style={{
                width: '100%', padding: '14px', background: loading ? 'rgba(124,58,237,0.4)' : 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                border: 'none', borderRadius: 12, color: '#fff', fontSize: 15, fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
              }}>
              {loading ? 'Generating questions...' : <><Zap size={18} /> Start Quiz</>}
            </motion.button>
          </motion.div>
        )}

        {/* Quiz */}
        {view === 'quiz' && currentQuestion && (
          <motion.div key={currentIndex} variants={fadeUp} initial="hidden" animate="visible">

            {/* Progress */}
            <div style={{ marginBottom: 32 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 13 }}>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>Question {currentIndex + 1} of {questions.length}</span>
                <span style={{ color: '#a78bfa', fontWeight: 600 }}>{answeredCount} answered</span>
              </div>
              <div style={{ height: 4, background: 'rgba(255,255,255,0.07)', borderRadius: 10 }}>
                <div style={{ height: '100%', width: `${((currentIndex + 1) / questions.length) * 100}%`, background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', borderRadius: 10, transition: 'width 0.5s ease' }} />
              </div>
            </div>

            {/* Question */}
            <div style={{ padding: '24px 28px', background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 20, marginBottom: 24 }}>
              <p style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.6, margin: 0 }}>{currentQuestion.question}</p>
            </div>

            {/* Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
              {currentQuestion.options.map((option, i) => (
                <motion.button key={i} onClick={() => handleSelectOption(option)}
                  whileHover={{ x: 4 }}
                  style={{
                    padding: '14px 18px', borderRadius: 12, border: `1px solid ${selectedOption === option ? 'rgba(124,58,237,0.5)' : 'rgba(255,255,255,0.08)'}`,
                    background: selectedOption === option ? 'rgba(124,58,237,0.12)' : 'rgba(255,255,255,0.03)',
                    color: selectedOption === option ? '#a78bfa' : 'rgba(255,255,255,0.7)',
                    fontSize: 14, fontWeight: selectedOption === option ? 600 : 400,
                    cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                    display: 'flex', alignItems: 'center', gap: 12
                  }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                    border: `2px solid ${selectedOption === option ? '#7c3aed' : 'rgba(255,255,255,0.2)'}`,
                    background: selectedOption === option ? '#7c3aed' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {selectedOption === option && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff' }} />}
                  </div>
                  {option}
                </motion.button>
              ))}
            </div>

            {isLastQuestion ? (
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSubmit} disabled={submitting}
                style={{
                  width: '100%', padding: '14px', background: submitting ? 'rgba(16,185,129,0.4)' : 'linear-gradient(135deg, #10b981, #0ea5e9)',
                  border: 'none', borderRadius: 12, color: '#fff', fontSize: 15, fontWeight: 700,
                  cursor: submitting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                }}>
                {submitting ? 'Submitting...' : <><Trophy size={16} /> Submit Quiz</>}
              </motion.button>
            ) : (
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleNext}
                style={{
                  width: '100%', padding: '14px', background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                  border: 'none', borderRadius: 12, color: '#fff', fontSize: 15, fontWeight: 700,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                }}>
                Next Question <ArrowRight size={16} />
              </motion.button>
            )}
          </motion.div>
        )}

        {/* Result */}
        {view === 'result' && result && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <h1 style={{ fontSize: 24, fontWeight: 900 }}>Quiz Results</h1>
              <button onClick={resetQuiz}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                <RotateCcw size={14} /> New Quiz
              </button>
            </div>

            {/* Score card */}
            <div style={{ padding: '28px 32px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 28, flexWrap: 'wrap' }}>
              <div style={{ textAlign: 'center', flexShrink: 0 }}>
                <div style={{ fontSize: 56, fontWeight: 900, color: scoreColor(result.score), lineHeight: 1 }}>{Math.round(result.score)}%</div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>Final Score</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: 16, marginBottom: 12, flexWrap: 'wrap' }}>
                  <div style={{ padding: '8px 16px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 10 }}>
                    <span style={{ fontSize: 18, fontWeight: 900, color: '#10b981' }}>{result.correct_answers}</span>
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginLeft: 6 }}>Correct</span>
                  </div>
                  <div style={{ padding: '8px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10 }}>
                    <span style={{ fontSize: 18, fontWeight: 900, color: '#ef4444' }}>{result.total_questions - result.correct_answers}</span>
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginLeft: 6 }}>Wrong</span>
                  </div>
                </div>
                <div style={{ height: 6, background: 'rgba(255,255,255,0.07)', borderRadius: 10 }}>
                  <div style={{ height: '100%', width: `${result.score}%`, background: scoreColor(result.score), borderRadius: 10, transition: 'width 1s ease' }} />
                </div>
              </div>
            </div>

            {/* Question breakdown */}
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Question Breakdown</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {result.results.map((r, i) => (
                  <div key={i} style={{
                    padding: '16px 18px', background: 'rgba(255,255,255,0.02)',
                    border: `1px solid ${r.is_correct ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)'}`,
                    borderRadius: 12
                  }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
                      {r.is_correct
                        ? <CheckCircle size={16} style={{ color: '#10b981', flexShrink: 0, marginTop: 2 }} />
                        : <XCircle size={16} style={{ color: '#ef4444', flexShrink: 0, marginTop: 2 }} />
                      }
                      <p style={{ fontSize: 14, fontWeight: 600, margin: 0, lineHeight: 1.5 }}>{r.question}</p>
                    </div>
                    <div style={{ paddingLeft: 26, display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <p style={{ fontSize: 13, margin: 0, color: r.is_correct ? '#10b981' : '#ef4444' }}>
                        Your answer: {r.your_answer}
                      </p>
                      {!r.is_correct && (
                        <p style={{ fontSize: 13, margin: 0, color: '#10b981' }}>
                          Correct answer: {r.correct_answer}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={() => navigate('/roadmap')}
              style={{ width: '100%', padding: '13px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              View Your Roadmap <ChevronRight size={15} />
            </button>
          </motion.div>
        )}

        {/* History */}
        {view === 'history' && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible">
            <h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 24 }}>Past Quizzes</h1>
            {history.length === 0 ? (
              <div style={{ padding: 48, textAlign: 'center', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16 }}>
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>No quizzes yet. Start your first quiz.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {history.map((quiz, i) => (
                  <motion.div key={i} whileHover={{ x: 4 }}
                    onClick={async () => {
                      try {
                        const res = await api.get(`/quiz/${quiz.id}`);
                        const quizData = res.data;
                        const parsedQuestions = quizData.questions.map(q => ({
                          ...q,
                          options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options
                        }));
                        setResult({
                          score: quiz.score,
                          correct_answers: quiz.correct_answers,
                          total_questions: quiz.total_questions,
                          results: parsedQuestions.map(q => ({
                            question: q.question,
                            your_answer: q.user_answer || 'Not answered',
                            correct_answer: q.correct_answer,
                            is_correct: q.is_correct
                          })),
                          questions: parsedQuestions
                        });
                        setView('result');
                      } catch {
                        toast.error('Failed to load quiz');
                      }
                    }}
                    style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '18px 22px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(124,58,237,0.3)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}>
                    <div style={{ padding: 10, borderRadius: 10, background: 'rgba(249,115,22,0.1)' }}>
                      <Zap size={18} style={{ color: '#fb923c' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 14, fontWeight: 600, margin: '0 0 2px' }}>{quiz.job_title}</p>
                      <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', margin: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
                        {quiz.major} · {quiz.total_questions} questions · <Clock size={11} /> {new Date(quiz.completed_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div>
                        <span style={{ fontSize: 22, fontWeight: 900, color: scoreColor(quiz.score) }}>{Math.round(quiz.score)}%</span>
                        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', margin: 0 }}>{quiz.correct_answers}/{quiz.total_questions} correct</p>
                      </div>
                      <ChevronRight size={16} style={{ color: 'rgba(255,255,255,0.3)' }} />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}