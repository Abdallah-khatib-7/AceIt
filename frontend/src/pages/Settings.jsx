import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import {
  User, Lock, CreditCard, 
  Bell, Trash2, ArrowLeft, Check, Eye, EyeOff
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
};

const AVATARS = [
  { id: 'rocket', icon: '🚀' },
  { id: 'brain', icon: '🧠' },
  { id: 'fire', icon: '🔥' },
  { id: 'star', icon: '⭐' },
  { id: 'lightning', icon: '⚡' },
  { id: 'target', icon: '🎯' },
  { id: 'diamond', icon: '💎' },
  { id: 'trophy', icon: '🏆' },
  { id: 'shield', icon: '🛡️' },
  { id: 'crown', icon: '👑' },
  { id: 'ninja', icon: '🥷' },
  { id: 'robot', icon: '🤖' },
];

const MAJORS = ['Computer Science', 'Software Engineering', 'Data Science', 'Cybersecurity', 'DevOps', 'UI/UX Design', 'Product Management', 'Business Analysis'];
const EXPERIENCE_LEVELS = ['junior', 'mid', 'senior'];

const tabs = [
  { id: 'profile', label: 'Profile', icon: <User size={16} /> },
  { id: 'security', label: 'Security', icon: <Lock size={16} /> },
  { id: 'plan', label: 'Plan & Billing', icon: <CreditCard size={16} /> },
  { id: 'preferences', label: 'Preferences', icon: <Bell size={16} /> },
  { id: 'danger', label: 'Danger Zone', icon: <Trash2 size={16} /> },
];

