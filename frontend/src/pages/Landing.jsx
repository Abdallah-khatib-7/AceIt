import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Brain, FileText,  Zap,  CheckCircle, ChevronDown, Star } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const faqs = [
  { q: 'How does the AI interview work?', a: 'You choose your major, job title, and experience level. Our AI generates tailored questions one by one, scores each of your answers, and gives you honest feedback plus a better answer suggestion.' },
  { q: 'Is the CV review actually useful?', a: 'Yes. We extract your CV text, run it through our AI which acts as an ATS system, and give you a score out of 100 plus specific improvements — formatting, missing keywords, content gaps.' },
  { q: 'What happens after my free trial?', a: 'You keep your free account with limited usage. Upgrade to Basic or Pro anytime to unlock more sessions, quizzes, and PDF reports.' },
  { q: 'Will the AI repeat questions?', a: 'Never. We track every question asked in your session and pass them all to the AI so it always generates something new.' },
  { q: 'Is my data secure?', a: 'Your CVs are stored encrypted on AWS S3. We never share your data with third parties. You can delete your account anytime.' },
];

const testimonials = [
  { name: 'Ahmad R.', role: 'Frontend Dev @ Meta', text: 'AceIt helped me prep for 3 rounds of interviews. The AI feedback was brutally honest — exactly what I needed.', rating: 5, img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80' },
  { name: 'Sara M.', role: 'Full Stack @ Shopify', text: 'I went from zero callbacks to 4 offers in 5 weeks. The CV scorer alone is worth it.', rating: 5, img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80' },
  { name: 'Karim L.', role: 'Backend Dev @ Stripe', text: 'The quizzes are no joke. They actually exposed gaps I didn\'t know I had.', rating: 5, img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80' },
  { name: 'Lina T.', role: 'DevOps @ AWS', text: 'Best interview prep tool I\'ve used. The roadmap feature is a game changer.', rating: 5, img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80' },
];

const features = [
  {
    badge: 'CV Analysis',
    title: 'Know exactly what recruiters see',
    desc: 'Upload your CV and get an honest ATS score out of 100. We tell you what\'s missing, what to fix, and how to make it impossible to ignore.',
    points: ['ATS score out of 100', 'Keyword gap analysis', 'Formatting & content score'],
    gradient: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
    icon: <FileText size={20} />,
    image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&q=80',
    mockup: (
      <div style={{ position: 'relative', borderRadius: 20, overflow: 'hidden' }}>
        <img src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&q=80" alt="CV Analysis" loading="lazy"
          style={{ width: '100%', height: 220, objectFit: 'cover', opacity: 0.15, borderRadius: 20 }} />
        <div style={{ position: 'absolute', inset: 0, padding: 24, display: 'flex', flexDirection: 'column', gap: 16, background: 'rgba(10,10,10,0.6)', borderRadius: 20, border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>ATS Score</span>
            <span style={{ fontSize: 28, fontWeight: 900, background: 'linear-gradient(135deg, #a78bfa, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>82/100</span>
          </div>
          {[{ label: 'Formatting', score: 90, color: '#10b981' }, { label: 'Keywords', score: 72, color: '#a78bfa' }, { label: 'Content', score: 85, color: '#f59e0b' }].map((item, i) => (
            <div key={i}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>
                <span>{item.label}</span><span>{item.score}%</span>
              </div>
              <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 10 }}>
                <div style={{ height: '100%', width: `${item.score}%`, background: item.color, borderRadius: 10 }} />
              </div>
            </div>
          ))}
          <div style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 12, padding: '12px 14px' }}>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', margin: 0 }}>💡 Add keywords: <span style={{ color: '#a78bfa' }}>Docker, CI/CD, TypeScript</span></p>
          </div>
        </div>
      </div>
    )
  },
  {
    badge: 'AI Interview',
    title: 'Practice like it\'s the real thing',
    desc: 'Our AI interviewer adapts to your role, experience level, and never repeats a question. Get scored on every answer with a better response suggestion.',
    points: ['7 tailored questions per session', 'Score out of 10 per answer', 'Ideal answer revealed after each'],
    gradient: 'linear-gradient(135deg, #ec4899, #7c3aed)',
    icon: <Brain size={20} />,
    mockup: (
      <div style={{ position: 'relative', borderRadius: 20, overflow: 'hidden' }}>
        <img src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80" alt="AI Interview" loading="lazy"
          style={{ width: '100%', height: 260, objectFit: 'cover', opacity: 0.12, borderRadius: 20 }} />
        <div style={{ position: 'absolute', inset: 0, padding: 24, display: 'flex', flexDirection: 'column', gap: 12, background: 'rgba(10,10,10,0.6)', borderRadius: 20, border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.15)', borderRadius: 14, padding: '14px 16px' }}>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>AI Interviewer</p>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', margin: 0, lineHeight: 1.5 }}>Explain the difference between REST and GraphQL and when you'd use each.</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 14, padding: '14px 16px', marginLeft: 20 }}>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>Your answer</p>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', margin: 0, lineHeight: 1.5 }}>REST uses fixed endpoints while GraphQL lets clients request exactly what they need...</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 12, padding: '10px 14px' }}>
            <span style={{ fontSize: 20, fontWeight: 900, color: '#10b981' }}>8</span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>/10 — Good answer! Mention caching trade-offs next time.</span>
          </div>
        </div>
      </div>
    )
  },
  {
    badge: 'Skill Quizzes',
    title: 'Find your blind spots before they do',
    desc: 'Take AI-generated multiple choice quizzes tailored to your exact tech stack. Know what you know — and what you definitely need to review.',
    points: ['Up to 20 questions per quiz', 'Instant correct/wrong feedback', 'Added to your roadmap automatically'],
    gradient: 'linear-gradient(135deg, #f97316, #ec4899)',
    icon: <Zap size={20} />,
    mockup: (
      <div style={{ position: 'relative', borderRadius: 20, overflow: 'hidden' }}>
        <img src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80" alt="Quizzes" loading="lazy"
          style={{ width: '100%', height: 260, objectFit: 'cover', opacity: 0.12, borderRadius: 20 }} />
        <div style={{ position: 'absolute', inset: 0, padding: 24, display: 'flex', flexDirection: 'column', gap: 12, background: 'rgba(10,10,10,0.6)', borderRadius: 20, border: '1px solid rgba(255,255,255,0.08)' }}>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', margin: 0, lineHeight: 1.5, fontWeight: 600 }}>What does the SQL JOIN clause do?</p>
          {['Deletes duplicate rows', 'Combines rows from two tables', 'Creates a new table', 'Filters NULL values'].map((opt, i) => (
            <div key={i} style={{
              padding: '10px 14px', borderRadius: 10, fontSize: 13, cursor: 'pointer',
              background: i === 1 ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${i === 1 ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.07)'}`,
              color: i === 1 ? '#10b981' : 'rgba(255,255,255,0.6)',
              display: 'flex', alignItems: 'center', gap: 8
            }}>
              {i === 1 && <CheckCircle size={14} />} {opt}
            </div>
          ))}
        </div>
      </div>
    )
  }
];

