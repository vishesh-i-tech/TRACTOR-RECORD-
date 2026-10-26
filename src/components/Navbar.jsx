'use client';

import React from 'react';
import { 
  Bell, 
  Menu, 
  Smartphone, 
  Monitor, 
  ShieldCheck, 
  Sparkles,
  Tractor,
  Database,
  UserCheck,
  LogOut,
  Settings,
  Globe
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar({ 
  currentRole, 
  setRole, 
  isExpandedView, 
  setIsExpandedView,
  openVoiceModal,
  onOpenAuth,
  onOpenSupabaseConfig,
  onOpenSqliteInfo,
  totalAlerts = 1 
}) {
  const { user, isSupabaseLive, signOut } = useAuth();
  const { language, setLanguage } = useLanguage();

  return (
    <div className="app-top-header">
      
      {/* User profile group - Clickable to open Settings / Auth Modal */}
      <div 
        className="user-profile-group" 
        onClick={onOpenAuth}
        style={{ cursor: 'pointer', maxWidth: '50%' }}
        title="Settings & Account"
      >
        <div className="profile-avatar" style={{ width: 38, height: 38, fontSize: '0.88rem' }}>
          {user?.avatar || (user?.name ? user.name.substring(0, 2).toUpperCase() : 'TR')}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: 1.2 }}>
            {user?.name || (language === 'hi' ? 'खाता' : 'Account')}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
            <span style={{ fontSize: '0.65rem', color: '#2563eb', fontWeight: 700, textTransform: 'capitalize', background: '#eff6ff', padding: '1px 6px', borderRadius: 999 }}>
              {user?.role || currentRole || 'Owner'}
            </span>
          </div>
        </div>
      </div>

      {/* Header action controls */}
      <div className="header-controls" style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
        
        {/* Language Switch Toggle (English / हिंदी) */}
        <div style={{ display: 'flex', background: '#f1f5f9', padding: 2, borderRadius: 999, border: '1px solid #e2e8f0' }}>
          <button
            type="button"
            onClick={() => setLanguage('en')}
            style={{
              padding: '4px 7px',
              borderRadius: 999,
              border: 'none',
              fontSize: '0.68rem',
              fontWeight: 700,
              cursor: 'pointer',
              background: language === 'en' ? '#2563eb' : 'transparent',
              color: language === 'en' ? '#ffffff' : '#64748b',
              transition: 'all 0.15s ease'
            }}
            title="English"
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => setLanguage('hi')}
            style={{
              padding: '4px 7px',
              borderRadius: 999,
              border: 'none',
              fontSize: '0.68rem',
              fontWeight: 700,
              cursor: 'pointer',
              background: language === 'hi' ? '#2563eb' : 'transparent',
              color: language === 'hi' ? '#ffffff' : '#64748b',
              transition: 'all 0.15s ease'
            }}
            title="हिंदी"
          >
            HI
          </button>
        </div>

        {/* Settings & Account Switcher Button (Requested: Switch account moved into settings!) */}
        <button
          onClick={onOpenAuth}
          className="icon-btn-circle"
          style={{
            background: '#f8fafc',
            borderColor: '#e2e8f0',
            color: '#1e293b'
          }}
          title={language === 'hi' ? 'सेटिंग्स व खाता बदलें (Settings & Switch Account)' : 'Settings & Switch Account'}
        >
          <Settings style={{ width: 16, height: 16 }} />
        </button>

        {/* View toggle (Mobile frame vs Desktop Expanded) */}
        <button
          onClick={() => setIsExpandedView(!isExpandedView)}
          className="icon-btn-circle"
          title={isExpandedView ? "Switch to Phone Frame" : "Switch to Expanded Dashboard"}
        >
          {isExpandedView ? <Smartphone style={{ width: 16, height: 16 }} /> : <Monitor style={{ width: 16, height: 16 }} />}
        </button>

        {/* Notifications */}
        <button 
          onClick={openVoiceModal}
          className="icon-btn-circle" 
          title="Voice Assistant & Alerts"
        >
          <Bell style={{ width: 17, height: 17 }} />
          {totalAlerts > 0 && <span className="notification-dot"></span>}
        </button>

        {/* Sign Out / Logout Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            signOut();
          }}
          className="icon-btn-circle"
          style={{
            background: '#fef2f2',
            borderColor: '#fecaca',
            color: '#dc2626'
          }}
          title="Sign Out (लॉग आउट)"
        >
          <LogOut style={{ width: 16, height: 16 }} />
        </button>

      </div>

    </div>
  );
}
