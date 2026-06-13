import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  FileText, Brain, Zap,  Trophy, LogOut,
  ArrowRight, Star, ChevronDown
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08, ease: 'easeOut' } })
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await api.get('/reports/summary');
        setSummary(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  const navItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'CV Review', path: '/cv' },
    { label: 'AI Interview', path: '/interview' },
    { label: 'Quizzes', path: '/quiz' },
    { label: 'Roadmap', path: '/roadmap' },
    { label: 'Reports', path: '/reports' },
  ];

  const quickActions = [
    { icon: <FileText size={22} />, title: 'Review my CV', desc: 'Get your ATS score and feedback', gradient: 'linear-gradient(135deg, #7c3aed, #4f46e5)', path: '/cv', glow: 'rgba(124,58,237,0.25)' },
    { icon: <Brain size={22} />, title: 'Start Interview', desc: 'Practice with AI interviewer', gradient: 'linear-gradient(135deg, #ec4899, #7c3aed)', path: '/interview', glow: 'rgba(236,72,153,0.25)' },
    { icon: <Zap size={22} />, title: 'Take a Quiz', desc: 'Test your tech knowledge', gradient: 'linear-gradient(135deg, #f97316, #ec4899)', path: '/quiz', glow: 'rgba(249,115,22,0.25)' },
    { icon: <Trophy size={22} />, title: 'My Roadmap', desc: 'View your improvement plan', gradient: 'linear-gradient(135deg, #10b981, #0ea5e9)', path: '/roadmap', glow: 'rgba(16,185,129,0.25)' },
  ];

  const planColors = {
    free: { bg: 'rgba(255,255,255,0.08)', text: 'rgba(255,255,255,0.6)', label: 'Free Plan' },
    basic: { bg: 'rgba(124,58,237,0.2)', text: '#a78bfa', label: 'Basic Plan' },
    pro: { bg: 'rgba(236,72,153,0.2)', text: '#f472b6', label: 'Pro Plan' }
  };

  const plan = planColors[user?.plan] || planColors.free;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', color: '#fff', fontFamily: 'Inter, sans-serif' }}>

      {/* Top Navbar */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 48px', height: 64,
        background: 'rgba(10,10,10,0.9)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)'
      }}>
        {/* Logo */}
        <span style={{ fontSize: 20, fontWeight: 900, background: 'linear-gradient(135deg, #a78bfa, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginRight: 40, flexShrink: 0 }}>
          AceIt
        </span>

        {/* Nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1 }}>
          {navItems.map((item, i) => (
            <button key={i} onClick={() => navigate(item.path)}
              style={{
                padding: '8px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
                background: item.path === '/dashboard' ? 'rgba(124,58,237,0.12)' : 'transparent',
                color: item.path === '/dashboard' ? '#a78bfa' : 'rgba(255,255,255,0.5)',
                fontSize: 14, fontWeight: 500, transition: 'all 0.2s'
              }}
              onMouseEnter={e => { if (item.path !== '/dashboard') { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; } }}
              onMouseLeave={e => { if (item.path !== '/dashboard') { e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; e.currentTarget.style.background = 'transparent'; } }}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {user?.plan === 'free' && (
            <button onClick={() => navigate('/pricing')}
              style={{ padding: '8px 16px', background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', border: 'none', borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              Upgrade
            </button>
          )}

          {/* Plan badge */}
          <span style={{ padding: '4px 12px', borderRadius: 100, background: plan.bg, color: plan.text, fontSize: 12, fontWeight: 600 }}>
            {plan.label}
          </span>

          {/* Profile dropdown */}
          <div style={{ position: 'relative' }}>
            <button onClick={() => setProfileOpen(!profileOpen)}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, cursor: 'pointer' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff' }}>
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{user?.name?.split(' ')[0]}</span>
              <ChevronDown size={14} style={{ color: 'rgba(255,255,255,0.4)' }} />
            </button>

            {profileOpen && (
              <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: 8, width: 180, background: '#161616', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 8, zIndex: 200 }}>
                <div style={{ padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 4 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, margin: 0 }}>{user?.name}</p>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', margin: 0 }}>{user?.email}</p>
                </div>
                <button onClick={logout}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: 13, cursor: 'pointer', borderRadius: 8, transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#ef4444'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}>
                  <LogOut size={14} /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Page content */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 48px' }}>

        {/* Upgrade banner */}
        {user?.plan === 'free' && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}
            style={{ marginBottom: 32, padding: '16px 24px', borderRadius: 14, background: 'linear-gradient(135deg, rgba(124,58,237,0.12), rgba(236,72,153,0.08))', border: '1px solid rgba(124,58,237,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, margin: '0 0 2px' }}>You are on the Free plan</p>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', margin: 0 }}>Upgrade to Pro for unlimited interviews, CV reviews, and quizzes.</p>
            </div>
            <button onClick={() => navigate('/pricing')}
              style={{ padding: '9px 20px', background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', border: 'none', borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 6 }}>
              Upgrade Now <ArrowRight size={14} />
            </button>
          </motion.div>
        )}

        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.1} style={{ marginBottom: 36 }}>
          <h1 style={{ fontSize: 26, fontWeight: 900, marginBottom: 4, letterSpacing: '-0.5px' }}>Welcome back, {user?.name?.split(' ')[0]}</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>Here is your progress at a glance.</p>
        </motion.div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 40 }}>
          {[
            { label: 'CV Reviews', value: loading ? '—' : summary?.cv?.total_reviews || 0, sub: `Best ATS: ${loading ? '—' : summary?.cv?.best_ats_score || 0}`, icon: <FileText size={16} />, gradient: 'linear-gradient(135deg, #7c3aed, #4f46e5)' },
            { label: 'Interviews', value: loading ? '—' : summary?.interviews?.total_interviews || 0, sub: `Avg: ${loading ? '—' : summary?.interviews?.avg_interview_score || 0}/10`, icon: <Brain size={16} />, gradient: 'linear-gradient(135deg, #ec4899, #7c3aed)' },
            { label: 'Quizzes', value: loading ? '—' : summary?.quizzes?.total_quizzes || 0, sub: `Avg: ${loading ? '—' : summary?.quizzes?.avg_quiz_score || 0}%`, icon: <Zap size={16} />, gradient: 'linear-gradient(135deg, #f97316, #ec4899)' },
            { label: 'Best Quiz', value: loading ? '—' : `${summary?.quizzes?.best_quiz_score || 0}%`, sub: 'Personal best', icon: <Star size={16} />, gradient: 'linear-gradient(135deg, #10b981, #0ea5e9)' },
          ].map((stat, i) => (
            <motion.div key={i} variants={fadeUp} initial="hidden" animate="visible" custom={0.2 + i * 0.08}
              style={{ padding: '20px 22px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>{stat.label}</span>
                <div style={{ padding: 7, borderRadius: 8, background: stat.gradient }}>{stat.icon}</div>
              </div>
              <div style={{ fontSize: 30, fontWeight: 900, marginBottom: 4 }}>{stat.value}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>{stat.sub}</div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.5} style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 16, color: 'rgba(255,255,255,0.9)' }}>Quick Actions</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
            {quickActions.map((action, i) => (
              <motion.button key={i} onClick={() => navigate(action.path)}
                whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }}
                style={{ padding: '20px', borderRadius: 14, border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)', cursor: 'pointer', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'inline-flex', padding: 10, borderRadius: 10, background: action.gradient, boxShadow: `0 4px 16px ${action.glow}` }}>
                  {action.icon}
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#fff', margin: '0 0 4px' }}>{action.title}</p>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', margin: 0 }}>{action.desc}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#a78bfa', fontWeight: 600 }}>
                  Get started <ArrowRight size={12} />
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.7}>
          <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 16, color: 'rgba(255,255,255,0.9)' }}>Recent Activity</h2>
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>Loading...</div>
          ) : summary?.recent_activity?.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {summary.recent_activity.map((item, i) => (
                <motion.div key={i} variants={fadeUp} initial="hidden" animate="visible" custom={i * 0.05}
                  style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12 }}>
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
                    <span style={{ fontSize: 18, fontWeight: 900, color: '#a78bfa' }}>
                      {item.type === 'cv_review' ? Math.round(item.score) : item.type === 'interview' ? Number(item.score).toFixed(1) : `${Math.round(item.score)}%`}
                    </span>
                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', margin: 0 }}>
                      {item.type === 'cv_review' ? 'ATS' : item.type === 'interview' ? '/10' : 'score'}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '40px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 14 }}>
              <p style={{ color: 'rgba(255,255,255,0.3)', marginBottom: 16, fontSize: 14 }}>No activity yet. Start with a CV review or an interview.</p>
              <button onClick={() => navigate('/cv')}
                style={{ padding: '10px 22px', background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', border: 'none', borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                Get Started
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}