'use client';

import React, { useState } from 'react';
import { 
  X, 
  LogIn, 
  UserPlus, 
  ShieldCheck, 
  Lock, 
  Mail, 
  User, 
  Tractor, 
  CheckCircle2, 
  AlertCircle,
  Database,
  LogOut,
  Settings,
  Check,
  Globe,
  Briefcase
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function AuthModal({ isOpen, onClose, onOpenConfig, currentRole, setRole }) {
  const { user, signIn, signUp, signOut, demoLogin, isSupabaseLive } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const [tab, setTab] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [signupRole, setSignupRole] = useState('owner');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const effectiveRole = currentRole || user?.role || 'owner';

  const handleRoleSwitch = (targetRole) => {
    if (setRole) setRole(targetRole);
    demoLogin(targetRole);
    const roleTitle = targetRole === 'owner' 
      ? (language === 'hi' ? 'मालिक (Owner)' : 'Owner') 
      : targetRole === 'munshi' 
      ? (language === 'hi' ? 'मुंशी (Accountant)' : 'Accountant') 
      : (language === 'hi' ? 'ड्राइवर (Driver)' : 'Driver');

    setSuccessMsg(language === 'hi' ? `${roleTitle} खाते में स्विच हो गया!` : `Switched to ${roleTitle} account!`);
    setTimeout(() => {
      onClose();
    }, 450);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (tab === 'login') {
        await signIn(email, password);
        setSuccessMsg(language === 'hi' ? 'सफलतापूर्वक लॉगिन हुआ!' : 'Successfully logged in!');
        setTimeout(() => onClose(), 800);
      } else {
        await signUp(email, password, fullName, signupRole);
        setSuccessMsg(language === 'hi' ? 'खाता सफलतापूर्वक बनाया गया!' : 'Account created successfully!');
        setTimeout(() => onClose(), 800);
      }
    } catch (err) {
      setError(err.message || 'Authentication error. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const roleProfiles = [
    {
      id: 'owner',
      title: language === 'hi' ? 'फार्म व फ्लीट मालिक' : 'Farm & Fleet Owner',
      name: 'Surinder Thakur',
      icon: '👑',
      desc: language === 'hi' 
        ? 'पूर्ण वित्तीय नियंत्रण: किसान खाता बही, फ्लीट मॉनिटरिंग, डीजल ऑडिट व बैंक P&L' 
        : 'Full Financials: Farmer Khata Ledger, Fleet Monitoring, Diesel Audit & Bank P&L',
      accentColor: '#2563eb',
      bgColor: '#eff6ff'
    },
    {
      id: 'munshi',
      title: language === 'hi' ? 'मुंशी / लेखाकार' : 'Accountant (Munshi)',
      name: 'Radhe Shyam',
      icon: '📋',
      desc: language === 'hi' 
        ? 'दैनिक प्रविष्टियां: खेत कार्य लॉग, डीजल पर्ची व व्हाट्सएप इनवॉइस' 
        : 'Daily Operations: Field Job Logs, Fuel Slips & WhatsApp Invoice Khata',
      accentColor: '#d97706',
      bgColor: '#fffbeb'
    },
    {
      id: 'driver',
      title: language === 'hi' ? 'मशीन चालक (ड्राइवर मोड)' : 'Machine Driver (Driver Mode)',
      name: 'Sukhwinder Singh',
      icon: '🚜',
      desc: language === 'hi' 
        ? 'चालक कंसोल: आसान मीटर रीडिंग, डीजल रसीद फोटो व कार्य स्थिति' 
        : 'Driver Console: Anti-Tamper Hours, Fuel Photos & Simple Task Logging',
      accentColor: '#0284c7',
      bgColor: '#f0f9ff'
    }
  ];

  return (
    <div className="app-modal-overlay" onClick={onClose}>
      <div 
        className="app-modal-sheet" 
        style={{ maxWidth: 480, maxHeight: '90vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-sheet-header" style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ 
              width: 44, 
              height: 44, 
              borderRadius: 14, 
              background: '#eff6ff', 
              color: '#2563eb', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(37,99,235,0.1)'
            }}>
              <Settings style={{ width: 22, height: 22 }} />
            </div>
            <div>
              <div className="modal-sheet-title" style={{ fontSize: '1.1rem' }}>
                {user 
                  ? (language === 'hi' ? 'सेटिंग्स व खाता' : 'Settings & Account') 
                  : (tab === 'login' ? (language === 'hi' ? 'खाते में लॉगिन करें' : 'Sign In to Account') : (language === 'hi' ? 'नया खाता बनाएं' : 'Create Account'))}
              </div>
              <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                {user 
                  ? (language === 'hi' ? 'खाता बदलें व ऐप प्राथमिकताएं प्रबंधित करें' : 'Switch role account & manage preferences')
                  : (isSupabaseLive ? 'Powered by Supabase Auth & DB' : 'Tractor Record Authentication')}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="sheet-close-btn" title="Close">
            <X style={{ width: 18, height: 18 }} />
          </button>
        </div>

        {/* Feedback Alert if role switched */}
        {successMsg && (
          <div style={{ 
            padding: '10px 14px', 
            borderRadius: 12, 
            background: '#ecfdf5', 
            border: '1px solid #a7f3d0', 
            fontSize: '0.8rem', 
            color: '#065f46', 
            fontWeight: 700,
            display: 'flex', 
            alignItems: 'center', 
            gap: 8,
            marginBottom: 14,
            animation: 'fadeIn 0.2s ease'
          }}>
            <CheckCircle2 style={{ width: 16, height: 16, color: '#10b981' }} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* If user is logged in: Show Settings & Role Switcher */}
        {user ? (
          <div>
            {/* Active Account Overview Card */}
            <div style={{ 
              padding: '12px 14px', 
              borderRadius: 14, 
              background: '#f8fafc', 
              border: '1px solid #e2e8f0', 
              marginBottom: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ 
                  width: 40, 
                  height: 40, 
                  borderRadius: '50%', 
                  background: '#2563eb', 
                  color: '#ffffff', 
                  fontWeight: 800, 
                  fontSize: '0.9rem',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  boxShadow: '0 2px 5px rgba(37,99,235,0.2)'
                }}>
                  {user.avatar || 'ST'}
                </div>
                <div>
                  <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.9rem' }}>{user.name}</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{user.email}</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3 }}>
                <span style={{ 
                  fontSize: '0.68rem', 
                  fontWeight: 800, 
                  padding: '3px 8px', 
                  borderRadius: 999, 
                  background: '#eff6ff', 
                  color: '#2563eb',
                  textTransform: 'uppercase'
                }}>
                  {effectiveRole}
                </span>
                <span style={{ fontSize: '0.62rem', color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 3 }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#10b981' }} />
                  {language === 'hi' ? 'सक्रिय' : 'Active'}
                </span>
              </div>
            </div>

            {/* Account / Role Switcher Section */}
            <div style={{ marginBottom: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>{language === 'hi' ? 'खाता / भूमिका बदलें' : 'Switch Account / Role'}</span>
                </div>
                <span style={{ fontSize: '0.68rem', color: '#64748b' }}>
                  {language === 'hi' ? '1-क्लिक स्विच' : '1-Click Switch'}
                </span>
              </div>
              <div style={{ fontSize: '0.73rem', color: '#64748b', marginBottom: 10 }}>
                {language === 'hi' 
                  ? 'नीचे से जिस खाते में जाना चाहते हैं उस पर क्लिक करें:' 
                  : 'Select an account profile below to switch immediately:'}
              </div>

              {/* 3 Interactive Role Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {roleProfiles.map((p) => {
                  const isActive = effectiveRole === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleRoleSwitch(p.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 14px',
                        borderRadius: 14,
                        border: isActive ? `2px solid ${p.accentColor}` : '1px solid #e2e8f0',
                        background: isActive ? p.bgColor : '#ffffff',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.15s ease',
                        boxShadow: isActive ? '0 4px 12px rgba(0,0,0,0.06)' : 'none',
                        position: 'relative'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flex: 1 }}>
                        <div style={{ 
                          fontSize: '1.4rem', 
                          lineHeight: 1, 
                          padding: '6px', 
                          borderRadius: 10, 
                          background: isActive ? '#ffffff' : '#f8fafc',
                          border: '1px solid #e2e8f0'
                        }}>
                          {p.icon}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                            <span style={{ fontWeight: 800, fontSize: '0.88rem', color: '#0f172a' }}>
                              {p.title}
                            </span>
                            <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>
                              • {p.name}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#64748b', lineHeight: 1.35 }}>
                            {p.desc}
                          </div>
                        </div>
                      </div>

                      {/* Active Status Badge or Switch Arrow */}
                      <div style={{ marginLeft: 8 }}>
                        {isActive ? (
                          <span style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                            padding: '4px 10px',
                            borderRadius: 999,
                            background: p.accentColor,
                            color: '#ffffff',
                            fontSize: '0.7rem',
                            fontWeight: 800
                          }}>
                            <Check style={{ width: 13, height: 13 }} />
                            <span>{language === 'hi' ? 'सक्रिय' : 'Active'}</span>
                          </span>
                        ) : (
                          <span style={{
                            padding: '4px 10px',
                            borderRadius: 999,
                            background: '#f1f5f9',
                            color: '#475569',
                            fontSize: '0.7rem',
                            fontWeight: 700
                          }}>
                            {language === 'hi' ? 'स्विच करें' : 'Switch'}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* App Preferences: Language & Database */}
            <div style={{ 
              padding: '14px', 
              borderRadius: 14, 
              background: '#f8fafc', 
              border: '1px solid #e2e8f0', 
              marginBottom: 16,
              display: 'flex',
              flexDirection: 'column',
              gap: 12
            }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {language === 'hi' ? 'ऐप प्राथमिकताएं' : 'App Preferences'}
              </div>

              {/* Language Switcher */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: '#0f172a', fontWeight: 600 }}>
                  <Globe style={{ width: 15, height: 15, color: '#2563eb' }} />
                  <span>{language === 'hi' ? 'भाषा (Language)' : 'App Language'}</span>
                </div>
                <div style={{ display: 'flex', background: '#e2e8f0', padding: 2, borderRadius: 999 }}>
                  <button
                    type="button"
                    onClick={() => setLanguage('en')}
                    style={{
                      padding: '4px 10px',
                      borderRadius: 999,
                      border: 'none',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      background: language === 'en' ? '#2563eb' : 'transparent',
                      color: language === 'en' ? '#ffffff' : '#475569',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage('hi')}
                    style={{
                      padding: '4px 10px',
                      borderRadius: 999,
                      border: 'none',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      background: language === 'hi' ? '#2563eb' : 'transparent',
                      color: language === 'hi' ? '#ffffff' : '#475569',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    हिंदी
                  </button>
                </div>
              </div>

              {/* Supabase Database Config */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8, borderTop: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: '#0f172a', fontWeight: 600 }}>
                  <Database style={{ width: 15, height: 15, color: isSupabaseLive ? '#10b981' : '#64748b' }} />
                  <div>
                    <div>{language === 'hi' ? 'डेटाबेस' : 'Database'}</div>
                    <div style={{ fontSize: '0.68rem', color: isSupabaseLive ? '#059669' : '#64748b', fontWeight: 500 }}>
                      {isSupabaseLive 
                        ? (language === 'hi' ? 'सुपाबेस क्लाउड कनेक्टेड' : 'Supabase Cloud Live') 
                        : (language === 'hi' ? 'लोकल डेमो मोड' : 'Local / Demo Mode')}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenConfig();
                  }}
                  style={{
                    padding: '5px 10px',
                    borderRadius: 8,
                    background: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    color: '#2563eb',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {language === 'hi' ? 'कॉन्फ़िगर' : 'Configure'}
                </button>
              </div>
            </div>

            {/* Sign Out Button */}
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                onClick={() => {
                  signOut();
                  onClose();
                }}
                className="amount-chip-btn"
                style={{ 
                  flex: 1, 
                  padding: '10px', 
                  background: '#fef2f2', 
                  color: '#dc2626', 
                  borderColor: '#fecaca', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: 6,
                  fontWeight: 700,
                  fontSize: '0.82rem'
                }}
              >
                <LogOut style={{ width: 15, height: 15 }} />
                <span>{language === 'hi' ? 'लॉग आउट (Sign Out)' : 'Sign Out'}</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="btn-full-action"
                style={{ flex: 1, padding: '10px', fontSize: '0.82rem' }}
              >
                {language === 'hi' ? 'संपन्न' : 'Done'}
              </button>
            </div>
          </div>
        ) : (
          /* Unauthenticated State: Sign In / Create Account Form */
          <div>
            {/* Tab Switcher */}
            <div style={{ display: 'flex', background: '#f1f5f9', padding: 4, borderRadius: 12, marginBottom: 16 }}>
              <button
                onClick={() => { setTab('login'); setError(''); setSuccessMsg(''); }}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: 9,
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  background: tab === 'login' ? '#ffffff' : 'transparent',
                  color: tab === 'login' ? '#0f172a' : '#64748b',
                  boxShadow: tab === 'login' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                {language === 'hi' ? 'लॉगिन' : 'Sign In'}
              </button>
              <button
                onClick={() => { setTab('signup'); setError(''); setSuccessMsg(''); }}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: 9,
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  background: tab === 'signup' ? '#ffffff' : 'transparent',
                  color: tab === 'signup' ? '#0f172a' : '#64748b',
                  boxShadow: tab === 'signup' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                {language === 'hi' ? 'खाता बनाएं' : 'Create Account'}
              </button>
            </div>

            {/* Auth Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {tab === 'signup' && (
                <>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>
                      {language === 'hi' ? 'पूरा नाम' : 'Full Name'}
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Surinder Thakur"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: 10, background: '#f8fafc', border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none' }}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>
                      {language === 'hi' ? 'भूमिका' : 'Account Role'}
                    </label>
                    <select
                      value={signupRole}
                      onChange={(e) => setSignupRole(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: 10, background: '#f8fafc', border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none' }}
                    >
                      <option value="owner">Farm & Fleet Owner</option>
                      <option value="munshi">Accountant (Munshi)</option>
                      <option value="driver">Machine Driver / Operator</option>
                    </select>
                  </div>
                </>
              )}

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>
                  {language === 'hi' ? 'ईमेल पता' : 'Email Address'}
                </label>
                <input
                  type="email"
                  placeholder="surinder@tractorrecord.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 10, background: '#f8fafc', border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none' }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>
                  {language === 'hi' ? 'पासवर्ड' : 'Password'}
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 10, background: '#f8fafc', border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none' }}
                  required
                />
              </div>

              {error && (
                <div style={{ padding: 10, borderRadius: 10, background: '#fef2f2', border: '1px solid #fecaca', fontSize: '0.78rem', color: '#dc2626', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <AlertCircle style={{ width: 14, height: 14 }} />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-full-action"
                style={{ marginTop: 6 }}
              >
                {loading 
                  ? 'Authenticating...' 
                  : tab === 'login' 
                  ? (language === 'hi' ? 'लॉगिन करें' : 'Sign In') 
                  : (language === 'hi' ? 'खाता बनाएं' : 'Register Account')}
              </button>
            </form>

            {/* 1-Click Instant Demo Profiles */}
            <div style={{ marginTop: 18, paddingTop: 14, borderTop: '1px solid #edf2f7' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: 8 }}>
                {language === 'hi' ? '1-क्लिक डेमो प्रोफाइल:' : 'Instant 1-Click Demo Profiles:'}
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                <button
                  type="button"
                  onClick={() => handleRoleSwitch('owner')}
                  style={{ padding: '8px 6px', borderRadius: 10, background: '#f8fafc', border: '1px solid #e2e8f0', fontSize: '0.72rem', fontWeight: 700, color: '#1e40af', cursor: 'pointer', textAlign: 'center' }}
                >
                  👑 Owner
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleSwitch('munshi')}
                  style={{ padding: '8px 6px', borderRadius: 10, background: '#f8fafc', border: '1px solid #e2e8f0', fontSize: '0.72rem', fontWeight: 700, color: '#d97706', cursor: 'pointer', textAlign: 'center' }}
                >
                  📋 Munshi
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleSwitch('driver')}
                  style={{ padding: '8px 6px', borderRadius: 10, background: '#f8fafc', border: '1px solid #e2e8f0', fontSize: '0.72rem', fontWeight: 700, color: '#0284c7', cursor: 'pointer', textAlign: 'center' }}
                >
                  🚜 Driver
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