export default function Settings() {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');

  // Profile
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    avatar: user?.avatar || 'default',
  });
  const [savingProfile, setSavingProfile] = useState(false);

  // Security
  const [passwords, setPasswords] = useState({ current_password: '', new_password: '', confirm_password: '' });
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });
  const [savingPassword, setSavingPassword] = useState(false);

  // Preferences
  const [prefs, setPrefs] = useState({
    default_major: user?.default_major || '',
    default_experience: user?.default_experience || '',
    email_notifications: user?.email_notifications ?? true,
  });
  const [savingPrefs, setSavingPrefs] = useState(false);

  // Delete account
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteStep, setDeleteStep] = useState(0);
  const [deletingAccount, setDeletingAccount] = useState(false);

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      const res = await api.put('/auth/profile', { ...profile, ...prefs });
      login(res.data.user, localStorage.getItem('token'));
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSavePassword = async () => {
    if (passwords.new_password !== passwords.confirm_password) {
      toast.error('Passwords do not match');
      return;
    }
    setSavingPassword(true);
    try {
      await api.put('/auth/change-password', {
        current_password: passwords.current_password,
        new_password: passwords.new_password
      });
      toast.success('Password changed successfully');
      setPasswords({ current_password: '', new_password: '', confirm_password: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setSavingPassword(false);
    }
  };

  const handleSavePrefs = async () => {
    setSavingPrefs(true);
    try {
      const res = await api.put('/auth/profile', { name: user?.name, email: user?.email, avatar: profile.avatar, ...prefs });
      login(res.data.user, localStorage.getItem('token'));
      toast.success('Preferences saved');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save preferences');
    } finally {
      setSavingPrefs(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeletingAccount(true);
    try {
      await api.delete('/auth/delete-account', { data: { password: deletePassword } });
      toast.success('Account deleted');
      logout();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete account');
    } finally {
      setDeletingAccount(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '12px 14px',
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 10, color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box'
  };

  const labelStyle = { display: 'block', fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 8 };

  const saveButton = (onClick, loading, label = 'Save Changes') => (
    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onClick} disabled={loading}
      style={{ padding: '11px 24px', background: loading ? 'rgba(124,58,237,0.5)' : 'linear-gradient(135deg, #7c3aed, #4f46e5)', border: 'none', borderRadius: 10, color: '#fff', fontSize: 14, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer' }}>
      {loading ? 'Saving...' : label}
    </motion.button>
  );

  const planInfo = {
    free: { label: 'Free Plan', color: 'rgba(255,255,255,0.5)', bg: 'rgba(255,255,255,0.05)', limits: { cv: '1', interviews: '1', quizzes: '3' } },
    basic: { label: 'Basic Plan', color: '#a78bfa', bg: 'rgba(124,58,237,0.1)', limits: { cv: '5', interviews: '5', quizzes: '20' } },
    pro: { label: 'Pro Plan', color: '#f472b6', bg: 'rgba(236,72,153,0.1)', limits: { cv: 'Unlimited', interviews: 'Unlimited', quizzes: 'Unlimited' } },
  };

  const currentPlan = planInfo[user?.plan] || planInfo.free;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', color: '#fff', fontFamily: 'Inter, sans-serif' }}>

      {/* Navbar */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, display: 'flex', alignItems: 'center', padding: '0 48px', height: 64, background: 'rgba(10,10,10,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <button onClick={() => navigate('/dashboard')}
          style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: 14, fontWeight: 500, padding: '8px 0', marginRight: 24 }}
          onMouseEnter={e => e.currentTarget.style.color = '#fff'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}>
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
        <span style={{ fontSize: 18, fontWeight: 900, background: 'linear-gradient(135deg, #a78bfa, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Settings</span>
      </nav>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 48px', display: 'grid', gridTemplateColumns: '200px 1fr', gap: 32 }}>

        {/* Sidebar tabs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px',
                borderRadius: 10, border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: 14, fontWeight: 500,
                background: activeTab === tab.id ? 'rgba(124,58,237,0.15)' : 'transparent',
                color: activeTab === tab.id ? '#a78bfa' : 'rgba(255,255,255,0.45)',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => { if (activeTab !== tab.id) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#fff'; } }}
              onMouseLeave={e => { if (activeTab !== tab.id) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; } }}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <motion.div key={activeTab} variants={fadeUp} initial="hidden" animate="visible">

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>Profile</h2>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>Update your personal information.</p>
              </div>

              {/* Avatar picker */}
              <div>
                <label style={labelStyle}>Choose your avatar</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10 }}>
                  {AVATARS.map((av) => (
                    <button key={av.id} onClick={() => setProfile({ ...profile, avatar: av.id })}
                      style={{
                        padding: '14px', borderRadius: 12, border: `2px solid ${profile.avatar === av.id ? '#7c3aed' : 'rgba(255,255,255,0.08)'}`,
                        background: profile.avatar === av.id ? 'rgba(124,58,237,0.15)' : 'rgba(255,255,255,0.03)',
                        cursor: 'pointer', fontSize: 24, position: 'relative', transition: 'all 0.2s'
                      }}>
                      {av.icon}
                      {profile.avatar === av.id && (
                        <div style={{ position: 'absolute', top: 4, right: 4, width: 16, height: 16, borderRadius: '50%', background: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Check size={10} color="#fff" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={labelStyle}>Full Name</label>
                  <input value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} style={inputStyle}
                    onFocus={e => e.target.style.borderColor = 'rgba(124,58,237,0.6)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
                </div>
                <div>
                  <label style={labelStyle}>Email Address</label>
                  <input type="email" value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} style={inputStyle}
                    onFocus={e => e.target.style.borderColor = 'rgba(124,58,237,0.6)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {saveButton(handleSaveProfile, savingProfile)}
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>Member since {new Date(user?.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>Security</h2>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>Manage your password and account security.</p>
              </div>

              <div style={{ padding: 24, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Change Password</h3>

                {[
                  { key: 'current_password', label: 'Current Password', show: showPasswords.current, toggle: () => setShowPasswords({ ...showPasswords, current: !showPasswords.current }) },
                  { key: 'new_password', label: 'New Password', show: showPasswords.new, toggle: () => setShowPasswords({ ...showPasswords, new: !showPasswords.new }) },
                  { key: 'confirm_password', label: 'Confirm New Password', show: showPasswords.confirm, toggle: () => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm }) },
                ].map((field) => (
                  <div key={field.key}>
                    <label style={labelStyle}>{field.label}</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={field.show ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={passwords[field.key]}
                        onChange={e => setPasswords({ ...passwords, [field.key]: e.target.value })}
                        style={{ ...inputStyle, paddingRight: 42 }}
                        onFocus={e => e.target.style.borderColor = 'rgba(124,58,237,0.6)'}
                        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                      />
                      <button type="button" onClick={field.toggle}
                        style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', padding: 0 }}>
                        {field.show ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                ))}

                {saveButton(handleSavePassword, savingPassword, 'Change Password')}
              </div>
            </div>
          )}

          {/* Plan Tab */}
          {activeTab === 'plan' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>Plan & Billing</h2>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>Manage your subscription and usage.</p>
              </div>

              {/* Current plan */}
              <div style={{ padding: 24, background: currentPlan.bg, border: `1px solid ${currentPlan.color}30`, borderRadius: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                  <div>
                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>Current Plan</p>
                    <p style={{ fontSize: 22, fontWeight: 900, color: currentPlan.color, margin: 0 }}>{currentPlan.label}</p>
                  </div>
                  {user?.plan !== 'pro' && (
                    <button onClick={() => navigate('/pricing')}
                      style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', border: 'none', borderRadius: 10, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                      Upgrade
                    </button>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                  {[
                    { label: 'CV Reviews', value: currentPlan.limits.cv },
                    { label: 'Interviews', value: currentPlan.limits.interviews },
                    { label: 'Quizzes', value: currentPlan.limits.quizzes },
                  ].map((item, i) => (
                    <div key={i} style={{ padding: '14px', background: 'rgba(255,255,255,0.04)', borderRadius: 10, textAlign: 'center' }}>
                      <p style={{ fontSize: 18, fontWeight: 900, margin: '0 0 4px', color: currentPlan.color }}>{item.value}</p>
                      <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', margin: 0 }}>{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cancel subscription */}
              {user?.plan !== 'free' && (
                <div style={{ padding: 20, background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 14 }}>
                  <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Cancel Subscription</p>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 16 }}>You will be moved to the free plan immediately.</p>
                  <button onClick={async () => {
                    try {
                      await api.post('/subscription/cancel');
                      toast.success('Subscription cancelled');
                      const res = await api.get('/auth/me');
                      login(res.data.user, localStorage.getItem('token'));
                    } catch (err) {
                      toast.error(err.response?.data?.message || 'Failed to cancel subscription');
                    }
                  }}
                    style={{ padding: '10px 20px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, color: '#ef4444', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                    Cancel Subscription
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>Preferences</h2>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>Set your defaults to save time on every session.</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={labelStyle}>Default Major / Field</label>
                  <select value={prefs.default_major} onChange={e => setPrefs({ ...prefs, default_major: e.target.value })}
  style={{ ...inputStyle, cursor: 'pointer', color: '#fff' }}>
  <option value="" style={{ background: '#161616', color: '#fff' }}>Select a major</option>
  {MAJORS.map(m => <option key={m} value={m} style={{ background: '#161616', color: '#fff' }}>{m}</option>)}
</select>
                </div>

                <div>
                  <label style={labelStyle}>Default Experience Level</label>
                  <select value={prefs.default_experience} onChange={e => setPrefs({ ...prefs, default_experience: e.target.value })}
  style={{ ...inputStyle, cursor: 'pointer', color: '#fff' }}>
  <option value="" style={{ background: '#161616', color: '#fff' }}>Select level</option>
  {EXPERIENCE_LEVELS.map(l => <option key={l} value={l} style={{ background: '#161616', color: '#fff' }}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>)}
</select>
                </div>

                {/* Email notifications toggle */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12 }}>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, margin: '0 0 2px' }}>Email Notifications</p>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', margin: 0 }}>Receive updates and tips via email</p>
                  </div>
                  <button onClick={() => setPrefs({ ...prefs, email_notifications: !prefs.email_notifications })}
                    style={{
                      width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer', transition: 'all 0.3s',
                      background: prefs.email_notifications ? 'linear-gradient(135deg, #7c3aed, #4f46e5)' : 'rgba(255,255,255,0.1)',
                      position: 'relative', flexShrink: 0
                    }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: '50%', background: '#fff',
                      position: 'absolute', top: 3, transition: 'all 0.3s',
                      left: prefs.email_notifications ? 23 : 3
                    }} />
                  </button>
                </div>
              </div>

              {saveButton(handleSavePrefs, savingPrefs)}
            </div>
          )}

          {/* Danger Zone Tab */}
          {activeTab === 'danger' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 4, color: '#ef4444' }}>Danger Zone</h2>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>These actions are permanent and cannot be undone.</p>
              </div>

              <div style={{ padding: 24, background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 16 }}>
                <p style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Delete Account</p>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 20, lineHeight: 1.6 }}>
                  This will permanently delete your account, all your CV reviews, interview sessions, quizzes, and reports. This cannot be undone.
                </p>

                {deleteStep === 0 && (
                  <button onClick={() => setDeleteStep(1)}
                    style={{ padding: '10px 20px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, color: '#ef4444', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                    Delete my account
                  </button>
                )}

                {deleteStep === 1 && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <p style={{ fontSize: 13, color: '#ef4444', fontWeight: 600 }}>Are you sure? This is permanent.</p>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <button onClick={() => setDeleteStep(2)}
                        style={{ padding: '10px 20px', background: '#ef4444', border: 'none', borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                        Yes, delete my account
                      </button>
                      <button onClick={() => setDeleteStep(0)}
                        style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 13, cursor: 'pointer' }}>
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                )}

                {deleteStep === 2 && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>Enter your password to confirm:</p>
                    <input
                      type="password"
                      placeholder="Your password"
                      value={deletePassword}
                      onChange={e => setDeletePassword(e.target.value)}
                      style={{ ...inputStyle, borderColor: 'rgba(239,68,68,0.4)' }}
                    />
                    <div style={{ display: 'flex', gap: 10 }}>
                      <button onClick={handleDeleteAccount} disabled={deletingAccount || !deletePassword}
                        style={{ padding: '10px 20px', background: deletingAccount ? 'rgba(239,68,68,0.3)' : '#ef4444', border: 'none', borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                        {deletingAccount ? 'Deleting...' : 'Permanently Delete'}
                      </button>
                      <button onClick={() => { setDeleteStep(0); setDeletePassword(''); }}
                        style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 13, cursor: 'pointer' }}>
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}