import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useIsMobile } from '../../hooks/useWindowSize';
import { ArrowLeft, Menu, X } from 'lucide-react';

export default function PageNavbar({ title, backTo = '/dashboard' }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'CV Review', path: '/cv' },
    { label: 'AI Interview', path: '/interview' },
    { label: 'Quizzes', path: '/quiz' },
    { label: 'Roadmap', path: '/roadmap' },
    { label: 'Reports', path: '/reports' },
  ];

  return (
    <>
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: isMobile ? '0 20px' : '0 48px', height: 64,
        background: 'rgba(10,10,10,0.9)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={() => navigate(backTo)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: 14, fontWeight: 500, padding: 0 }}
            onMouseEnter={e => e.currentTarget.style.color = '#fff'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}>
            <ArrowLeft size={16} /> {!isMobile && 'Dashboard'}
          </button>
          <span style={{ fontSize: 18, fontWeight: 900, background: 'linear-gradient(135deg, #a78bfa, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {title}
          </span>
        </div>

        {isMobile && (
          <button onClick={() => setMenuOpen(!menuOpen)}
            style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 4 }}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        )}
      </nav>

      <AnimatePresence>
        {isMobile && menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            style={{ position: 'fixed', top: 64, left: 0, right: 0, zIndex: 99, background: '#111', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '12px 0' }}>
            <div style={{ padding: '8px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 8 }}>
              <p style={{ fontSize: 13, fontWeight: 600, margin: 0 }}>{user?.name}</p>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', margin: 0 }}>{user?.plan} plan</p>
            </div>
            {navItems.map((item, i) => (
              <button key={i} onClick={() => { navigate(item.path); setMenuOpen(false); }}
                style={{ width: '100%', display: 'flex', alignItems: 'center', padding: '12px 20px', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.7)', fontSize: 15, fontWeight: 500, cursor: 'pointer', textAlign: 'left' }}>
                {item.label}
              </button>
            ))}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: 8 }}>
              <button onClick={() => { navigate('/settings'); setMenuOpen(false); }}
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
    </>
  );
}