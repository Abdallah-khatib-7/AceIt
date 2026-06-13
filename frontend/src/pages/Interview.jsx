import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import {
  ArrowLeft, Brain, ArrowRight, CheckCircle, 
  Star, TrendingUp, ChevronRight, RotateCcw
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};

const MAJORS = ['Computer Science', 'Software Engineering', 'Data Science', 'Cybersecurity', 'DevOps', 'UI/UX Design', 'Product Management', 'Business Analysis'];
const EXPERIENCE_LEVELS = ['junior', 'mid', 'senior'];
const YEARS = ['0-1', '1-3', '3-5', '5+'];

const Navbar = ({ navigate }) => (
  <nav style={{ position: 'sticky', top: 0, zIndex: 100, display: 'flex', alignItems: 'center', padding: '0 48px', height: 64, background: 'rgba(10,10,10,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
    <button onClick={() => navigate('/dashboard')}
      style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: 14, fontWeight: 500, padding: '8px 0', marginRight: 24 }}
      onMouseEnter={e => e.currentTarget.style.color = '#fff'}
      onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}>
      <ArrowLeft size={16} /> Dashboard
    </button>
    <span style={{ fontSize: 18, fontWeight: 900, background: 'linear-gradient(135deg, #a78bfa, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AI Interview</span>
  </nav>
);

const selectStyle = {
  width: '100%', padding: '12px 14px',
  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 10, color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box', cursor: 'pointer'
};

const optStyle = { background: '#161616', color: '#fff' };

export default function Interview() {
  const navigate = useNavigate();
  const [view, setView] = useState('setup'); // setup | interview | feedback | report | history
  const [setup, setSetup] = useState({ major: '', job_title: '', experience_level: '', years_of_experience: '' });
  const [session, setSession] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [isLastQuestion, setIsLastQuestion] = useState(false);
  const [report, setReport] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    if (!setup.major || !setup.job_title || !setup.experience_level || !setup.years_of_experience) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/interview/start', setup);
      setSession(res.data);
      setCurrentQuestion(res.data.question);
      setQuestionNumber(1);
      setView('interview');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to start interview');
      if (err.response?.data?.upgrade) navigate('/settings?tab=plan');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!answer.trim() || answer.trim().length < 10) {
      toast.error('Please write a more detailed answer');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post(`/interview/${session.session_id}/answer`, {
        question_id: currentQuestion.id,
        answer
      });
      setFeedback(res.data.feedback);
      setIsLastQuestion(res.data.is_last_question);
      if (!res.data.is_last_question) {
        setCurrentQuestion(res.data.next_question);
        setQuestionNumber(prev => prev + 1);
      }
      setView('feedback');
    } catch {
      toast.error('Failed to submit answer');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    setAnswer('');
    setFeedback(null);
    setView('interview');
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      const res = await api.post(`/interview/${session.session_id}/complete`);
      setReport(res.data.report);
      setView('report');
    } catch {
      toast.error('Failed to complete interview');
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = async () => {
    try {
      const res = await api.get('/interview/history');
      setHistory(res.data.sessions);
      setView('history');
    } catch {
      toast.error('Failed to load history');
    }
  };

  const resetInterview = () => {
    setView('setup');
    setSession(null);
    setCurrentQuestion(null);
    setAnswer('');
    setFeedback(null);
    setReport(null);
    setQuestionNumber(1);
    setIsLastQuestion(false);
  };

  const scoreColor = (score, max = 10) => {
    const pct = (score / max) * 100;
    return pct >= 80 ? '#10b981' : pct >= 60 ? '#f59e0b' : '#ef4444';
  };

  const hireColor = (rec) => {
    if (rec === 'strong yes') return '#10b981';
    if (rec === 'yes') return '#10b981';
    if (rec === 'maybe') return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
      <Navbar navigate={navigate} />

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '48px 48px' }}>

        {/* Tab switcher */}
        {(view === 'setup' || view === 'history') && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 40 }}>
            {[{ id: 'setup', label: 'New Interview' }, { id: 'history', label: 'Past Interviews' }].map(tab => (
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

        {/* Setup view */}
        {view === 'setup' && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible">
            <div style={{ marginBottom: 32 }}>
              <h1 style={{ fontSize: 26, fontWeight: 900, marginBottom: 6, letterSpacing: '-0.5px' }}>AI Interview</h1>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>Set up your interview session. The AI will generate 7 tailored questions.</p>
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>Experience Level</label>
                  <select value={setup.experience_level} onChange={e => setSetup({ ...setup, experience_level: e.target.value })} style={selectStyle}>
                    <option value="" style={optStyle}>Select level</option>
                    {EXPERIENCE_LEVELS.map(l => <option key={l} value={l} style={optStyle}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>Years of Experience</label>
                  <select value={setup.years_of_experience} onChange={e => setSetup({ ...setup, years_of_experience: e.target.value })} style={selectStyle}>
                    <option value="" style={optStyle}>Select years</option>
                    {YEARS.map(y => <option key={y} value={y} style={optStyle}>{y} years</option>)}
                  </select>
                </div>
              </div>
            </div>

            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleStart} disabled={loading}
              style={{
                width: '100%', padding: '14px', background: loading ? 'rgba(124,58,237,0.4)' : 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                border: 'none', borderRadius: 12, color: '#fff', fontSize: 15, fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
              }}>
              {loading ? 'Preparing your interview...' : <><Brain size={18} /> Start Interview</>}
            </motion.button>
          </motion.div>
        )}

        {/* Interview view */}
        {view === 'interview' && currentQuestion && (
          <motion.div key={questionNumber} variants={fadeUp} initial="hidden" animate="visible">

            {/* Progress */}
            <div style={{ marginBottom: 32 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 13 }}>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>Question {questionNumber} of {session?.total_questions}</span>
                <span style={{ color: '#a78bfa', fontWeight: 600 }}>{Math.round((questionNumber / session?.total_questions) * 100)}% complete</span>
              </div>
              <div style={{ height: 4, background: 'rgba(255,255,255,0.07)', borderRadius: 10 }}>
                <div style={{ height: '100%', width: `${(questionNumber / session?.total_questions) * 100}%`, background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', borderRadius: 10, transition: 'width 0.5s ease' }} />
              </div>
            </div>

            {/* Question card */}
            <div style={{ padding: '28px 32px', background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 20, marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <div style={{ padding: '4px 12px', background: 'rgba(124,58,237,0.15)', borderRadius: 100, fontSize: 12, fontWeight: 600, color: '#a78bfa' }}>
                  {currentQuestion.type}
                </div>
                <div style={{ padding: '4px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: 100, fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.4)' }}>
                  {currentQuestion.difficulty}
                </div>
              </div>
              <p style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.6, margin: 0 }}>{currentQuestion.text}</p>
            </div>

            {/* Answer */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>Your Answer</label>
              <textarea
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                placeholder="Type your answer here. Be specific and detailed..."
                rows={6}
                style={{
                  width: '100%', padding: '14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 12, color: '#fff', fontSize: 14, outline: 'none', resize: 'vertical',
                  lineHeight: 1.6, boxSizing: 'border-box', fontFamily: 'Inter, sans-serif'
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(124,58,237,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 6 }}>{answer.length} characters · Minimum 10</p>
            </div>

            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSubmitAnswer} disabled={loading}
              style={{
                width: '100%', padding: '14px', background: loading ? 'rgba(124,58,237,0.4)' : 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                border: 'none', borderRadius: 12, color: '#fff', fontSize: 15, fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
              }}>
              {loading ? 'Scoring your answer...' : <> Submit Answer <ArrowRight size={16} /> </>}
            </motion.button>
          </motion.div>
        )}

        {/* Feedback view */}
        {view === 'feedback' && feedback && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ fontSize: 22, fontWeight: 900 }}>Answer Feedback</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 36, fontWeight: 900, color: scoreColor(feedback.score) }}>{feedback.score}</span>
                <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>/10</span>
              </div>
            </div>

            {/* Score bar */}
            <div style={{ height: 6, background: 'rgba(255,255,255,0.07)', borderRadius: 10 }}>
              <div style={{ height: '100%', width: `${feedback.score * 10}%`, background: scoreColor(feedback.score), borderRadius: 10, transition: 'width 1s ease' }} />
            </div>

            {/* Feedback */}
            <div style={{ padding: '20px 24px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>Feedback</p>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, margin: 0 }}>{feedback.feedback}</p>
            </div>

            {/* Ideal answer */}
            <div style={{ padding: '20px 24px', background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 16 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#a78bfa', marginBottom: 8 }}>Ideal Answer</p>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, margin: 0 }}>{feedback.ideal_answer}</p>
            </div>

            {/* Strengths & improvements */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div style={{ padding: '16px 20px', background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 14 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#10b981', marginBottom: 10 }}>Strengths</p>
                {feedback.strengths?.map((s, i) => (
                  <p key={i} style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', margin: '0 0 6px', display: 'flex', alignItems: 'flex-start', gap: 6, lineHeight: 1.5 }}>
                    <CheckCircle size={13} style={{ color: '#10b981', flexShrink: 0, marginTop: 2 }} /> {s}
                  </p>
                ))}
              </div>
              <div style={{ padding: '16px 20px', background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: 14 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#f59e0b', marginBottom: 10 }}>To Improve</p>
                {feedback.improvements?.map((imp, i) => (
                  <p key={i} style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', margin: '0 0 6px', display: 'flex', alignItems: 'flex-start', gap: 6, lineHeight: 1.5 }}>
                    <TrendingUp size={13} style={{ color: '#f59e0b', flexShrink: 0, marginTop: 2 }} /> {imp}
                  </p>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            {isLastQuestion ? (
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleComplete} disabled={loading}
                style={{ width: '100%', padding: '14px', background: loading ? 'rgba(16,185,129,0.4)' : 'linear-gradient(135deg, #10b981, #0ea5e9)', border: 'none', borderRadius: 12, color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                {loading ? 'Generating your report...' : <><Star size={16} /> Complete Interview & Get Report</>}
              </motion.button>
            ) : (
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleNext}
                style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', border: 'none', borderRadius: 12, color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                Next Question <ArrowRight size={16} />
              </motion.button>
            )}
          </motion.div>
        )}

        {/* Report view */}
        {view === 'report' && report && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <h1 style={{ fontSize: 24, fontWeight: 900 }}>Interview Report</h1>
              <button onClick={resetInterview}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                <RotateCcw size={14} /> New Interview
              </button>
            </div>

            {/* Overall score */}
            <div style={{ padding: '28px 32px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 28, flexWrap: 'wrap' }}>
              <div style={{ textAlign: 'center', flexShrink: 0 }}>
                <div style={{ fontSize: 56, fontWeight: 900, color: scoreColor(report.overall_score), lineHeight: 1 }}>{report.overall_score}</div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>out of 10</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>Hire recommendation:</span>
                  <span style={{ padding: '4px 12px', borderRadius: 100, background: `${hireColor(report.hire_recommendation)}20`, color: hireColor(report.hire_recommendation), fontSize: 13, fontWeight: 700, textTransform: 'capitalize' }}>
                    {report.hire_recommendation}
                  </span>
                </div>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, margin: 0 }}>{report.overall_summary}</p>
              </div>
            </div>

            {/* Strengths & improvements */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ padding: '20px 24px', background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 16 }}>
                <p style={{ fontSize: 15, fontWeight: 700, color: '#10b981', marginBottom: 14 }}>Top Strengths</p>
                {report.top_strengths?.map((s, i) => (
                  <p key={i} style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', margin: '0 0 10px', display: 'flex', alignItems: 'flex-start', gap: 8, lineHeight: 1.5 }}>
                    <CheckCircle size={14} style={{ color: '#10b981', flexShrink: 0, marginTop: 2 }} /> {s}
                  </p>
                ))}
              </div>
              <div style={{ padding: '20px 24px', background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: 16 }}>
                <p style={{ fontSize: 15, fontWeight: 700, color: '#f59e0b', marginBottom: 14 }}>Areas to Improve</p>
                {report.areas_to_improve?.map((a, i) => (
                  <p key={i} style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', margin: '0 0 10px', display: 'flex', alignItems: 'flex-start', gap: 8, lineHeight: 1.5 }}>
                    <TrendingUp size={14} style={{ color: '#f59e0b', flexShrink: 0, marginTop: 2 }} /> {a}
                  </p>
                ))}
              </div>
            </div>

            {/* Resources */}
            <div style={{ padding: '20px 24px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16 }}>
              <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Recommended Resources</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {report.recommended_resources?.map((r, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.15)', borderRadius: 10 }}>
                    <Star size={13} style={{ color: '#a78bfa', flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)' }}>{r}</span>
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

        {/* History view */}
        {view === 'history' && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible">
            <h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 24 }}>Past Interviews</h1>
            {history.length === 0 ? (
              <div style={{ padding: 48, textAlign: 'center', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16 }}>
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>No interviews yet. Start your first AI interview.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {history.map((session, i) => (
  <motion.div key={i} whileHover={{ x: 4 }}
    onClick={async () => {
  if (session.status !== 'completed') return;
  try {
    const res = await api.get(`/interview/${session.id}`);
    const sessionData = res.data;
    setReport({
      overall_score: sessionData.session.overall_score,
      overall_summary: sessionData.session.overall_score >= 7
        ? 'Strong performance overall. You demonstrated solid knowledge across most questions.'
        : sessionData.session.overall_score >= 5
        ? 'Decent performance with room for improvement in some areas.'
        : 'Needs significant improvement. Review the questions and practice more.',
      top_strengths: sessionData.questions
        .filter(q => q.score >= 7)
        .slice(0, 3)
        .map(q => {
          try {
            const parsed = typeof q.ai_feedback === 'string' ? JSON.parse(q.ai_feedback) : q.ai_feedback;
            return parsed?.strengths?.[0] || `Good answer on: "${q.question.slice(0, 60)}..."`;
          } catch {
            return `Good answer on: "${q.question.slice(0, 60)}..."`;
          }
        }),
      areas_to_improve: sessionData.questions
        .filter(q => q.score < 7)
        .slice(0, 3)
        .map(q => {
          try {
            const parsed = typeof q.ai_feedback === 'string' ? JSON.parse(q.ai_feedback) : q.ai_feedback;
            return parsed?.improvements?.[0] || `Improve on: "${q.question.slice(0, 60)}..."`;
          } catch {
            return `Improve on: "${q.question.slice(0, 60)}..."`;
          }
        }),
      recommended_resources: [
        'Practice on LeetCode for technical questions',
        'Read "Cracking the Coding Interview" by Gayle McDowell',
        'Review system design concepts on Grokking the System Design Interview'
      ],
      hire_recommendation: sessionData.session.overall_score >= 7 ? 'yes' : sessionData.session.overall_score >= 5 ? 'maybe' : 'no'
    });
    setView('report');
  } catch {
    toast.error('Failed to load session');
  }
}}
    style={{
      display: 'flex', alignItems: 'center', gap: 16, padding: '18px 22px',
      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 14, cursor: session.status === 'completed' ? 'pointer' : 'default',
      transition: 'all 0.2s'
    }}
    onMouseEnter={e => { if (session.status === 'completed') e.currentTarget.style.borderColor = 'rgba(124,58,237,0.3)'; }}
    onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}>
    <div style={{ padding: 10, borderRadius: 10, background: 'rgba(236,72,153,0.1)' }}>
      <Brain size={18} style={{ color: '#f472b6' }} />
    </div>
    <div style={{ flex: 1 }}>
      <p style={{ fontSize: 14, fontWeight: 600, margin: '0 0 2px' }}>{session.job_title}</p>
      <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', margin: 0 }}>
        {session.major} · {session.experience_level} · {new Date(session.created_at).toLocaleDateString()}
      </p>
    </div>
    <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: 12 }}>
      {session.overall_score ? (
        <>
          <div>
            <span style={{ fontSize: 22, fontWeight: 900, color: scoreColor(session.overall_score) }}>{Number(session.overall_score).toFixed(1)}</span>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', margin: 0 }}>/10</p>
          </div>
          <ChevronRight size={16} style={{ color: 'rgba(255,255,255,0.3)' }} />
        </>
      ) : (
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', padding: '4px 10px', background: 'rgba(255,255,255,0.05)', borderRadius: 6 }}>In Progress</span>
      )}
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