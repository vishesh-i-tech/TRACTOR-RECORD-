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
        style={{ cursor: 'pointer' }}
        title="Settings & Switch Account (सेटिंग्स व खाता बदलें)"
      >
        <div className="profile-avatar" style={{ position: 'relative' }}>
          {user?.avatar || 'ST'}
          {isSupabaseLive && (
            <span 
              style={{
                position: 'absolute',
                bottom: -2,
                right: -2,
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: '#10b981',
                border: '2px solid #ffffff'
              }}
              title="Supabase Auth & DB active"
            />
          )}
        </div>
        <div>
          <div className="user-welcome-label" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span>{language === 'hi' ? 'स्वागत है,' : 'Welcome back,'}</span>
            <span style={{ fontSize: '0.65rem', color: '#2563eb', fontWeight: 700, textTransform: 'capitalize' }}>
              ({user?.role || currentRole})
            </span>
          </div>
          <div className="user-name-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>{user?.name || 'Surinder Thakur'}</span>
          </div>
        </div>
      </div>

      {/* Header action controls */}
      <div className="header-controls" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        
        {/* Supabase DB Connection Pill */}
        <button
          onClick={onOpenSupabaseConfig}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            padding: '5px 9px',
            borderRadius: 999,
            border: isSupabaseLive ? '1px solid #a7f3d0' : '1px solid #e2e8f0',
            background: isSupabaseLive ? '#ecfdf5' : '#f8fafc',
            color: isSupabaseLive ? '#065f46' : '#64748b',
            cursor: 'pointer',
            fontSize: '0.72rem',
            fontWeight: 700,
            transition: 'all 0.15s ease'
          }}
          title={isSupabaseLive ? 'Supabase DB Connected! Click to view config' : 'Connect to Supabase DB'}
        >
          <Database style={{ width: 13, height: 13, color: isSupabaseLive ? '#10b981' : '#64748b' }} />
          <span style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: isSupabaseLive ? '#10b981' : '#f59e0b',
            display: 'inline-block'
          }} />
          <span className="hidden-mobile-sm">
            {isSupabaseLive ? 'DB Connected' : 'Connect DB'}
          </span>
        </button>

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
