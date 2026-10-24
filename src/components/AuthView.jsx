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
  const { signIn, signUp, demoLogin, isSupabaseLive } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [tab, setTab] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('owner');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (tab === 'login') {
        await signIn(email, password);
        setSuccessMsg(language === 'hi' ? 'सफलतापूर्वक लॉग इन हुआ!' : 'Successfully signed in! Opening dashboard...');
      } else {
        await signUp(email, password, fullName, role);
        setSuccessMsg(language === 'hi' ? 'खाता सफलतापूर्वक बनाया गया!' : 'Account created successfully! Welcome to Tractor Record.');
      }
    } catch (err) {
      setError(err.message || (language === 'hi' ? 'प्रमाणीकरण त्रुटि। कृपया क्रेडेंशियल जांचें।' : 'Authentication error. Please check your credentials.'));
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSelect = (roleName) => {
    setError('');
    setSuccessMsg(language === 'hi' ? `डेमो खाते में प्रवेश किया जा रहा है...` : `Signing in as demo ${roleName}...`);
    setTimeout(() => {
      demoLogin(roleName);
    }, 200);
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

        {/* Database Status Pill */}
        <div className="auth-db-pill-bar">
          <div 
            onClick={onOpenSupabaseConfig}
            className={`auth-db-status-badge ${isSupabaseLive ? 'live' : 'offline'}`}
            title="Click to view or edit Supabase credentials"
          >
            <Database style={{ width: 13, height: 13 }} />
            <span className="auth-db-indicator-dot" />
            <span>{isSupabaseLive ? t('liveDb', 'Live Supabase DB') : t('demoMode', 'Local / Demo Mode')}</span>
            <span style={{ fontSize: '0.68rem', opacity: 0.7, textDecoration: 'underline', marginLeft: 4 }}>
              ⚙️ {t('settings', 'Settings')}
            </span>
          </div>
        </div>
      </div>

      {/* Main Authentication Card */}
      <div className="auth-form-card">
        {/* Tab Switcher */}
        <div className="auth-tab-bar">
          <button
            type="button"
            onClick={() => { setTab('login'); setError(''); setSuccessMsg(''); }}
            className={`auth-tab-btn ${tab === 'login' ? 'active' : ''}`}
          >
            {t('signInTab', 'Sign In')}
          </button>
          <button
            type="button"
            onClick={() => { setTab('signup'); setError(''); setSuccessMsg(''); }}
            className={`auth-tab-btn ${tab === 'signup' ? 'active' : ''}`}
          >
            {t('createAccountTab', 'Create Account')}
          </button>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="auth-input-form">
          {tab === 'signup' && (
            <>
              <div className="auth-form-group">
                <label className="auth-input-label">{t('fullName', 'Full Name')}</label>
                <div className="auth-input-wrapper">
                  <User style={{ width: 17, height: 17, color: '#94a3b8' }} />
                  <input
                    type="text"
                    placeholder={t('fullNamePlaceholder', 'e.g. Surinder Thakur')}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="auth-form-group">
                <label className="auth-input-label">{t('accountRole', 'Account Role')}</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="auth-select-field"
                >
                  <option value="owner">👑 {t('roleOwner', 'Farm & Fleet Owner')}</option>
                  <option value="munshi">📋 {t('roleMunshi', 'Accountant (Munshi)')}</option>
                  <option value="driver">🚜 {t('roleDriver', 'Machine Driver / Operator')}</option>
                </select>
              </div>
            </>
          )}

          <div className="auth-form-group">
            <label className="auth-input-label">{t('email', 'Email Address')}</label>
            <div className="auth-input-wrapper">
              <Mail style={{ width: 17, height: 17, color: '#94a3b8' }} />
              <input
                type="email"
                placeholder={tab === 'login' ? 'surinder@tractorrecord.com' : 'your.email@example.com'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="auth-form-group">
            <label className="auth-input-label">{t('password', 'Password')}</label>
            <div className="auth-input-wrapper">
              <Lock style={{ width: 17, height: 17, color: '#94a3b8' }} />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {error && (
            <div className="auth-alert-box error">
              <AlertCircle style={{ width: 16, height: 16, flexShrink: 0 }} />
              <span>{error}</span>
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
              <span>{t('authenticating', 'Authenticating...')}</span>
            ) : (
              <>
                <span>{tab === 'login' ? t('signInButton', 'Sign In to Dashboard') : t('createAccountButton', 'Create Account & Enter')}</span>
                <ArrowRight style={{ width: 16, height: 16 }} />
              </>
            )}
          </button>
        </form>

        {/* 1-Click Instant Demo Login Strip */}
        <div className="auth-demo-section">
          <div className="auth-demo-divider">
            <span>{t('orTestInstantly', 'OR TEST INSTANTLY (1-CLICK DEMO)')}</span>
          </div>

          <div className="auth-demo-cards-grid">
            <button
              type="button"
              onClick={() => handleDemoSelect('owner')}
              className="auth-demo-card owner"
            >
              <div className="demo-card-avatar">👑 ST</div>
              <div className="demo-card-content">
                <div className="demo-card-name">Surinder Thakur</div>
                <div className="demo-card-role">{t('roleOwner', 'Farm & Fleet Owner')}</div>
                <div className="demo-card-hint">{t('ownerHint', 'Full Financials & Khata Ledger')}</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleDemoSelect('munshi')}
              className="auth-demo-card munshi"
            >
              <div className="demo-card-avatar munshi">📋 RS</div>
              <div className="demo-card-content">
                <div className="demo-card-name">Radhe Shyam</div>
                <div className="demo-card-role">{t('roleMunshi', 'Accountant (Munshi)')}</div>
                <div className="demo-card-hint">{t('munshiHint', 'Field Logs, Diesel & Barter')}</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleDemoSelect('driver')}
              className="auth-demo-card driver"
            >
              <div className="demo-card-avatar driver">🚜 SS</div>
              <div className="demo-card-content">
                <div className="demo-card-name">Sukhwinder Singh</div>
                <div className="demo-card-role">{t('roleDriver', 'Machine Driver / Operator')}</div>
                <div className="demo-card-hint">{t('driverHint', 'Anti-Tamper Meter & Photo Proof')}</div>
              </div>
            </button>
          </div>
        </div>

      </div>

      {/* Feature Highlights Footer */}
      <div className="auth-view-footer">
        <div className="auth-feature-tag">
          <ShieldCheck style={{ width: 14, height: 14, color: '#10b981' }} />
          <span>{t('antiTamperGps', 'Anti-Tamper GPS')}</span>
        </div>
        <div className="auth-feature-tag">
          <Sparkles style={{ width: 14, height: 14, color: '#8b5cf6' }} />
          <span>{t('voiceAi', 'Voice AI')}</span>
        </div>
        <div className="auth-feature-tag">
          <FileSpreadsheet style={{ width: 14, height: 14, color: '#2563eb' }} />
          <span>{t('whatsappKhata', 'WhatsApp Khata')}</span>
        </div>
      </div>
    </div>
  );
}
