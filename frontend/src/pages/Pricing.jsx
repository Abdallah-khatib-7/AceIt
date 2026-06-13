import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import {
  ArrowLeft, CheckCircle, CreditCard, Lock, Zap, X
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08, ease: 'easeOut' } })
};

const plans = [
  {
    id: 'basic',
    name: 'Basic',
    price: 9.99,
    period: 'per month',
    color: '#a78bfa',
    gradient: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
    features: [
      '5 CV Reviews per month',
      '5 AI Interview sessions',
      '20 Skill Quizzes',
      'Full Reports & Analytics',
      'Roadmap Access',
      'Email Support',
    ],
    notIncluded: ['PDF Report Export', 'Priority Support', 'Early Access Features']
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 19.99,
    period: 'per month',
    color: '#f472b6',
    gradient: 'linear-gradient(135deg, #ec4899, #7c3aed)',
    popular: true,
    features: [
      'Unlimited CV Reviews',
      'Unlimited AI Interviews',
      'Unlimited Skill Quizzes',
      'Full Reports & Analytics',
      'PDF Report Export',
      'Roadmap Access',
      'Priority Support',
      'Early Access Features',
    ],
    notIncluded: []
  }
];

const inputStyle = {
  width: '100%', padding: '12px 14px',
  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 10, color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box'
};