const plans = [
  {
    name: 'Free', price: '$0', period: 'forever',
    features: ['1 CV Review', '1 AI Interview', '3 Quizzes', 'Basic Reports'],
    cta: 'Get Started', highlight: false,
  },
  {
    name: 'Basic', price: '$9.99', period: 'per month',
    features: ['5 CV Reviews', '5 AI Interviews', '20 Quizzes', 'Full Reports', 'Roadmap Access'],
    cta: 'Start Basic', highlight: false,
  },
  {
    name: 'Pro', price: '$19.99', period: 'per month',
    features: ['Unlimited CV Reviews', 'Unlimited Interviews', 'Unlimited Quizzes', 'PDF Reports', 'Priority Support', 'Early Access'],
    cta: 'Go Pro', highlight: true,
  }
];

export default function Landing() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', color: '#fff', overflowX: 'hidden', fontFamily: 'Inter, sans-serif' }}>

      {/* Navbar */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 64px',
        background: 'rgba(10,10,10,0.85)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)'
      }}>
        <span style={{ fontSize: 22, fontWeight: 900, background: 'linear-gradient(135deg, #a78bfa, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AceIt</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => navigate('/login')} style={{ padding: '10px 20px', background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: 14, fontWeight: 500 }}>Login</button>
          <button onClick={() => navigate('/register')} style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', border: 'none', borderRadius: 10, color: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>Get Started</button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '140px 24px 80px', position: 'relative', textAlign: 'center', overflow: 'hidden' }}>
        {/* Hero background image */}
        <div style={{ position: 'absolute', inset: 0 }}>
          <img src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1920&q=80" alt="" loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.06 }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(10,10,10,0.4), rgba(10,10,10,0.7), #0a0a0a)' }} />
        </div>
        <div style={{ position: 'absolute', top: '20%', left: '15%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(124,58,237,0.14), transparent)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '20%', right: '15%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(236,72,153,0.08), transparent)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />

        <motion.div variants={fadeUp} initial="hidden" animate="visible" style={{ position: 'relative', zIndex: 1, maxWidth: 820, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 18px', borderRadius: 100, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 32, fontWeight: 500 }}>
            <Zap size={13} style={{ color: '#a78bfa' }} /> AI-Powered Interview Coaching
          </div>

          <h1 style={{ fontSize: 'clamp(52px, 9vw, 96px)', fontWeight: 900, lineHeight: 1.02, letterSpacing: '-3px', marginBottom: 24 }}>
            Ace Every<br />
            <span style={{ background: 'linear-gradient(135deg, #a78bfa 0%, #ec4899 50%, #818cf8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Interview
            </span>{' '}You Walk Into
          </h1>

          <p style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: 'rgba(255,255,255,0.5)', maxWidth: 560, margin: '0 auto 48px', lineHeight: 1.7 }}>
            CV scoring, AI interviews, skill quizzes, and a personal roadmap — everything you need to land the job.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => navigate('/register')}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '16px 36px', background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', border: 'none', borderRadius: 14, color: '#fff', fontSize: 16, fontWeight: 700, cursor: 'pointer', boxShadow: '0 8px 40px rgba(124,58,237,0.35)' }}>
              Start for Free <ArrowRight size={18} />
            </motion.button>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => navigate('/login')}
              style={{ padding: '16px 36px', background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 14, color: 'rgba(255,255,255,0.8)', fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>
              Sign In
            </motion.button>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 48, marginTop: 72, flexWrap: 'wrap' }}>
            {[{ n: '10K+', l: 'Users' }, { n: '95%', l: 'Success Rate' }, { n: '50K+', l: 'Interviews Done' }].map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 30, fontWeight: 900, background: 'linear-gradient(135deg, #a78bfa, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.n}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Features — alternating */}
      <section style={{ padding: '80px 64px', maxWidth: 1200, margin: '0 auto' }}>
        {features.map((feature, i) => (
          <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
            style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 80, alignItems: 'center',
              marginBottom: i < features.length - 1 ? 120 : 0,
              direction: i % 2 === 1 ? 'rtl' : 'ltr'
            }}>
            <div style={{ direction: 'ltr' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 100, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 20, fontWeight: 600 }}>
                <span style={{ display: 'inline-flex', padding: 4, borderRadius: 6, background: feature.gradient, color: '#fff' }}>{feature.icon}</span>
                {feature.badge}
              </div>
              <h2 style={{ fontSize: 'clamp(26px, 3vw, 40px)', fontWeight: 900, lineHeight: 1.15, marginBottom: 16, letterSpacing: '-1px' }}>{feature.title}</h2>
              <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, marginBottom: 24 }}>{feature.desc}</p>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {feature.points.map((p, j) => (
                  <li key={j} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'rgba(255,255,255,0.65)' }}>
                    <CheckCircle size={15} style={{ color: '#a78bfa', flexShrink: 0 }} /> {p}
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ direction: 'ltr' }}>{feature.mockup}</div>
          </motion.div>
        ))}
      </section>

      {/* Testimonials */}
      <section style={{ padding: '120px 64px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=80" alt="" loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.04 }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, #0a0a0a, rgba(10,10,10,0.7), #0a0a0a)' }} />
        </div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 16px', borderRadius: 100, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 20, fontWeight: 600 }}>Testimonials</div>
            <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 900, letterSpacing: '-1px' }}>
              Don't be the only candidate<br />
              <span style={{ background: 'linear-gradient(135deg, #a78bfa, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>who didn't prepare</span>
            </h2>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20, maxWidth: 1200, margin: '0 auto' }}>
            {testimonials.map((t, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                style={{ padding: 24, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18 }}>
                <div style={{ display: 'flex', gap: 2, marginBottom: 14 }}>
                  {[...Array(t.rating)].map((_, j) => <Star key={j} size={14} style={{ color: '#f59e0b', fill: '#f59e0b' }} />)}
                </div>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, marginBottom: 20 }}>"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <img src={t.img} alt={t.name} loading="lazy"
                    style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(167,139,250,0.3)' }} />
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, margin: 0 }}>{t.name}</p>
                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', margin: 0 }}>{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section style={{ padding: '120px 64px', maxWidth: 1100, margin: '0 auto' }}>
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 64 }}>
          <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 900, letterSpacing: '-1px', marginBottom: 12 }}>
            How much is your<br />
            <span style={{ background: 'linear-gradient(135deg, #a78bfa, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>dream job worth?</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 16 }}>Start free. Upgrade when you're ready.</p>
        </motion.div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {plans.map((plan, i) => (
            <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              style={{
                padding: 36, borderRadius: 24, position: 'relative',
                background: plan.highlight ? 'linear-gradient(135deg, #7c3aed, #4f46e5)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${plan.highlight ? 'rgba(167,139,250,0.4)' : 'rgba(255,255,255,0.08)'}`,
                boxShadow: plan.highlight ? '0 20px 60px rgba(124,58,237,0.3)' : 'none'
              }}>
              {plan.highlight && (
                <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', padding: '5px 18px', background: '#fff', borderRadius: 100, fontSize: 11, fontWeight: 800, color: '#7c3aed', whiteSpace: 'nowrap' }}>
                  MOST POPULAR
                </div>
              )}
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{plan.name}</h3>
              <div style={{ fontSize: 44, fontWeight: 900, lineHeight: 1, marginBottom: 4 }}>{plan.price}</div>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginBottom: 28 }}>{plan.period}</p>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: 28, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {plan.features.map((f, j) => (
                  <li key={j} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: plan.highlight ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.65)' }}>
                    <CheckCircle size={15} style={{ color: plan.highlight ? '#fff' : '#a78bfa', flexShrink: 0 }} /> {f}
                  </li>
                ))}
              </ul>
              <button onClick={() => navigate('/register')}
                style={{ width: '100%', padding: '13px 0', borderRadius: 12, border: 'none', background: plan.highlight ? '#fff' : 'rgba(255,255,255,0.08)', color: plan.highlight ? '#7c3aed' : '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '80px 64px', maxWidth: 800, margin: '0 auto' }}>
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900, letterSpacing: '-1px' }}>Frequently asked</h2>
        </motion.div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {faqs.map((faq, i) => (
            <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px 0', background: 'none', border: 'none', color: '#fff', fontSize: 16, fontWeight: 600, cursor: 'pointer', textAlign: 'left', gap: 16 }}>
                {faq.q}
                <motion.div animate={{ rotate: openFaq === i ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown size={18} style={{ color: 'rgba(255,255,255,0.4)', flexShrink: 0 }} />
                </motion.div>
              </button>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
                    style={{ overflow: 'hidden' }}>
                    <p style={{ paddingBottom: 22, color: 'rgba(255,255,255,0.5)', fontSize: 14, lineHeight: 1.8, margin: 0 }}>{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section style={{ position: 'relative', overflow: 'hidden' }}>
        <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80" alt="" loading="lazy"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.15 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(124,58,237,0.92), rgba(79,70,229,0.95))' }} />
        <div style={{ position: 'relative', zIndex: 1, padding: '120px 64px', textAlign: 'center' }}>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 style={{ fontSize: 'clamp(40px, 7vw, 80px)', fontWeight: 900, marginBottom: 24, letterSpacing: '-2px' }}>
              Get the job of<br />your dreams
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 18, marginBottom: 48 }}>Start free. No credit card required.</p>
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={() => navigate('/register')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '18px 48px', background: '#fff', border: 'none', borderRadius: 100, color: '#7c3aed', fontSize: 18, fontWeight: 800, cursor: 'pointer' }}>
              Start for Free <ArrowRight size={20} />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '28px 64px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <span style={{ background: 'linear-gradient(135deg, #a78bfa, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 900, fontSize: 18 }}>AceIt</span>
        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>© 2026 AceIt. Built by Abdallah Khatib 🇱🇧</span>
      </footer>

    </div>
  );
}