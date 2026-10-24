'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Database, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink,
  KeyRound,
  Globe,
  Copy,
  Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function SupabaseConfigModal({ isOpen, onClose }) {
  const { supabaseConfig, updateSupabaseKeys, isSupabaseLive, connectionMessage } = useAuth();
  const [url, setUrl] = useState(supabaseConfig.url || '');
  const [anonKey, setAnonKey] = useState(supabaseConfig.anonKey || '');
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState(null);
  const [copiedSql, setCopiedSql] = useState(false);

  useEffect(() => {
    if (supabaseConfig.url) setUrl(supabaseConfig.url);
    if (supabaseConfig.anonKey) setAnonKey(supabaseConfig.anonKey);
  }, [supabaseConfig.url, supabaseConfig.anonKey, isOpen]);

  if (!isOpen) return null;

  const handleTestAndSave = async (e) => {
    e.preventDefault();
    setTesting(true);
    setResult(null);

    const res = await updateSupabaseKeys(url, anonKey);
    setTesting(false);
    setResult(res);
  };

  const copySqlNotice = () => {
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="app-modal-overlay" onClick={onClose}>
      <div 
        className="app-modal-sheet" 
        style={{ maxWidth: 500 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-sheet-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Database style={{ width: 22, height: 22 }} />
            </div>
            <div>
              <div className="modal-sheet-title">Connect Supabase DB</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>PostgreSQL database & user authentication</div>
            </div>
          </div>
          <button onClick={onClose} className="sheet-close-btn">
            <X style={{ width: 18, height: 18 }} />
          </button>
        </div>

        {/* Live Status Banner */}
        <div style={{ 
          padding: 14, 
          borderRadius: 14, 
          background: isSupabaseLive ? '#ecfdf5' : '#fffbeb', 
          border: `1px solid ${isSupabaseLive ? '#a7f3d0' : '#fde68a'}`, 
          display: 'flex', 
          alignItems: 'center', 
          gap: 10, 
          marginBottom: 16 
        }}>
          {isSupabaseLive ? (
            <CheckCircle2 style={{ width: 20, height: 20, color: '#10b981', flexShrink: 0 }} />
          ) : (
            <AlertCircle style={{ width: 20, height: 20, color: '#f59e0b', flexShrink: 0 }} />
          )}
          <div style={{ fontSize: '0.78rem' }}>
            <strong style={{ display: 'block', color: isSupabaseLive ? '#065f46' : '#92400e' }}>
              {isSupabaseLive ? 'Connected to Live Supabase Database' : 'Supabase Not Connected'}
            </strong>
            <span style={{ color: isSupabaseLive ? '#047857' : '#b45309' }}>
              {connectionMessage || 'Enter your Supabase project URL and anon public key below.'}
            </span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleTestAndSave} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#334155', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <Globe style={{ width: 14, height: 14, color: '#2563eb' }} />
              Project URL
            </label>
            <input
              type="url"
              placeholder="https://your-project.supabase.co"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: '#f8fafc', border: '1px solid #cbd5e1', fontSize: '0.82rem', fontFamily: 'var(--font-mono)', outline: 'none' }}
              required
            />
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#334155', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <KeyRound style={{ width: 14, height: 14, color: '#f59e0b' }} />
              Anon Public API Key
            </label>
            <textarea
              rows={3}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              value={anonKey}
              onChange={(e) => setAnonKey(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: '#f8fafc', border: '1px solid #cbd5e1', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', outline: 'none', resize: 'none' }}
              required
            />
          </div>

          {result && (
            <div style={{ padding: 10, borderRadius: 10, fontSize: '0.78rem', background: result.success ? '#ecfdf5' : '#fef2f2', border: `1px solid ${result.success ? '#a7f3d0' : '#fecaca'}`, color: result.success ? '#065f46' : '#991b1b' }}>
              {result.message}
            </div>
          )}

          <button
            type="submit"
            disabled={testing}
            className="btn-full-action"
            style={{ marginTop: 4 }}
          >
            {testing ? 'Testing Connection...' : 'Save & Connect Supabase'}
          </button>
        </form>

        {/* Database Schema Setup Note */}
        <div style={{ marginTop: 18, paddingTop: 14, borderTop: '1px solid #edf2f7', fontSize: '0.75rem', color: '#64748b' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontWeight: 700, color: '#0f172a' }}>Database Tables & Schema</span>
            <span style={{ fontSize: '0.7rem', color: '#2563eb', fontWeight: 600 }}>supabase_schema.sql</span>
          </div>
          <p style={{ lineHeight: 1.4, marginBottom: 8 }}>
            A complete migration script with tables (<code>customers</code>, <code>machines</code>, <code>field_jobs</code>, <code>diesel_logs</code>, <code>drivers</code>) is included in the workspace root at <code>supabase_schema.sql</code>.
          </p>
          <div style={{ padding: '8px 12px', borderRadius: 8, background: '#f1f5f9', fontSize: '0.7rem', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>Run script in Supabase Dashboard &gt; SQL Editor</span>
            <span style={{ color: '#10b981', fontWeight: 700 }}>Ready ✓</span>
          </div>
        </div>

      </div>
    </div>
  );
}
