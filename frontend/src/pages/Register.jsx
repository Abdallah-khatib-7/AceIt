import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Zap,  ArrowRight, CheckCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';



const perks = [
  'AI-powered CV analysis with ATS scoring',
  'Live interview practice with real feedback',
  'Skill quizzes tailored to your stack',
  'Personalized improvement roadmap',
];

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/auth/register', form);
      login(res.data.user, res.data.token);
      toast.success('Account created! Let\'s AceIt 🚀');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0a0a0a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Inter, sans-serif',
      position: 'relative',
      overflow: 'hidden',
      padding: '40px 24px'
    }}>
      

      {/* Background */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80" alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.04 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(124,58,237,0.08), rgba(236,72,153,0.05))' }} />
      </div>

      {/* Orbs */}
      <div style={{ position: 'absolute', top: '5%', right: '10%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(124,58,237,0.12), transparent)', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '5%', left: '10%', width: 350, height: 350, background: 'radial-gradient(circle, rgba(236,72,153,0.1), transparent)', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none' }} />

      

      {/* Main container */}
      
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{
          position: 'relative', zIndex: 1,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 0,
          width: '100%',
          maxWidth: 900,
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 28,
          backdropFilter: 'blur(20px)',
          overflow: 'hidden'
        }}
      >

        {/* Left panel */}
        
        <div style={{
          padding: '48px 40px',
          background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(79,70,229,0.1))',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 24
        }}>
          <button onClick={() => navigate('/')}
  style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 13, fontWeight: 500, marginBottom: 24, padding: 0 }}
  onMouseEnter={e => e.currentTarget.style.color = '#fff'}
  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}>
  <ArrowLeft size={14} /> Back to home
</button>
          <div>
            <div style={{ display: 'inline-flex', padding: 12, borderRadius: 16, background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', marginBottom: 20, boxShadow: '0 0 30px rgba(124,58,237,0.4)' }}>
              <Zap size={24} color="#fff" />
            </div>
            <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 8, letterSpacing: '-0.5px' }}>
              Start for free.<br />
              <span style={{ background: 'linear-gradient(135deg, #a78bfa, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Land your dream job.
              </span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, lineHeight: 1.7 }}>
              Join thousands of developers who used AceIt to prepare smarter and interview better.
            </p>
          </div>

          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {perks.map((perk, i) => (
              <motion.li key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>
                <CheckCircle size={16} style={{ color: '#a78bfa', flexShrink: 0, marginTop: 1 }} />
                {perk}
              </motion.li>
            ))}
          </ul>

          <div style={{ padding: '20px', background: 'rgba(255,255,255,0.04)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.07)' }}>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', fontStyle: 'italic', marginBottom: 10, lineHeight: 1.6 }}>
              "AceIt helped me go from 0 callbacks to 3 offers in 6 weeks. The AI interview feedback is insane."
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #ec4899)' }} />
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>Sarah K.</p>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>Frontend Developer @ Google</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right panel - Form */}
        <div style={{ padding: '48px 40px' }}>
          <h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 6, letterSpacing: '-0.5px' }}>Create your account</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginBottom: 32 }}>Free forever. No credit card required.</p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Name */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                <input
                  type="text"
                  placeholder="Abdallah Khatib"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required
                  style={{
                    width: '100%', padding: '13px 14px 13px 42px',
                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 12, color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box'
                  }}
                  onFocus={e => e.target.style.borderColor = 'rgba(124,58,237,0.6)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  required
                  style={{
                    width: '100%', padding: '13px 14px 13px 42px',
                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 12, color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box'
                  }}
                  onFocus={e => e.target.style.borderColor = 'rgba(124,58,237,0.6)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                  style={{
                    width: '100%', padding: '13px 42px 13px 42px',
                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 12, color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box'
                  }}
                  onFocus={e => e.target.style.borderColor = 'rgba(124,58,237,0.6)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', padding: 0 }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                marginTop: 8, width: '100%', padding: '14px',
                background: loading ? 'rgba(124,58,237,0.5)' : 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                border: 'none', borderRadius: 12, color: '#fff', fontSize: 15, fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                boxShadow: '0 0 30px rgba(124,58,237,0.3)'
              }}
            >
              {loading ? 'Creating account...' : <> Create Account <ArrowRight size={16} /> </>}
            </motion.button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#a78bfa', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
          </p>
        </div>
        
      </motion.div>
    </div>
  );
}