'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  User, 
  Tractor, 
  CheckCircle2, 
  AlertCircle,
  Database,
  ArrowRight,
  Sparkles,
  Globe,
  FileSpreadsheet
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function AuthView({ onOpenSupabaseConfig }) {
  const { signIn, signUp, isSupabaseLive } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [tab, setTab] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('owner');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isAlreadyExisting, setIsAlreadyExisting] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);

  const switchToLogin = () => {
    setTab('login');
    setError('');
    setSuccessMsg('');
    setIsAlreadyExisting(false);
    setIsNotFound(false);
  };

  const switchToSignup = () => {
    setTab('signup');
    setError('');
    setSuccessMsg('');
    setIsAlreadyExisting(false);
    setIsNotFound(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setIsAlreadyExisting(false);
    setIsNotFound(false);
    setLoading(true);

    try {
      if (tab === 'login') {
        await signIn(email, password);
        setSuccessMsg(language === 'hi' ? 'सफलतापूर्वक प्रवेश!' : 'Signed in! Opening dashboard...');
      } else {
        if (!fullName.trim()) {
          setError(language === 'hi' ? 'कृपया अपना नाम दर्ज करें' : 'Please enter your name');
          setLoading(false);
          return;
        }
        await signUp(email, password, fullName, role);
        setSuccessMsg(language === 'hi' ? 'खाता तैयार!' : 'Account registered successfully!');
      }
    } catch (err) {
      const msg = err.message || (language === 'hi' ? 'प्रमाणीकरण त्रुटि' : 'Authentication error. Please check credentials.');
      setError(msg);
      if (err.alreadyExists || err.code === 'already_exists' || msg.toLowerCase().includes('already exist')) {
        setIsAlreadyExisting(true);
      }
      if (err.notFound || err.code === 'user_not_found' || msg.toLowerCase().includes('not found')) {
        setIsNotFound(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-view-container">
      {/* Top Bar with Language Switcher */}
      <div className="auth-top-toolbar">
        <div className="auth-lang-pill">
          <Globe style={{ width: 14, height: 14, color: '#64748b' }} />
          <button
            type="button"
            onClick={() => setLanguage('en')}
            className={`auth-lang-btn ${language === 'en' ? 'active' : ''}`}
          >
            English
          </button>
          <span className="lang-divider">|</span>
          <button
            type="button"
            onClick={() => setLanguage('hi')}
            className={`auth-lang-btn ${language === 'hi' ? 'active' : ''}`}
          >
            हिंदी
          </button>
        </div>
      </div>

      {/* Brand Header */}
      <div className="auth-view-header">
        <div className="auth-brand-badge">
          <Tractor style={{ width: 28, height: 28, color: '#ffffff' }} />
        </div>
        <h1 className="auth-brand-title">{t('appName', 'Tractor Record')}</h1>
        <p className="auth-brand-subtitle">
          {t('tagline', 'Rural Fleet & Khata Management')}
        </p>
      </div>

      {/* Main Authentication Card */}
      <div className="auth-form-card">
        {/* Tab Switcher: Sign In & Sign Up */}
        <div className="auth-tab-bar">
          <button
            type="button"
            onClick={switchToLogin}
            className={`auth-tab-btn ${tab === 'login' ? 'active' : ''}`}
          >
            {language === 'hi' ? 'साइन इन' : 'Sign In'}
          </button>
          <button
            type="button"
            onClick={switchToSignup}
            className={`auth-tab-btn ${tab === 'signup' ? 'active' : ''}`}
          >
            {language === 'hi' ? 'साइन अप' : 'Sign Up'}
          </button>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="auth-input-form">
          {tab === 'signup' && (
            <>
              <div className="auth-field-group">
                <label className="auth-field-label">
                  <User style={{ width: 14, height: 14, color: '#2563eb' }} />
                  <span>{language === 'hi' ? 'पूरा नाम' : 'Full Name'}</span>
                </label>
                <div className="auth-input-box">
                  <input
                    type="text"
                    required
                    placeholder={language === 'hi' ? 'पूरा नाम' : 'Full Name'}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="auth-input-field"
                  />
                </div>
              </div>

              <div className="auth-field-group">
                <label className="auth-field-label">
                  <Tractor style={{ width: 14, height: 14, color: '#2563eb' }} />
                  <span>{language === 'hi' ? 'भूमिका' : 'Role'}</span>
                </label>
                <div className="auth-role-select-grid">
                  <button
                    type="button"
                    onClick={() => setRole('owner')}
                    className={`auth-role-pill-btn ${role === 'owner' ? 'active' : ''}`}
                  >
                    👑 {language === 'hi' ? 'मालिक' : 'Owner'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('munshi')}
                    className={`auth-role-pill-btn ${role === 'munshi' ? 'active' : ''}`}
                  >
                    📋 {language === 'hi' ? 'मुंशी' : 'Munshi'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('driver')}
                    className={`auth-role-pill-btn ${role === 'driver' ? 'active' : ''}`}
                  >
                    🚜 {language === 'hi' ? 'ड्राइवर' : 'Driver'}
                  </button>
                </div>
              </div>
            </>
          )}

          <div className="auth-field-group">
            <label className="auth-field-label">
              <Mail style={{ width: 14, height: 14, color: '#2563eb' }} />
              <span>{language === 'hi' ? 'ईमेल या मोबाइल' : 'Email or Mobile'}</span>
            </label>
            <div className="auth-input-box">
              <input
                type="text"
                required
                placeholder={language === 'hi' ? 'ईमेल या मोबाइल नंबर' : 'Email or Mobile Number'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="auth-input-field"
              />
            </div>
          </div>

          <div className="auth-field-group">
            <label className="auth-field-label">
              <Lock style={{ width: 14, height: 14, color: '#2563eb' }} />
              <span>{language === 'hi' ? 'पासवर्ड या पिन' : 'Password or PIN'}</span>
            </label>
            <div className="auth-input-box">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth-input-field"
              />
            </div>
          </div>

          {error && (
            <div className="auth-alert-box error" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <AlertCircle style={{ width: 16, height: 16, flexShrink: 0 }} />
                <span>{error}</span>
              </div>
              {isAlreadyExisting && (
                <button
                  type="button"
                  onClick={switchToLogin}
                  className="auth-inline-action-btn"
                >
                  👉 {language === 'hi' ? 'साइन इन करें (पहले से खाता है)' : 'Sign In as existing user'} →
                </button>
              )}
              {isNotFound && (
                <button
                  type="button"
                  onClick={switchToSignup}
                  className="auth-inline-action-btn"
                >
                  👉 {language === 'hi' ? 'नया खाता बनाएं (साइन अप)' : 'Create new account (Sign Up)'} →
                </button>
              )}
            </div>
          )}

          {successMsg && (
            <div className="auth-alert-box success">
              <CheckCircle2 style={{ width: 16, height: 16, flexShrink: 0 }} />
              <span>{successMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="auth-submit-btn"
          >
            {loading ? (
              <span>{language === 'hi' ? 'प्रतीक्षा करें...' : 'Processing...'}</span>
            ) : (
              <>
                <span>{tab === 'login' ? (language === 'hi' ? 'साइन इन' : 'Sign In') : (language === 'hi' ? 'साइन अप' : 'Sign Up')}</span>
                <ArrowRight style={{ width: 16, height: 16 }} />
              </>
            )}
          </button>

          {/* Quick toggle between existing user and new user */}
          <div className="auth-switch-prompt">
            {tab === 'signup' ? (
              <>
                <span>{language === 'hi' ? 'पहले से खाता है?' : 'Already existing user?'}</span>{' '}
                <button
                  type="button"
                  onClick={switchToLogin}
                  className="auth-switch-link-btn"
                >
                  {language === 'hi' ? 'साइन इन' : 'Sign In'}
                </button>
              </>
            ) : (
              <>
                <span>{language === 'hi' ? 'नया खाता बनाना है?' : 'New user?'}</span>{' '}
                <button
                  type="button"
                  onClick={switchToSignup}
                  className="auth-switch-link-btn"
                >
                  {language === 'hi' ? 'साइन अप' : 'Sign Up'}
                </button>
              </>
            )}
          </div>
        </form>
      </div>

      {/* Feature Highlights Footer */}
      <div className="auth-view-footer">
        <div className="auth-feature-tag">
          <ShieldCheck style={{ width: 14, height: 14, color: '#10b981' }} />
          <span>Anti-Tamper GPS</span>
        </div>
        <div className="auth-feature-tag">
          <Sparkles style={{ width: 14, height: 14, color: '#8b5cf6' }} />
          <span>Voice AI</span>
        </div>
        <div className="auth-feature-tag">
          <FileSpreadsheet style={{ width: 14, height: 14, color: '#2563eb' }} />
          <span>WhatsApp Khata</span>
        </div>
      </div>
    </div>
  );
}
