import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import {
  Upload, FileText, CheckCircle, XCircle, 
  ArrowLeft, BarChart3, Tag, TrendingUp, Clock, ChevronRight
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08, ease: 'easeOut' } })
};

const Navbar = ({ navigate }) => {
  return (
    <nav style={{ position: 'sticky', top: 0, zIndex: 100, display: 'flex', alignItems: 'center', padding: '0 48px', height: 64, background: 'rgba(10,10,10,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <button onClick={() => navigate('/dashboard')}
        style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: 14, fontWeight: 500, padding: '8px 0', marginRight: 24 }}
        onMouseEnter={e => e.currentTarget.style.color = '#fff'}
        onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}>
        <ArrowLeft size={16} /> Dashboard
      </button>
      <span style={{ fontSize: 18, fontWeight: 900, background: 'linear-gradient(135deg, #a78bfa, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>CV Review</span>
    </nav>
  );
};

const ScoreRing = ({ score, size = 120 }) => {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: size * 0.22, fontWeight: 900, color }}>{score}</span>
        <span style={{ fontSize: size * 0.1, color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>/ 100</span>
      </div>
    </div>
  );
};

export default function CvReview() {
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [view, setView] = useState('upload'); // upload | result | history

  const handleFile = (f) => {
    if (!f) return;
    if (f.type !== 'application/pdf') { toast.error('Only PDF files are allowed'); return; }
    if (f.size > 5 * 1024 * 1024) { toast.error('File must be under 5MB'); return; }
    setFile(f);
  };

  const handleUpload = async () => {
    if (!file) { toast.error('Please select a PDF file'); return; }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('cv', file);
      const res = await api.post('/cv/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(res.data.review);
      setView('result');
      toast.success('CV analyzed successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to analyze CV');
      if (err.response?.data?.upgrade) navigate('/settings?tab=plan');
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = async () => {
    try {
      const res = await api.get('/cv/history');
      setHistory(res.data.reviews);
      setView('history');
    } catch {
      toast.error('Failed to load history');
    }
  };

  const scoreColor = (score) => score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
      <Navbar navigate={navigate} />

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 48px' }}>

        {/* Tab switcher */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 40 }}>
          {[
            { id: 'upload', label: 'New Review' },
            { id: 'history', label: 'Past Reviews' },
          ].map(tab => (
            <button key={tab.id}
              onClick={() => tab.id === 'history' ? loadHistory() : setView('upload')}
              style={{
                padding: '9px 20px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600,
                background: view === tab.id || (tab.id === 'upload' && view === 'result') ? 'rgba(124,58,237,0.15)' : 'rgba(255,255,255,0.04)',
                color: view === tab.id || (tab.id === 'upload' && view === 'result') ? '#a78bfa' : 'rgba(255,255,255,0.4)',
                transition: 'all 0.2s'
              }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Upload view */}
        {view === 'upload' && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible">
            <div style={{ marginBottom: 32 }}>
              <h1 style={{ fontSize: 26, fontWeight: 900, marginBottom: 6, letterSpacing: '-0.5px' }}>CV Review</h1>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>Upload your CV and get an honest ATS score with actionable feedback.</p>
            </div>

            {/* Drop zone */}
            <div
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
              onClick={() => fileRef.current?.click()}
              style={{
                border: `2px dashed ${dragging ? '#7c3aed' : file ? 'rgba(124,58,237,0.5)' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: 20, padding: '60px 40px', textAlign: 'center', cursor: 'pointer',
                background: dragging ? 'rgba(124,58,237,0.05)' : file ? 'rgba(124,58,237,0.03)' : 'rgba(255,255,255,0.02)',
                transition: 'all 0.2s', marginBottom: 24
              }}>
              <input ref={fileRef} type="file" accept=".pdf" style={{ display: 'none' }} onChange={e => handleFile(e.target.files[0])} />

              {file ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                  <div style={{ padding: 16, borderRadius: 16, background: 'rgba(124,58,237,0.15)' }}>
                    <FileText size={32} style={{ color: '#a78bfa' }} />
                  </div>
                  <p style={{ fontSize: 15, fontWeight: 700, color: '#fff', margin: 0 }}>{file.name}</p>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: 0 }}>{(file.size / 1024).toFixed(0)} KB · PDF</p>
                  <button onClick={e => { e.stopPropagation(); setFile(null); }}
                    style={{ padding: '6px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, color: '#ef4444', fontSize: 12, cursor: 'pointer' }}>
                    Remove
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                  <div style={{ padding: 16, borderRadius: 16, background: 'rgba(255,255,255,0.04)' }}>
                    <Upload size={32} style={{ color: 'rgba(255,255,255,0.3)' }} />
                  </div>
                  <p style={{ fontSize: 15, fontWeight: 600, color: 'rgba(255,255,255,0.7)', margin: 0 }}>Drop your CV here or click to browse</p>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', margin: 0 }}>PDF only · Max 5MB</p>
                </div>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={handleUpload} disabled={loading || !file}
              style={{
                width: '100%', padding: '14px', background: !file || loading ? 'rgba(124,58,237,0.3)' : 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                border: 'none', borderRadius: 12, color: '#fff', fontSize: 15, fontWeight: 700,
                cursor: !file || loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
              }}>
              {loading ? (
                <>
                  <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  Analyzing your CV...
                </>
              ) : 'Analyze my CV'}
            </motion.button>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

            {/* Info cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginTop: 32 }}>
              {[
                { icon: <BarChart3 size={16} />, title: 'ATS Score', desc: 'Get scored out of 100 like real ATS systems' },
                { icon: <Tag size={16} />, title: 'Keyword Analysis', desc: 'See what keywords are missing from your CV' },
                { icon: <TrendingUp size={16} />, title: 'Actionable Tips', desc: 'Specific improvements you can apply today' },
              ].map((card, i) => (
                <div key={i} style={{ padding: '16px 18px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12 }}>
                  <div style={{ color: '#a78bfa', marginBottom: 8 }}>{card.icon}</div>
                  <p style={{ fontSize: 13, fontWeight: 700, margin: '0 0 4px' }}>{card.title}</p>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', margin: 0, lineHeight: 1.5 }}>{card.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Result view */}
        {view === 'result' && result && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
              <div>
                <h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 4 }}>Your Results</h1>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>{result.filename}</p>
              </div>
              <button onClick={() => { setFile(null); setResult(null); setView('upload'); }}
                style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                Analyze Another CV
              </button>
            </div>

            {/* Score overview */}
            <div style={{ padding: '28px 32px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 32, flexWrap: 'wrap' }}>
              <ScoreRing score={result.ats_score} size={130} />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>Overall ATS Score</p>
                <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, margin: 0 }}>{result.feedback.overall_summary}</p>
              </div>
            </div>

            {/* Sub scores */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
              {[
                { label: 'Formatting', score: result.feedback.formatting_score },
                { label: 'Content', score: result.feedback.content_score },
                { label: 'Keywords', score: result.feedback.keywords_score },
              ].map((item, i) => (
                <div key={i} style={{ padding: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 13 }}>
                    <span style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>{item.label}</span>
                    <span style={{ fontWeight: 700, color: scoreColor(item.score) }}>{item.score}%</span>
                  </div>
                  <div style={{ height: 6, background: 'rgba(255,255,255,0.07)', borderRadius: 10 }}>
                    <div style={{ height: '100%', width: `${item.score}%`, background: scoreColor(item.score), borderRadius: 10, transition: 'width 1s ease' }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Strengths & Weaknesses */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ padding: '20px 24px', background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 16 }}>
                <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 14, color: '#10b981' }}>Strengths</p>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {result.feedback.strengths?.map((s, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.5 }}>
                      <CheckCircle size={14} style={{ color: '#10b981', flexShrink: 0, marginTop: 2 }} /> {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div style={{ padding: '20px 24px', background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 16 }}>
                <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 14, color: '#ef4444' }}>Weaknesses</p>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {result.feedback.weaknesses?.map((w, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.5 }}>
                      <XCircle size={14} style={{ color: '#ef4444', flexShrink: 0, marginTop: 2 }} /> {w}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Improvements */}
            <div style={{ padding: '20px 24px', background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: 16 }}>
              <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 14, color: '#f59e0b' }}>How to Improve</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {result.feedback.improvements?.map((imp, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: 10 }}>
                    <span style={{ fontSize: 12, fontWeight: 800, color: '#f59e0b', background: 'rgba(245,158,11,0.1)', padding: '2px 8px', borderRadius: 6, flexShrink: 0 }}>{i + 1}</span>
                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', margin: 0, lineHeight: 1.6 }}>{imp}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Missing keywords */}
            <div style={{ padding: '20px 24px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16 }}>
              <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Missing Keywords</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {result.feedback.keywords_missing?.map((kw, i) => (
                  <span key={i} style={{ padding: '6px 14px', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 100, fontSize: 13, color: '#a78bfa', fontWeight: 500 }}>
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* History view */}
        {view === 'history' && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible">
            <h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 24 }}>Past Reviews</h1>
            {history.length === 0 ? (
              <div style={{ padding: 48, textAlign: 'center', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16 }}>
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>No CV reviews yet. Upload your first CV to get started.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {history.map((review, i) => (
  <motion.div key={i} whileHover={{ x: 4 }} onClick={async () => {
    try {
      const res = await api.get(`/cv/${review.id}`);
      setResult(res.data.review);
      setView('result');
    } catch {
      toast.error('Failed to load review');
    }
  }}
    style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '18px 22px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, cursor: 'pointer', transition: 'all 0.2s' }}
    onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(124,58,237,0.3)'}
    onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}>
    <div style={{ padding: 10, borderRadius: 10, background: 'rgba(124,58,237,0.1)' }}>
      <FileText size={18} style={{ color: '#a78bfa' }} />
    </div>
    <div style={{ flex: 1 }}>
      <p style={{ fontSize: 14, fontWeight: 600, margin: '0 0 2px' }}>{review.filename}</p>
      <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', margin: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
        <Clock size={11} /> {new Date(review.created_at).toLocaleDateString()}
      </p>
    </div>
    <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: 12 }}>
      <div>
        <span style={{ fontSize: 22, fontWeight: 900, color: scoreColor(review.ats_score) }}>{review.ats_score}</span>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', margin: 0 }}>ATS Score</p>
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