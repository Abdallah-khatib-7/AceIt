import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Brain, FileText, Trophy, BarChart3, Zap, Shield, CheckCircle } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: 'easeOut' }
  })
};

const features = [
  {
    icon: <FileText size={24} />,
    title: 'CV Analysis',
    description: 'Upload your CV and get an honest ATS score with actionable feedback to stand out from the crowd.',
    gradient: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
    image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&q=80'
  },
  {
    icon: <Brain size={24} />,
    title: 'AI Interview',
    description: 'Practice with a real AI interviewer that adapts to your role and experience. Never repeats questions.',
    gradient: 'linear-gradient(135deg, #ec4899, #7c3aed)',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&q=80'
  },
  {
    icon: <Zap size={24} />,
    title: 'Skill Quizzes',
    description: 'Test your knowledge with AI-generated quizzes tailored to your exact tech stack and job position.',
    gradient: 'linear-gradient(135deg, #f97316, #ec4899)',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&q=80'
  },
  {
    icon: <BarChart3 size={24} />,
    title: 'Reports',
    description: 'Track your progress over time with detailed performance reports and insights across all features.',
    gradient: 'linear-gradient(135deg, #10b981, #0ea5e9)',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80'
  },
  {
    icon: <Trophy size={24} />,
    title: 'Roadmap',
    description: 'Get a personalized improvement roadmap based on your scores, weak areas, and career goals.',
    gradient: 'linear-gradient(135deg, #f59e0b, #f97316)',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80'
  },
  {
    icon: <Shield size={24} />,
    title: 'Secure & Private',
    description: 'Your data is encrypted and stored securely on AWS. We never share your personal information.',
    gradient: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&q=80'
  }
];

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    features: ['1 CV Review', '1 AI Interview', '3 Quizzes', 'Basic Reports'],
    cta: 'Get Started',
    popular: false,
    bg: 'rgba(255,255,255,0.03)',
    border: 'rgba(255,255,255,0.1)',
    ctaBg: 'rgba(255,255,255,0.1)',
    ctaColor: '#fff'
  },
  {
    name: 'Basic',
    price: '$9.99',
    period: 'per month',
    features: ['5 CV Reviews', '5 AI Interviews', '20 Quizzes', 'Full Reports', 'Roadmap Access'],
    cta: 'Start Basic',
    popular: false,
    bg: 'rgba(124,58,237,0.1)',
    border: 'rgba(124,58,237,0.4)',
    ctaBg: 'rgba(124,58,237,0.3)',
    ctaColor: '#fff'
  },
  {
    name: 'Pro',
    price: '$19.99',
    period: 'per month',
    features: ['Unlimited CV Reviews', 'Unlimited Interviews', 'Unlimited Quizzes', 'PDF Reports', 'Priority Support', 'Early Access Features'],
    cta: 'Go Pro',
    popular: true,
    bg: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
    border: 'rgba(167,139,250,0.5)',
    ctaBg: '#fff',
    ctaColor: '#7c3aed'
  }
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', color: '#fff', overflowX: 'hidden', fontFamily: 'Inter, sans-serif' }}>

      {/* Navbar */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 64px',
        background: 'rgba(10,10,10,0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)'
      }}>
        <span style={{ fontSize: 22, fontWeight: 900, background: 'linear-gradient(135deg, #a78bfa, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          AceIt
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => navigate('/login')} style={{ padding: '10px 20px', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10, color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: 14, fontWeight: 500, transition: 'all 0.2s' }}
            onMouseEnter={e => e.target.style.borderColor = 'rgba(255,255,255,0.4)'}
            onMouseLeave={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
          >
            Login
          </button>
          <button onClick={() => navigate('/register')} style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', border: 'none', borderRadius: 10, color: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 24px 80px' }}>
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
          <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920&q=80" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.08 }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(10,10,10,0.3), rgba(10,10,10,0.7), #0a0a0a)' }} />
        </div>
        <div style={{ position: 'absolute', top: '20%', left: '10%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(124,58,237,0.15), transparent)', borderRadius: '50%', filter: 'blur(40px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '20%', right: '10%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(236,72,153,0.12), transparent)', borderRadius: '50%', filter: 'blur(40px)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 900, margin: '0 auto' }}>
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 20px', borderRadius: 100, background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.3)', color: '#a78bfa', fontSize: 13, fontWeight: 600, marginBottom: 32 }}>
            <Zap size={14} /> AI-Powered Interview Coaching
          </motion.div>

          <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={1}
            style={{ fontSize: 'clamp(48px, 8vw, 88px)', fontWeight: 900, lineHeight: 1.05, marginBottom: 24, letterSpacing: '-2px' }}>
            Ace Every{' '}
            <span style={{ background: 'linear-gradient(135deg, #a78bfa, #ec4899, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Interview
            </span>
            <br />You Walk Into
          </motion.h1>

          <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2}
            style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: 'rgba(255,255,255,0.55)', maxWidth: 600, margin: '0 auto 48px', lineHeight: 1.7 }}>
            Practice with AI, get your CV scored, crush skill quizzes, and walk into every interview with total confidence.
          </motion.p>

          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/register')}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '16px 36px', background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', border: 'none', borderRadius: 14, color: '#fff', fontSize: 16, fontWeight: 700, cursor: 'pointer', boxShadow: '0 0 40px rgba(124,58,237,0.4)' }}>
              Start for Free <ArrowRight size={18} />
            </button>
            <button onClick={() => navigate('/login')}
              style={{ padding: '16px 36px', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 14, color: '#fff', fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>
              Sign In
            </button>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '120px 64px', maxWidth: 1280, margin: '0 auto' }}>
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: 80 }}>
          <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 900, marginBottom: 16, letterSpacing: '-1px' }}>
            Everything you need to{' '}
            <span style={{ background: 'linear-gradient(135deg, #a78bfa, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              land the job
            </span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 18, maxWidth: 500, margin: '0 auto' }}>
            One platform. Every tool you need to prepare, practice, and perform.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 24 }}>
          {features.map((feature, i) => (
            <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i * 0.08}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              style={{ borderRadius: 20, overflow: 'hidden', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', cursor: 'default' }}>
              <div style={{ height: 180, overflow: 'hidden', position: 'relative' }}>
                <img src={feature.image} alt={feature.title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent, rgba(10,10,10,0.9))' }} />
                <div style={{ position: 'absolute', bottom: 16, left: 20, display: 'inline-flex', padding: '8px 12px', borderRadius: 10, background: feature.gradient, color: '#fff' }}>
                  {feature.icon}
                </div>
              </div>
              <div style={{ padding: '20px 24px 28px' }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{feature.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, lineHeight: 1.7 }}>{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '120px 64px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <img src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=1920&q=80" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.04 }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, #0a0a0a, transparent, #0a0a0a)' }} />
        </div>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 900, marginBottom: 80, letterSpacing: '-1px' }}>
            How{' '}
            <span style={{ background: 'linear-gradient(135deg, #a78bfa, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              AceIt
            </span>{' '}works
          </motion.h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 48 }}>
            {[
              { step: '01', title: 'Upload your CV', desc: 'Get an instant ATS score and know exactly what recruiters see when they scan your resume.', img: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&q=80' },
              { step: '02', title: 'Practice interviews', desc: 'Go through a full AI interview session tailored to your exact role, stack, and experience level.', img: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&q=80' },
              { step: '03', title: 'Track & improve', desc: 'Get your personalized roadmap and watch your scores climb with every single session.', img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80' }
            ].map((item, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i * 0.15}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                <div style={{ width: '100%', height: 200, borderRadius: 16, overflow: 'hidden', marginBottom: 8 }}>
                  <img src={item.img} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }} />
                </div>
                <span style={{ fontSize: 64, fontWeight: 900, background: 'linear-gradient(135deg, #a78bfa, #4f46e5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1 }}>
                  {item.step}
                </span>
                <h3 style={{ fontSize: 20, fontWeight: 700 }}>{item.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, lineHeight: 1.7 }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section style={{ padding: '120px 64px', maxWidth: 1280, margin: '0 auto' }}>
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: 80 }}>
          <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 900, marginBottom: 16, letterSpacing: '-1px' }}>
            Simple,{' '}
            <span style={{ background: 'linear-gradient(135deg, #a78bfa, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              transparent
            </span>{' '}pricing
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 18 }}>Start free. Upgrade when you're ready.</p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, alignItems: 'start' }}>
          {plans.map((plan, i) => (
            <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i * 0.1}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              style={{ position: 'relative', padding: 36, borderRadius: 24, background: plan.bg, border: `1px solid ${plan.border}`, transition: 'all 0.3s' }}>
              {plan.popular && (
                <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', padding: '6px 20px', background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', borderRadius: 100, fontSize: 11, fontWeight: 800, letterSpacing: 1, whiteSpace: 'nowrap' }}>
                  MOST POPULAR
                </div>
              )}
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{plan.name}</h3>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, marginBottom: 4 }}>
                <span style={{ fontSize: 48, fontWeight: 900, lineHeight: 1 }}>{plan.price}</span>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginBottom: 32 }}>{plan.period}</p>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: 32, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {plan.features.map((f, j) => (
                  <li key={j} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'rgba(255,255,255,0.75)' }}>
                    <CheckCircle size={16} style={{ color: '#a78bfa', flexShrink: 0 }} />
                    {f}
                  </li>
                ))}
              </ul>
              <button onClick={() => navigate('/register')}
                style={{ width: '100%', padding: '14px 0', borderRadius: 12, border: 'none', background: plan.ctaBg, color: plan.ctaColor, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section style={{ padding: '120px 64px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <img src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1920&q=80" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.05 }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, #0a0a0a, transparent, #0a0a0a)' }} />
        </div>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 600, height: 600, background: 'radial-gradient(circle, rgba(124,58,237,0.12), transparent)', borderRadius: '50%', filter: 'blur(40px)', pointerEvents: 'none' }} />
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          style={{ position: 'relative', zIndex: 1, maxWidth: 700, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(40px, 7vw, 72px)', fontWeight: 900, marginBottom: 24, letterSpacing: '-2px' }}>
            Ready to{' '}
            <span style={{ background: 'linear-gradient(135deg, #a78bfa, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              AceIt?
            </span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 18, marginBottom: 48, lineHeight: 1.7 }}>
            Join thousands of developers who landed their dream job with AceIt.
          </p>
          <button onClick={() => navigate('/register')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '18px 48px', background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', border: 'none', borderRadius: 16, color: '#fff', fontSize: 18, fontWeight: 700, cursor: 'pointer', boxShadow: '0 0 60px rgba(124,58,237,0.4)' }}>
            Get Started for Free <ArrowRight size={20} />
          </button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '32px 64px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <span style={{ background: 'linear-gradient(135deg, #a78bfa, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 900, fontSize: 18 }}>AceIt</span>
        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>© 2026 AceIt. Built by Abdallah Khatib 🇱🇧</span>
      </footer>

    </div>
  );
}