export default function Pricing() {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '' });
  const [step, setStep] = useState(1); // 1: card | 2: success

  const handleSelectPlan = (plan) => {
    if (user?.plan === plan.id) {
      toast.error(`You are already on the ${plan.name} plan`);
      return;
    }
    setSelectedPlan(plan);
    setShowModal(true);
    setStep(1);
    setCard({ number: '', name: '', expiry: '', cvv: '' });
  };

  const formatCardNumber = (val) => {
    return val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiry = (val) => {
    const clean = val.replace(/\D/g, '').slice(0, 4);
    if (clean.length >= 2) return `${clean.slice(0, 2)}/${clean.slice(2)}`;
    return clean;
  };

  const handlePay = async () => {
    if (!card.number || !card.name || !card.expiry || !card.cvv) {
      toast.error('Please fill in all card details');
      return;
    }
    if (card.number.replace(/\s/g, '').length < 16) {
      toast.error('Invalid card number');
      return;
    }
    setLoading(true);
    try {
      // Mock payment processing delay
      await new Promise(res => setTimeout(res, 2000));

      // Upgrade the plan
      await api.post('/subscription/upgrade', {
        plan: selectedPlan.id,
        payment_ref: `CARD-${Date.now()}`
      });

      // Refresh user
      const res = await api.get('/auth/me');
      login(res.data.user, localStorage.getItem('token'));

      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedPlan(null);
    setStep(1);
    if (step === 2) navigate('/dashboard');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', color: '#fff', fontFamily: 'Inter, sans-serif' }}>

      {/* Navbar */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, display: 'flex', alignItems: 'center', padding: '0 48px', height: 64, background: 'rgba(10,10,10,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <button onClick={() => navigate('/dashboard')}
          style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: 14, fontWeight: 500, padding: '8px 0', marginRight: 24 }}
          onMouseEnter={e => e.currentTarget.style.color = '#fff'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}>
          <ArrowLeft size={16} /> Dashboard
        </button>
        <span style={{ fontSize: 18, fontWeight: 900, background: 'linear-gradient(135deg, #a78bfa, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Pricing</span>
      </nav>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '64px 48px' }}>

        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0} style={{ textAlign: 'center', marginBottom: 64 }}>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 900, letterSpacing: '-1px', marginBottom: 14 }}>
            How much is your<br />
            <span style={{ background: 'linear-gradient(135deg, #a78bfa, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>dream job worth?</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 16 }}>Start free. Upgrade when you're ready. Cancel anytime.</p>

          {/* Current plan badge */}
          {user?.plan && (
            <div style={{ marginTop: 16, display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 20px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 100, fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>
              You are currently on the <span style={{ fontWeight: 700, color: '#a78bfa' }}>{user.plan.charAt(0).toUpperCase() + user.plan.slice(1)} plan</span>
            </div>
          )}
        </motion.div>

        {/* Plans */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginBottom: 64 }}>

          {/* Free plan */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.1}
            style={{ padding: '32px', borderRadius: 24, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Free</h3>
            <div style={{ fontSize: 44, fontWeight: 900, lineHeight: 1, marginBottom: 4 }}>$0</div>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginBottom: 28 }}>forever</p>
            <ul style={{ listStyle: 'none', padding: 0, marginBottom: 28, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {['1 CV Review', '1 AI Interview', '3 Quizzes', 'Basic Reports'].map((f, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>
                  <CheckCircle size={14} style={{ color: '#a78bfa', flexShrink: 0 }} /> {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => user?.plan === 'free' ? null : navigate('/dashboard')}
              style={{ width: '100%', padding: '13px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: user?.plan === 'free' ? 'rgba(255,255,255,0.3)' : '#fff', fontSize: 14, fontWeight: 600, cursor: user?.plan === 'free' ? 'default' : 'pointer' }}>
              {user?.plan === 'free' ? 'Current Plan' : 'Downgrade to Free'}
            </button>
          </motion.div>

          {/* Paid plans */}
          {plans.map((plan, i) => (
            <motion.div key={plan.id} variants={fadeUp} initial="hidden" animate="visible" custom={(i + 2) * 0.1}
              whileHover={{ y: -4 }}
              style={{
                padding: '32px', borderRadius: 24, position: 'relative',
                background: plan.popular ? plan.gradient : 'rgba(255,255,255,0.03)',
                border: `1px solid ${plan.popular ? 'rgba(167,139,250,0.4)' : 'rgba(255,255,255,0.08)'}`,
                boxShadow: plan.popular ? '0 20px 60px rgba(124,58,237,0.25)' : 'none',
                transition: 'transform 0.3s'
              }}>
              {plan.popular && (
                <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', padding: '5px 18px', background: '#fff', borderRadius: 100, fontSize: 11, fontWeight: 800, color: '#7c3aed', whiteSpace: 'nowrap' }}>
                  MOST POPULAR
                </div>
              )}
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{plan.name}</h3>
              <div style={{ fontSize: 44, fontWeight: 900, lineHeight: 1, marginBottom: 4 }}>${plan.price}</div>
              <p style={{ color: plan.popular ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.4)', fontSize: 13, marginBottom: 28 }}>{plan.period}</p>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: 28, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {plan.features.map((f, j) => (
                  <li key={j} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: plan.popular ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.65)' }}>
                    <CheckCircle size={14} style={{ color: plan.popular ? '#fff' : '#a78bfa', flexShrink: 0 }} /> {f}
                  </li>
                ))}
                {plan.notIncluded.map((f, j) => (
                  <li key={j} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'rgba(255,255,255,0.25)', textDecoration: 'line-through' }}>
                    <X size={14} style={{ flexShrink: 0 }} /> {f}
                  </li>
                ))}
              </ul>
              <button onClick={() => handleSelectPlan(plan)}
                style={{
                  width: '100%', padding: '13px', borderRadius: 12, border: 'none',
                  background: plan.popular ? '#fff' : 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                  color: plan.popular ? '#7c3aed' : '#fff',
                  fontSize: 14, fontWeight: 700, cursor: user?.plan === plan.id ? 'default' : 'pointer',
                  opacity: user?.plan === plan.id ? 0.5 : 1
                }}>
                {user?.plan === plan.id ? 'Current Plan' : `Upgrade to ${plan.name}`}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Trust badges */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.5}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32, flexWrap: 'wrap' }}>
          {[
            { icon: <Lock size={14} />, text: 'Secure Payment' },
            { icon: <Zap size={14} />, text: 'Instant Access' },
            { icon: <CheckCircle size={14} />, text: 'Cancel Anytime' },
          ].map((badge, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.35)', fontSize: 13 }}>
              {badge.icon} {badge.text}
            </div>
          ))}
        </motion.div>
      </div>

      {/* Payment Modal */}
      <AnimatePresence>
        {showModal && selectedPlan && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
            onClick={e => { if (e.target === e.currentTarget) handleClose(); }}>

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              style={{ width: '100%', maxWidth: 440, background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24, overflow: 'hidden' }}>

              {step === 1 && (
                <>
                  {/* Modal header */}
                  <div style={{ padding: '24px 28px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <p style={{ fontSize: 16, fontWeight: 800, margin: 0 }}>Upgrade to {selectedPlan.name}</p>
                      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: 0 }}>${selectedPlan.price}/month · Cancel anytime</p>
                    </div>
                    <button onClick={handleClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: 4 }}>
                      <X size={18} />
                    </button>
                  </div>

                  {/* Card form */}
                  <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 16 }}>

                    {/* Card visual */}
                    <div style={{ padding: '20px 22px', background: selectedPlan.gradient, borderRadius: 16, marginBottom: 8, position: 'relative', overflow: 'hidden' }}>
                      <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, background: 'rgba(255,255,255,0.08)', borderRadius: '50%' }} />
                      <div style={{ position: 'absolute', bottom: -30, right: 20, width: 80, height: 80, background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
                      <CreditCard size={24} style={{ marginBottom: 16, opacity: 0.8 }} />
                      <p style={{ fontSize: 16, fontWeight: 700, letterSpacing: 2, margin: '0 0 8px', fontFamily: 'monospace' }}>
                        {card.number || '•••• •••• •••• ••••'}
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 12, opacity: 0.7 }}>{card.name || 'YOUR NAME'}</span>
                        <span style={{ fontSize: 12, opacity: 0.7 }}>{card.expiry || 'MM/YY'}</span>
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>Card Number</label>
                      <input
                        placeholder="1234 5678 9012 3456"
                        value={card.number}
                        onChange={e => setCard({ ...card, number: formatCardNumber(e.target.value) })}
                        style={inputStyle}
                        onFocus={e => e.target.style.borderColor = 'rgba(124,58,237,0.6)'}
                        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>Cardholder Name</label>
                      <input
                        placeholder="Abdallah Khatib"
                        value={card.name}
                        onChange={e => setCard({ ...card, name: e.target.value })}
                        style={inputStyle}
                        onFocus={e => e.target.style.borderColor = 'rgba(124,58,237,0.6)'}
                        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <div>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>Expiry Date</label>
                        <input
                          placeholder="MM/YY"
                          value={card.expiry}
                          onChange={e => setCard({ ...card, expiry: formatExpiry(e.target.value) })}
                          style={inputStyle}
                          onFocus={e => e.target.style.borderColor = 'rgba(124,58,237,0.6)'}
                          onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>CVV</label>
                        <input
                          placeholder="123"
                          value={card.cvv}
                          onChange={e => setCard({ ...card, cvv: e.target.value.replace(/\D/g, '').slice(0, 3) })}
                          style={inputStyle}
                          onFocus={e => e.target.style.borderColor = 'rgba(124,58,237,0.6)'}
                          onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                        />
                      </div>
                    </div>

                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      onClick={handlePay} disabled={loading}
                      style={{
                        width: '100%', padding: '14px', background: loading ? 'rgba(124,58,237,0.5)' : selectedPlan.gradient,
                        border: 'none', borderRadius: 12, color: '#fff', fontSize: 15, fontWeight: 700,
                        cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        marginTop: 4
                      }}>
                      {loading ? (
                        <>
                          <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                          Processing payment...
                        </>
                      ) : (
                        <><Lock size={15} /> Pay ${selectedPlan.price}/month</>
                      )}
                    </motion.button>

                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
                      <Lock size={11} /> Secured payment · Cancel anytime
                    </div>
                  </div>
                </>
              )}

              {step === 2 && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  style={{ padding: '48px 32px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                  <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                    style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, #10b981, #0ea5e9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle size={36} color="#fff" />
                  </motion.div>
                  <h2 style={{ fontSize: 22, fontWeight: 900, margin: 0 }}>Payment Successful!</h2>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, margin: 0 }}>
                    Welcome to the {selectedPlan.name} plan. Your account has been upgraded.
                  </p>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={handleClose}
                    style={{ marginTop: 8, padding: '12px 32px', background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', border: 'none', borderRadius: 12, color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                    Go to Dashboard
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}