import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import {
  ArrowLeft, Trophy, CheckCircle, Circle, Trash2,
  FileText, Brain, Zap,  Filter
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.06, ease: 'easeOut' } })
};

const Navbar = ({ navigate }) => (
  <nav style={{ position: 'sticky', top: 0, zIndex: 100, display: 'flex', alignItems: 'center', padding: '0 48px', height: 64, background: 'rgba(10,10,10,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
    <button onClick={() => navigate('/dashboard')}
      style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: 14, fontWeight: 500, padding: '8px 0', marginRight: 24 }}
      onMouseEnter={e => e.currentTarget.style.color = '#fff'}
      onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}>
      <ArrowLeft size={16} /> Dashboard
    </button>
    <span style={{ fontSize: 18, fontWeight: 900, background: 'linear-gradient(135deg, #a78bfa, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Roadmap</span>
  </nav>
);

const typeIcon = (type) => {
  if (type === 'cv') return <FileText size={14} />;
  if (type === 'interview') return <Brain size={14} />;
  return <Zap size={14} />;
};

const typeColor = (type) => {
  if (type === 'cv') return { color: '#a78bfa', bg: 'rgba(124,58,237,0.1)' };
  if (type === 'interview') return { color: '#f472b6', bg: 'rgba(236,72,153,0.1)' };
  return { color: '#fb923c', bg: 'rgba(249,115,22,0.1)' };
};

const priorityColor = (priority) => {
  if (priority === 'high') return { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', label: 'High' };
  if (priority === 'medium') return { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', label: 'Medium' };
  return { color: '#10b981', bg: 'rgba(16,185,129,0.1)', label: 'Low' };
};

export default function Roadmap() {
  const navigate = useNavigate();
  const [roadmap, setRoadmap] = useState({ high: [], medium: [], low: [] });
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all | pending | done
  const [typeFilter, setTypeFilter] = useState('all'); // all | cv | interview | quiz

  useEffect(() => {
    fetchRoadmap();
  }, []);

  const fetchRoadmap = async () => {
    try {
      const res = await api.get('/roadmap');
      setRoadmap(res.data.roadmap);
      setTotal(res.data.total);
    } catch {
      toast.error('Failed to load roadmap');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id) => {
    try {
      await api.patch(`/roadmap/${id}/toggle`);
      fetchRoadmap();
    } catch {
      toast.error('Failed to update item');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/roadmap/${id}`);
      fetchRoadmap();
      toast.success('Item removed');
    } catch {
      toast.error('Failed to delete item');
    }
  };

  const allItems = [
    ...roadmap.high.map(i => ({ ...i, priority: 'high' })),
    ...roadmap.medium.map(i => ({ ...i, priority: 'medium' })),
    ...roadmap.low.map(i => ({ ...i, priority: 'low' }))
  ];

  const filtered = allItems.filter(item => {
    if (filter === 'pending' && item.is_done) return false;
    if (filter === 'done' && !item.is_done) return false;
    if (typeFilter !== 'all' && item.type !== typeFilter) return false;
    return true;
  });

  const doneCount = allItems.filter(i => i.is_done).length;
  const progress = total > 0 ? Math.round((doneCount / total) * 100) : 0;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
      <Navbar navigate={navigate} />

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 48px' }}>

        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0} style={{ marginBottom: 36 }}>
          <h1 style={{ fontSize: 26, fontWeight: 900, marginBottom: 6, letterSpacing: '-0.5px' }}>Your Roadmap</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>Your personalized improvement plan based on your CV, interview, and quiz results.</p>
        </motion.div>

        {/* Progress card */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.1}
          style={{ padding: '24px 28px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
            <div>
              <p style={{ fontSize: 15, fontWeight: 700, margin: '0 0 2px' }}>Overall Progress</p>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: 0 }}>{doneCount} of {total} items completed</p>
            </div>
            <span style={{ fontSize: 28, fontWeight: 900, color: progress >= 80 ? '#10b981' : progress >= 50 ? '#f59e0b' : '#a78bfa' }}>{progress}%</span>
          </div>
          <div style={{ height: 8, background: 'rgba(255,255,255,0.07)', borderRadius: 10 }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              style={{ height: '100%', background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', borderRadius: 10 }}
            />
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 20, marginTop: 16, flexWrap: 'wrap' }}>
            {[
              { label: 'High Priority', count: roadmap.high.length, color: '#ef4444' },
              { label: 'Medium Priority', count: roadmap.medium.length, color: '#f59e0b' },
              { label: 'Low Priority', count: roadmap.low.length, color: '#10b981' },
            ].map((stat, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: stat.color }} />
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{stat.count} {stat.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.2}
          style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          <Filter size={14} style={{ color: 'rgba(255,255,255,0.3)' }} />
          {[
            { id: 'all', label: 'All' },
            { id: 'pending', label: 'Pending' },
            { id: 'done', label: 'Done' }
          ].map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)}
              style={{ padding: '6px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, transition: 'all 0.2s', background: filter === f.id ? 'rgba(124,58,237,0.15)' : 'rgba(255,255,255,0.04)', color: filter === f.id ? '#a78bfa' : 'rgba(255,255,255,0.4)' }}>
              {f.label}
            </button>
          ))}
          <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.08)', margin: '0 4px' }} />
          {[
            { id: 'all', label: 'All Types' },
            { id: 'cv', label: 'CV' },
            { id: 'interview', label: 'Interview' },
            { id: 'quiz', label: 'Quiz' }
          ].map(f => (
            <button key={f.id} onClick={() => setTypeFilter(f.id)}
              style={{ padding: '6px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, transition: 'all 0.2s', background: typeFilter === f.id ? 'rgba(124,58,237,0.15)' : 'rgba(255,255,255,0.04)', color: typeFilter === f.id ? '#a78bfa' : 'rgba(255,255,255,0.4)' }}>
              {f.label}
            </button>
          ))}
        </motion.div>

        {/* Items */}
        {loading ? (
          <div style={{ padding: 48, textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>Loading your roadmap...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16 }}>
            <Trophy size={32} style={{ color: 'rgba(255,255,255,0.1)', marginBottom: 12 }} />
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14, marginBottom: 4 }}>
              {total === 0 ? 'No roadmap items yet.' : 'No items match your filters.'}
            </p>
            <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 13 }}>
              {total === 0 ? 'Complete a CV review, interview, or quiz to generate your roadmap.' : 'Try changing the filters above.'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <AnimatePresence>
              {filtered.map((item, i) => {
                const pColor = priorityColor(item.priority);
                const tColor = typeColor(item.type);
                return (
                  <motion.div key={item.id}
                    variants={fadeUp} initial="hidden" animate="visible" custom={i * 0.04}
                    exit={{ opacity: 0, x: -20 }}
                    style={{
                      display: 'flex', alignItems: 'flex-start', gap: 14, padding: '16px 18px',
                      background: item.is_done ? 'rgba(255,255,255,0.01)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${item.is_done ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.07)'}`,
                      borderRadius: 14, transition: 'all 0.2s'
                    }}>

                    {/* Toggle */}
                    <button onClick={() => handleToggle(item.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0, marginTop: 2, color: item.is_done ? '#10b981' : 'rgba(255,255,255,0.2)', transition: 'color 0.2s' }}>
                      {item.is_done ? <CheckCircle size={20} /> : <Circle size={20} />}
                    </button>

                    {/* Content */}
                    <div style={{ flex: 1 }}>
                      <p style={{
                        fontSize: 14, fontWeight: 600, margin: '0 0 8px', lineHeight: 1.5,
                        color: item.is_done ? 'rgba(255,255,255,0.35)' : '#fff',
                        textDecoration: item.is_done ? 'line-through' : 'none'
                      }}>
                        {item.suggestion}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 10px', borderRadius: 100, background: tColor.bg, color: tColor.color, fontSize: 11, fontWeight: 600 }}>
                          {typeIcon(item.type)} {item.type.toUpperCase()}
                        </span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 10px', borderRadius: 100, background: pColor.bg, color: pColor.color, fontSize: 11, fontWeight: 600 }}>
                          {pColor.label}
                        </span>
                      </div>
                    </div>

                    {/* Delete */}
                    <button onClick={() => handleDelete(item.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'rgba(255,255,255,0.2)', flexShrink: 0, borderRadius: 6, transition: 'all 0.2s' }}
                      onMouseEnter={e => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; }}
                      onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.2)'; e.currentTarget.style.background = 'none'; }}>
                      <Trash2 size={15} />
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}