import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import {
  ArrowLeft, FileText, Brain, Zap, Download,
  ChevronRight,
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08, ease: 'easeOut' } })
};

const scoreColor = (score, max = 100) => {
  const pct = (score / max) * 100;
  return pct >= 80 ? '#10b981' : pct >= 60 ? '#f59e0b' : '#ef4444';
};

const ScoreBar = ({ score, max = 100, label, color }) => (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13 }}>
      <span style={{ color: 'rgba(255,255,255,0.5)' }}>{label}</span>
      <span style={{ fontWeight: 700, color: color || scoreColor(score, max) }}>{score}{max === 100 ? '%' : `/${max}`}</span>
    </div>
    <div style={{ height: 6, background: 'rgba(255,255,255,0.07)', borderRadius: 10 }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${(score / max) * 100}%` }}
        transition={{ duration: 1, ease: 'easeOut' }}
        style={{ height: '100%', background: color || scoreColor(score, max), borderRadius: 10 }}
      />
    </div>
  </div>
);

const Navbar = ({ navigate }) => (
  <nav style={{ position: 'sticky', top: 0, zIndex: 100, display: 'flex', alignItems: 'center', padding: '0 48px', height: 64, background: 'rgba(10,10,10,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
    <button onClick={() => navigate('/dashboard')}
      style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: 14, fontWeight: 500, padding: '8px 0', marginRight: 24 }}
      onMouseEnter={e => e.currentTarget.style.color = '#fff'}
      onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}>
      <ArrowLeft size={16} /> Dashboard
    </button>
    <span style={{ fontSize: 18, fontWeight: 900, background: 'linear-gradient(135deg, #a78bfa, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Reports</span>
  </nav>
);

export default function Reports() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const reportRef = useRef(null);
  const [summary, setSummary] = useState(null);
  const [interviews, setInterviews] = useState([]);
  const [cvs, setCvs] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [exporting, setExporting] = useState(false);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [summaryRes, interviewRes, cvRes, quizRes] = await Promise.all([
        api.get('/reports/summary'),
        api.get('/reports/interviews'),
        api.get('/reports/cv'),
        api.get('/reports/quizzes')
      ]);
      setSummary(summaryRes.data);
      setInterviews(interviewRes.data.interviews);
      setCvs(cvRes.data.reviews);
      setQuizzes(quizRes.data.quizzes);
    } catch {
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = () => {
  if (user?.plan !== 'pro') {
    toast.error('PDF export is a Pro feature. Upgrade to unlock it.');
    return;
  }
  setExporting(true);
  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const w = pdf.internal.pageSize.getWidth();
    let y = 20;

    // Header
    pdf.setFillColor(124, 58, 237);
    pdf.rect(0, 0, w, 14, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('AceIt — Performance Report', 10, 9);
    pdf.text(new Date().toLocaleDateString(), w - 10, 9, { align: 'right' });

    y = 24;
    pdf.setTextColor(30, 30, 30);
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`${user?.name}'s Report`, 10, y);
    y += 10;

    // Overall score
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Overall Score: ${overallScore}/100`, 10, y);
    y += 12;

    // Divider
    pdf.setDrawColor(220, 220, 220);
    pdf.line(10, y, w - 10, y);
    y += 8;

    // CV Section
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(124, 58, 237);
    pdf.text('CV Reviews', 10, y);
    y += 7;
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(50, 50, 50);
    pdf.text(`Total Reviews: ${summary?.cv?.total_reviews || 0}`, 10, y); y += 6;
    pdf.text(`Average ATS Score: ${summary?.cv?.avg_ats_score || 0}/100`, 10, y); y += 6;
    pdf.text(`Best ATS Score: ${summary?.cv?.best_ats_score || 0}/100`, 10, y); y += 10;

    // Interview Section
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(236, 72, 153);
    pdf.text('AI Interviews', 10, y);
    y += 7;
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(50, 50, 50);
    pdf.text(`Total Sessions: ${summary?.interviews?.total_interviews || 0}`, 10, y); y += 6;
    pdf.text(`Average Score: ${summary?.interviews?.avg_interview_score || 0}/10`, 10, y); y += 6;
    pdf.text(`Best Score: ${summary?.interviews?.best_interview_score || 0}/10`, 10, y); y += 10;

    // Quiz Section
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(249, 115, 22);
    pdf.text('Skill Quizzes', 10, y);
    y += 7;
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(50, 50, 50);
    pdf.text(`Total Quizzes: ${summary?.quizzes?.total_quizzes || 0}`, 10, y); y += 6;
    pdf.text(`Average Score: ${summary?.quizzes?.avg_quiz_score || 0}%`, 10, y); y += 6;
    pdf.text(`Best Score: ${summary?.quizzes?.best_quiz_score || 0}%`, 10, y); y += 10;

    // Divider
    pdf.setDrawColor(220, 220, 220);
    pdf.line(10, y, w - 10, y);
    y += 8;

    // Recent activity
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(30, 30, 30);
    pdf.text('Recent Activity', 10, y);
    y += 8;

    summary?.recent_activity?.forEach((item) => {
      if (y > 260) { pdf.addPage(); y = 20; }
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(50, 50, 50);
      pdf.text(item.title, 10, y);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(130, 130, 130);
      const type = item.type === 'cv_review' ? 'CV Review' : item.type === 'interview' ? 'AI Interview' : 'Quiz';
      const score = item.type === 'cv_review' ? `${Math.round(item.score)} ATS` : item.type === 'interview' ? `${Number(item.score).toFixed(1)}/10` : `${Math.round(item.score)}%`;
      pdf.text(`${type} · ${new Date(item.created_at).toLocaleDateString()} · Score: ${score}`, 10, y + 5);
      y += 12;
    });

    // Footer
    pdf.setFontSize(9);
    pdf.setTextColor(180, 180, 180);
    pdf.text('Generated by AceIt — aceit.com', w / 2, 290, { align: 'center' });

    pdf.save(`AceIt-Report-${user?.name}-${new Date().toLocaleDateString()}.pdf`);
    toast.success('Report exported successfully');
  } catch {
    toast.error('Failed to export PDF');
  } finally {
    setExporting(false);
  }
};

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'interviews', label: 'Interviews' },
    { id: 'cv', label: 'CV Reviews' },
    { id: 'quizzes', label: 'Quizzes' },
  ];

  if (loading) return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
      <Navbar navigate={navigate} />
      <div style={{ padding: 80, textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>Loading reports...</div>
    </div>
  );

  const overallScore = summary ? Math.round(
  (
    (Number(summary.cv.avg_ats_score) || 0) +
    ((Number(summary.interviews.avg_interview_score) || 0) * 10) +
    (Number(summary.quizzes.avg_quiz_score) || 0)
  ) / 3
) : 0;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
      <Navbar navigate={navigate} />

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '48px 48px' }}>

        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 36, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 900, marginBottom: 6, letterSpacing: '-0.5px' }}>Reports</h1>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>Your full performance breakdown across all features.</p>
          </div>
          <button onClick={handleExportPDF} disabled={exporting}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px',
              background: user?.plan === 'pro' ? 'linear-gradient(135deg, #7c3aed, #4f46e5)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${user?.plan === 'pro' ? 'transparent' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: 10, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer'
            }}>
            <Download size={15} />
            {exporting ? 'Exporting...' : user?.plan === 'pro' ? 'Export PDF' : 'Export PDF (Pro)'}
          </button>
        </motion.div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 36 }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '9px 20px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600,
                background: activeTab === tab.id ? 'rgba(124,58,237,0.15)' : 'rgba(255,255,255,0.04)',
                color: activeTab === tab.id ? '#a78bfa' : 'rgba(255,255,255,0.4)', transition: 'all 0.2s'
              }}>
              {tab.label}
            </button>
          ))}
        </div>

        <div ref={reportRef}>

          {/* Overview */}
          {activeTab === 'overview' && summary && (
            <motion.div variants={fadeUp} initial="hidden" animate="visible" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

              {/* Overall performance card */}
              <div style={{ padding: '28px 32px', background: 'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(236,72,153,0.06))', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 32, flexWrap: 'wrap' }}>
                <div style={{ textAlign: 'center', flexShrink: 0 }}>
                  <div style={{ fontSize: 64, fontWeight: 900, lineHeight: 1, background: 'linear-gradient(135deg, #a78bfa, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    {overallScore}
                  </div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>Overall Score</div>
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <ScoreBar score={Number(summary.cv.avg_ats_score || 0)} label="CV / ATS Average" color="#a78bfa" />
                  <ScoreBar score={Number((summary.interviews.avg_interview_score || 0) * 10)} label="Interview Average" color="#f472b6" />
                  <ScoreBar score={Number(summary.quizzes.avg_quiz_score || 0)} label="Quiz Average" color="#fb923c" />
                </div>
              </div>

              {/* Stat cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                {[
                  {
                    icon: <FileText size={18} />, label: 'CV Reviews',
                    value: summary.cv.total_reviews,
                    stats: [
                      { label: 'Avg ATS', value: `${summary.cv.avg_ats_score || 0}` },
                      { label: 'Best', value: `${summary.cv.best_ats_score || 0}/100` }
                    ],
                    gradient: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                    path: '/cv'
                  },
                  {
                    icon: <Brain size={18} />, label: 'Interviews',
                    value: summary.interviews.total_interviews,
                    stats: [
                      { label: 'Avg Score', value: `${summary.interviews.avg_interview_score || 0}/10` },
                      { label: 'Best', value: `${summary.interviews.best_interview_score || 0}/10` }
                    ],
                    gradient: 'linear-gradient(135deg, #ec4899, #7c3aed)',
                    path: '/interview'
                  },
                  {
                    icon: <Zap size={18} />, label: 'Quizzes',
                    value: summary.quizzes.total_quizzes,
                    stats: [
                      { label: 'Avg Score', value: `${summary.quizzes.avg_quiz_score || 0}%` },
                      { label: 'Best', value: `${summary.quizzes.best_quiz_score || 0}%` }
                    ],
                    gradient: 'linear-gradient(135deg, #f97316, #ec4899)',
                    path: '/quiz'
                  },
                ].map((stat, i) => (
                  <motion.div key={i} variants={fadeUp} initial="hidden" animate="visible" custom={i * 0.1}
                    onClick={() => navigate(stat.path)}
                    whileHover={{ y: -4 }}
                    style={{ padding: '22px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, cursor: 'pointer', transition: 'border-color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(124,58,237,0.3)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                      <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>{stat.label}</span>
                      <div style={{ padding: 8, borderRadius: 8, background: stat.gradient }}>{stat.icon}</div>
                    </div>
                    <div style={{ fontSize: 40, fontWeight: 900, marginBottom: 14 }}>{stat.value}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {stat.stats.map((s, j) => (
                        <div key={j} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                          <span style={{ color: 'rgba(255,255,255,0.35)' }}>{s.label}</span>
                          <span style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>{s.value}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Recent activity */}
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Recent Activity</h3>
                {summary.recent_activity.length === 0 ? (
                  <div style={{ padding: 32, textAlign: 'center', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 14 }}>
                    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>No activity yet.</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {summary.recent_activity.map((item, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12 }}>
                        <div style={{
                          padding: 9, borderRadius: 9, flexShrink: 0,
                          background: item.type === 'cv_review' ? 'rgba(124,58,237,0.12)' : item.type === 'interview' ? 'rgba(236,72,153,0.12)' : 'rgba(249,115,22,0.12)',
                          color: item.type === 'cv_review' ? '#a78bfa' : item.type === 'interview' ? '#f472b6' : '#fb923c'
                        }}>
                          {item.type === 'cv_review' ? <FileText size={15} /> : item.type === 'interview' ? <Brain size={15} /> : <Zap size={15} />}
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: 14, fontWeight: 600, margin: '0 0 2px' }}>{item.title}</p>
                          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', margin: 0 }}>
                            {item.type === 'cv_review' ? 'CV Review' : item.type === 'interview' ? 'AI Interview' : 'Quiz'} · {new Date(item.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: 18, fontWeight: 900, color: item.type === 'cv_review' ? '#a78bfa' : item.type === 'interview' ? '#f472b6' : '#fb923c' }}>
                            {item.type === 'cv_review' ? Math.round(item.score) : item.type === 'interview' ? Number(item.score).toFixed(1) : `${Math.round(item.score)}%`}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Interviews tab */}
          {activeTab === 'interviews' && (
            <motion.div variants={fadeUp} initial="hidden" animate="visible" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Summary bar */}
              {interviews.length > 0 && (
                <div style={{ padding: '20px 24px', background: 'rgba(236,72,153,0.05)', border: '1px solid rgba(236,72,153,0.15)', borderRadius: 16, display: 'flex', gap: 32, flexWrap: 'wrap' }}>
                  <div>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>Total Sessions</p>
                    <p style={{ fontSize: 24, fontWeight: 900, margin: 0, color: '#f472b6' }}>{interviews.length}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>Average Score</p>
                    <p style={{ fontSize: 24, fontWeight: 900, margin: 0, color: '#f472b6' }}>{summary?.interviews?.avg_interview_score || 0}/10</p>
                  </div>
                  <div>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>Best Score</p>
                    <p style={{ fontSize: 24, fontWeight: 900, margin: 0, color: '#f472b6' }}>{summary?.interviews?.best_interview_score || 0}/10</p>
                  </div>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                    <div style={{ width: '100%' }}>
                      <ScoreBar score={Number((summary?.interviews?.avg_interview_score || 0) * 10)} label="Avg Performance" color="#f472b6" />
                    </div>
                  </div>
                </div>
              )}

              <h3 style={{ fontSize: 16, fontWeight: 700 }}>All Interview Sessions</h3>
              {interviews.length === 0 ? (
                <div style={{ padding: 48, textAlign: 'center', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16 }}>
                  <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>No interviews yet.</p>
                  <button onClick={() => navigate('/interview')}
                    style={{ marginTop: 16, padding: '10px 22px', background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', border: 'none', borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                    Start an Interview
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {interviews.map((session, i) => (
                    <motion.div key={i} variants={fadeUp} initial="hidden" animate="visible" custom={i * 0.05}
                      onClick={() => navigate('/interview')}
                      style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '18px 22px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, cursor: 'pointer', transition: 'all 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(236,72,153,0.3)'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}>
                      <div style={{ padding: 10, borderRadius: 10, background: 'rgba(236,72,153,0.1)' }}>
                        <Brain size={18} style={{ color: '#f472b6' }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 14, fontWeight: 600, margin: '0 0 4px' }}>{session.job_title}</p>
                        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', margin: '0 0 8px' }}>
                          {session.major} · {session.experience_level} · {session.questions_answered} questions answered · {new Date(session.created_at).toLocaleDateString()}
                        </p>
                        {session.overall_score && (
                          <div style={{ maxWidth: 200 }}>
                            <ScoreBar score={Number(session.overall_score) * 10} label="" color="#f472b6" />
                          </div>
                        )}
                      </div>
                      <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: 12 }}>
                        {session.overall_score ? (
                          <div>
                            <span style={{ fontSize: 22, fontWeight: 900, color: scoreColor(session.overall_score, 10) }}>{Number(session.overall_score).toFixed(1)}</span>
                            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', margin: 0 }}>/10</p>
                          </div>
                        ) : (
                          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', padding: '4px 10px', background: 'rgba(255,255,255,0.05)', borderRadius: 6 }}>In Progress</span>
                        )}
                        <ChevronRight size={16} style={{ color: 'rgba(255,255,255,0.3)' }} />
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* CV tab */}
          {activeTab === 'cv' && (
            <motion.div variants={fadeUp} initial="hidden" animate="visible" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {cvs.length > 0 && (
                <div style={{ padding: '20px 24px', background: 'rgba(124,58,237,0.05)', border: '1px solid rgba(124,58,237,0.15)', borderRadius: 16, display: 'flex', gap: 32, flexWrap: 'wrap' }}>
                  <div>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>Total Reviews</p>
                    <p style={{ fontSize: 24, fontWeight: 900, margin: 0, color: '#a78bfa' }}>{cvs.length}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>Average ATS</p>
                    <p style={{ fontSize: 24, fontWeight: 900, margin: 0, color: '#a78bfa' }}>{summary?.cv?.avg_ats_score || 0}/100</p>
                  </div>
                  <div>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>Best ATS</p>
                    <p style={{ fontSize: 24, fontWeight: 900, margin: 0, color: '#a78bfa' }}>{summary?.cv?.best_ats_score || 0}/100</p>
                  </div>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                    <div style={{ width: '100%' }}>
                      <ScoreBar score={Number(summary?.cv?.avg_ats_score || 0)} label="Avg ATS Score" color="#a78bfa" />
                    </div>
                  </div>
                </div>
              )}

              <h3 style={{ fontSize: 16, fontWeight: 700 }}>All CV Reviews</h3>
              {cvs.length === 0 ? (
                <div style={{ padding: 48, textAlign: 'center', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16 }}>
                  <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>No CV reviews yet.</p>
                  <button onClick={() => navigate('/cv')}
                    style={{ marginTop: 16, padding: '10px 22px', background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', border: 'none', borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                    Review my CV
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {cvs.map((cv, i) => (
                    <motion.div key={i} variants={fadeUp} initial="hidden" animate="visible" custom={i * 0.05}
                      onClick={() => navigate('/cv')}
                      style={{ padding: '20px 22px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, cursor: 'pointer', transition: 'all 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(124,58,237,0.3)'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ padding: 10, borderRadius: 10, background: 'rgba(124,58,237,0.1)' }}>
                            <FileText size={18} style={{ color: '#a78bfa' }} />
                          </div>
                          <div>
                            <p style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>{cv.filename}</p>
                            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', margin: 0 }}>{new Date(cv.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: 28, fontWeight: 900, color: scoreColor(cv.ats_score) }}>{cv.ats_score}</span>
                          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', margin: 0 }}>ATS Score</p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <ScoreBar score={Number(cv.formatting_score) || 0} label="Formatting" color="#10b981" />
                        <ScoreBar score={Number(cv.content_score) || 0} label="Content" color="#a78bfa" />
                        <ScoreBar score={Number(cv.keywords_score) || 0} label="Keywords" color="#f59e0b" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Quizzes tab */}
          {activeTab === 'quizzes' && (
            <motion.div variants={fadeUp} initial="hidden" animate="visible" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {quizzes.length > 0 && (
                <div style={{ padding: '20px 24px', background: 'rgba(249,115,22,0.05)', border: '1px solid rgba(249,115,22,0.15)', borderRadius: 16, display: 'flex', gap: 32, flexWrap: 'wrap' }}>
                  <div>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>Total Quizzes</p>
                    <p style={{ fontSize: 24, fontWeight: 900, margin: 0, color: '#fb923c' }}>{quizzes.length}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>Average Score</p>
                    <p style={{ fontSize: 24, fontWeight: 900, margin: 0, color: '#fb923c' }}>{summary?.quizzes?.avg_quiz_score || 0}%</p>
                  </div>
                  <div>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>Best Score</p>
                    <p style={{ fontSize: 24, fontWeight: 900, margin: 0, color: '#fb923c' }}>{summary?.quizzes?.best_quiz_score || 0}%</p>
                  </div>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                    <div style={{ width: '100%' }}>
                      <ScoreBar score={Number(summary?.quizzes?.avg_quiz_score || 0)} label="Avg Performance" color="#fb923c" />
                    </div>
                  </div>
                </div>
              )}

              <h3 style={{ fontSize: 16, fontWeight: 700 }}>All Quizzes</h3>
              {quizzes.length === 0 ? (
                <div style={{ padding: 48, textAlign: 'center', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16 }}>
                  <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>No quizzes yet.</p>
                  <button onClick={() => navigate('/quiz')}
                    style={{ marginTop: 16, padding: '10px 22px', background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', border: 'none', borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                    Take a Quiz
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {quizzes.map((quiz, i) => (
                    <motion.div key={i} variants={fadeUp} initial="hidden" animate="visible" custom={i * 0.05}
                      onClick={() => navigate('/quiz')}
                      style={{ padding: '20px 22px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, cursor: 'pointer', transition: 'all 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(249,115,22,0.3)'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ padding: 10, borderRadius: 10, background: 'rgba(249,115,22,0.1)' }}>
                            <Zap size={18} style={{ color: '#fb923c' }} />
                          </div>
                          <div>
                            <p style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>{quiz.job_title}</p>
                            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', margin: 0 }}>
                              {quiz.major} · {quiz.total_questions} questions · {quiz.correct_answers} correct · {new Date(quiz.completed_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: 28, fontWeight: 900, color: scoreColor(quiz.score) }}>{Math.round(quiz.score)}%</span>
                          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', margin: 0 }}>{quiz.correct_answers}/{quiz.total_questions} correct</p>
                        </div>
                      </div>
                      <ScoreBar score={Number(quiz.score)} label="Score" color="#fb923c" />
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}