import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useIsMobile } from '../hooks/useWindowSize';
import api from '../services/api';
import {
  FileText, Brain, Zap,  Trophy, LogOut,
  ArrowRight, Star, ChevronDown, Settings as SettingsIcon, Menu, X
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08, ease: 'easeOut' } })
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
  const padding = isMobile ? '24px 20px' : '48px 48px';

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', color: '#fff', fontFamily: 'Inter, sans-serif' }}>

      {/* Top Navbar */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: isMobile ? '0 20px' : '0 48px', height: 64,
        background: 'rgba(10,10,10,0.9)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)'
      }}>
        <span style={{ fontSize: 20, fontWeight: 900, background: 'linear-gradient(135deg, #a78bfa, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          AceIt
        </span>

        {/* Desktop nav links */}
        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1, marginLeft: 32 }}>
            {navItems.map((item, i) => (
              <button key={i} onClick={() => navigate(item.path)}
                style={{
                  padding: '8px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
                  background: item.path === '/dashboard' ? 'rgba(124,58,237,0.12)' : 'transparent',
                  color: item.path === '/dashboard' ? '#a78bfa' : 'rgba(255,255,255,0.5)',
                  fontSize: 14, fontWeight: 500, transition: 'all 0.2s'
                }}
                onMouseEnter={e => { if (item.path !== '/dashboard') { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; } }}
                onMouseLeave={e => { if (item.path !== '/dashboard') { e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; e.currentTarget.style.background = 'transparent'; } }}>
                {item.label}
              </button>
            ))}
          </div>
        )}

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {!isMobile && user?.plan === 'free' && (
            <button onClick={() => navigate('/pricing')}
              style={{ padding: '8px 16px', background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', border: 'none', borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              Upgrade
            </button>
          )}

          {!isMobile && (
            <span style={{ padding: '4px 12px', borderRadius: 100, background: plan.bg, color: plan.text, fontSize: 12, fontWeight: 600 }}>
              {plan.label}
            </span>
          )}

          {/* Profile dropdown - desktop */}
          {!isMobile && (
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
                <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: 8, width: 200, background: '#161616', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 8, zIndex: 200 }}>
                  <div style={{ padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 4 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, margin: 0 }}>{user?.name}</p>
                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', margin: 0 }}>{user?.email}</p>
                  </div>
                  <button onClick={() => { navigate('/settings'); setProfileOpen(false); }}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: 13, cursor: 'pointer', borderRadius: 8, transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}>
                    <SettingsIcon size={14} /> Settings
                  </button>
                  <button onClick={logout}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: 13, cursor: 'pointer', borderRadius: 8, transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#ef4444'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}>
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Mobile hamburger */}
          {isMobile && (
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 4 }}>
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          )}
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobile && mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            style={{ position: 'fixed', top: 64, left: 0, right: 0, zIndex: 99, background: '#111', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '12px 0' }}>
            <div style={{ padding: '8px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 8 }}>
              <p style={{ fontSize: 13, fontWeight: 600, margin: 0 }}>{user?.name}</p>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', margin: 0 }}>{plan.label}</p>
            </div>
            {navItems.map((item, i) => (
              <button key={i} onClick={() => { navigate(item.path); setMobileMenuOpen(false); }}
                style={{ width: '100%', display: 'flex', alignItems: 'center', padding: '12px 20px', background: 'transparent', border: 'none', color: item.path === '/dashboard' ? '#a78bfa' : 'rgba(255,255,255,0.7)', fontSize: 15, fontWeight: item.path === '/dashboard' ? 700 : 500, cursor: 'pointer', textAlign: 'left' }}>
                {item.label}
              </button>
            ))}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: 8, padding: '8px 0' }}>
              {user?.plan === 'free' && (
                <button onClick={() => { navigate('/pricing'); setMobileMenuOpen(false); }}
                  style={{ width: '100%', padding: '12px 20px', background: 'transparent', border: 'none', color: '#a78bfa', fontSize: 15, fontWeight: 600, cursor: 'pointer', textAlign: 'left' }}>
                  Upgrade Plan
                </button>
              )}
              <button onClick={() => { navigate('/settings'); setMobileMenuOpen(false); }}
                style={{ width: '100%', padding: '12px 20px', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.7)', fontSize: 15, cursor: 'pointer', textAlign: 'left' }}>
                Settings
              </button>
              <button onClick={logout}
                style={{ width: '100%', padding: '12px 20px', background: 'transparent', border: 'none', color: '#ef4444', fontSize: 15, cursor: 'pointer', textAlign: 'left' }}>
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page content */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding }}>

        {/* Upgrade banner */}
        {user?.plan === 'free' && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}
            style={{ marginBottom: 24, padding: isMobile ? '14px 16px' : '16px 24px', borderRadius: 14, background: 'linear-gradient(135deg, rgba(124,58,237,0.12), rgba(236,72,153,0.08))', border: '1px solid rgba(124,58,237,0.25)', display: 'flex', alignItems: isMobile ? 'flex-start' : 'center', justifyContent: 'space-between', flexDirection: isMobile ? 'column' : 'row', gap: 12 }}>
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
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.1} style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: isMobile ? 22 : 26, fontWeight: 900, marginBottom: 4, letterSpacing: '-0.5px' }}>Welcome back, {user?.name?.split(' ')[0]}</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>Here is your progress at a glance.</p>
        </motion.div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: 12, marginBottom: 32 }}>
          {[
            { label: 'CV Reviews', value: loading ? '—' : summary?.cv?.total_reviews || 0, sub: `Best ATS: ${loading ? '—' : summary?.cv?.best_ats_score || 0}`, icon: <FileText size={16} />, gradient: 'linear-gradient(135deg, #7c3aed, #4f46e5)' },
            { label: 'Interviews', value: loading ? '—' : summary?.interviews?.total_interviews || 0, sub: `Avg: ${loading ? '—' : summary?.interviews?.avg_interview_score || 0}/10`, icon: <Brain size={16} />, gradient: 'linear-gradient(135deg, #ec4899, #7c3aed)' },
            { label: 'Quizzes', value: loading ? '—' : summary?.quizzes?.total_quizzes || 0, sub: `Avg: ${loading ? '—' : summary?.quizzes?.avg_quiz_score || 0}%`, icon: <Zap size={16} />, gradient: 'linear-gradient(135deg, #f97316, #ec4899)' },
            { label: 'Best Quiz', value: loading ? '—' : `${summary?.quizzes?.best_quiz_score || 0}%`, sub: 'Personal best', icon: <Star size={16} />, gradient: 'linear-gradient(135deg, #10b981, #0ea5e9)' },
          ].map((stat, i) => (
            <motion.div key={i} variants={fadeUp} initial="hidden" animate="visible" custom={0.2 + i * 0.08}
              style={{ padding: isMobile ? '16px' : '20px 22px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>{stat.label}</span>
                <div style={{ padding: 6, borderRadius: 7, background: stat.gradient }}>{stat.icon}</div>
              </div>
              <div style={{ fontSize: isMobile ? 24 : 30, fontWeight: 900, marginBottom: 4 }}>{stat.value}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{stat.sub}</div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.5} style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14, color: 'rgba(255,255,255,0.9)' }}>Quick Actions</h2>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: 12 }}>
            {quickActions.map((action, i) => (
              <motion.button key={i} onClick={() => navigate(action.path)}
                whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }}
                style={{ padding: isMobile ? '16px 12px' : '20px', borderRadius: 14, border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)', cursor: 'pointer', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'inline-flex', padding: 9, borderRadius: 10, background: action.gradient, boxShadow: `0 4px 16px ${action.glow}` }}>
                  {action.icon}
                </div>
                <div>
                  <p style={{ fontSize: isMobile ? 13 : 14, fontWeight: 700, color: '#fff', margin: '0 0 3px' }}>{action.title}</p>
                  {!isMobile && <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', margin: 0 }}>{action.desc}</p>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#a78bfa', fontWeight: 600 }}>
                  Go <ArrowRight size={12} />
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.7}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14, color: 'rgba(255,255,255,0.9)' }}>Recent Activity</h2>
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>Loading...</div>
          ) : summary?.recent_activity?.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {summary.recent_activity.map((item, i) => (
                <motion.div key={i} variants={fadeUp} initial="hidden" animate="visible" custom={i * 0.05}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: isMobile ? '12px 14px' : '14px 18px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12 }}>
                  <div style={{
                    padding: 8, borderRadius: 8, flexShrink: 0,
                    background: item.type === 'cv_review' ? 'rgba(124,58,237,0.12)' : item.type === 'interview' ? 'rgba(236,72,153,0.12)' : 'rgba(249,115,22,0.12)',
                    color: item.type === 'cv_review' ? '#a78bfa' : item.type === 'interview' ? '#f472b6' : '#fb923c'
                  }}>
                    {item.type === 'cv_review' ? <FileText size={14} /> : item.type === 'interview' ? <Brain size={14} /> : <Zap size={14} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, margin: '0 0 2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</p>
                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', margin: 0 }}>
                      {item.type === 'cv_review' ? 'CV Review' : item.type === 'interview' ? 'AI Interview' : 'Quiz'} · {new Date(item.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <span style={{ fontSize: 16, fontWeight: 900, color: '#a78bfa' }}>
                      {item.type === 'cv_review' ? Math.round(item.score) : item.type === 'interview' ? Number(item.score).toFixed(1) : `${Math.round(item.score)}%`}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '32px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 14 }}>
              <p style={{ color: 'rgba(255,255,255,0.3)', marginBottom: 14, fontSize: 14 }}>No activity yet. Start with a CV review or an interview.</p>
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