'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Database, 
  CheckCircle2, 
  HardDrive, 
  RefreshCw, 
  FileText, 
  ShieldCheck, 
  Users, 
  Tractor, 
  Fuel, 
  Layers,
  CloudUpload,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { fetchSqliteStats } from '../lib/dbService';

export default function SqliteInfoModal({ 
  isOpen, 
  onClose, 
  onOpenSupabaseConfig, 
  onRefreshData 
}) {
  const { language } = useLanguage();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshNote, setRefreshNote] = useState('');

  const loadStats = async () => {
    setLoading(true);
    const data = await fetchSqliteStats();
    if (data) setStats(data);
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      loadStats();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleManualRefresh = async () => {
    await loadStats();
    if (onRefreshData) onRefreshData();
    setRefreshNote(language === 'hi' ? 'डेटाबेस सिंक्रनाइज़ हो गया!' : 'SQLite snapshot refreshed!');
    setTimeout(() => setRefreshNote(''), 2000);
  };

  return (
    <div className="app-modal-overlay" onClick={onClose}>
      <div 
        className="app-modal-sheet" 
        style={{ maxWidth: 520, maxHeight: '90vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-sheet-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Database style={{ width: 24, height: 24 }} />
            </div>
            <div>
              <div className="modal-sheet-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>SQLite Database</span>
                <span style={{ fontSize: '0.65rem', background: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0', padding: '2px 8px', borderRadius: 999, fontWeight: 700 }}>
                  ACTIVE (WAL)
                </span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Local file-based embedded SQL storage (`tractor_record.db`)
              </div>
            </div>
          </div>
          <button onClick={onClose} className="sheet-close-btn">
            <X style={{ width: 18, height: 18 }} />
          </button>
        </div>

        {/* Live Status Card */}
        <div style={{
          marginTop: 14,
          padding: 14,
          borderRadius: 14,
          background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
          border: '1px solid #bbf7d0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <CheckCircle2 style={{ width: 22, height: 22, color: '#16a34a' }} />
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#14532d' }}>
                Persistent Local SQLite Engine Active
              </div>
              <div style={{ fontSize: '0.72rem', color: '#15803d' }}>
                Write-Ahead Logging (WAL) enabled for rapid concurrent transactions
              </div>
            </div>
          </div>

          <button
            onClick={handleManualRefresh}
            disabled={loading}
            style={{
              padding: '6px 12px',
              borderRadius: 8,
              background: '#ffffff',
              border: '1px solid #86efac',
              color: '#15803d',
              fontSize: '0.72rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}
          >
            <RefreshCw style={{ width: 12, height: 12, animation: loading ? 'spin 1s linear infinite' : 'none' }} />
            <span>Sync</span>
          </button>
        </div>

        {refreshNote && (
          <div style={{ marginTop: 8, padding: '6px 12px', borderRadius: 8, background: '#dcfce7', color: '#15803d', fontSize: '0.75rem', fontWeight: 600, textAlign: 'center' }}>
            ✓ {refreshNote}
          </div>
        )}

        {/* Database Metrics Grid */}
        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: 8, letterSpacing: '0.05em' }}>
            Live Table Statistics
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            <div style={{ padding: 12, borderRadius: 12, background: '#f8fafc', border: '1px solid #e2e8f0', textAlign: 'center' }}>
              <Users style={{ width: 18, height: 18, color: '#2563eb', margin: '0 auto 4px' }} />
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                {stats ? stats.customersCount : '...'}
              </div>
              <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600 }}>Farmer Accounts</div>
            </div>

            <div style={{ padding: 12, borderRadius: 12, background: '#f8fafc', border: '1px solid #e2e8f0', textAlign: 'center' }}>
              <Tractor style={{ width: 18, height: 18, color: '#059669', margin: '0 auto 4px' }} />
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                {stats ? stats.machinesCount : '...'}
              </div>
              <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600 }}>Fleet Machines</div>
            </div>

            <div style={{ padding: 12, borderRadius: 12, background: '#f8fafc', border: '1px solid #e2e8f0', textAlign: 'center' }}>
              <Layers style={{ width: 18, height: 18, color: '#d97706', margin: '0 auto 4px' }} />
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                {stats ? stats.jobsCount : '...'}
              </div>
              <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600 }}>Field Jobs</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 10 }}>
            <div style={{ padding: 10, borderRadius: 12, background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 10 }}>
              <Fuel style={{ width: 18, height: 18, color: '#dc2626' }} />
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                  {stats ? stats.dieselCount : '...'} Slips
                </div>
                <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Diesel Logs</div>
              </div>
            </div>

            <div style={{ padding: 10, borderRadius: 12, background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 10 }}>
              <HardDrive style={{ width: 18, height: 18, color: '#7c3aed' }} />
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                  {stats ? `${stats.fileSizeKb} KB` : '...'}
                </div>
                <div style={{ fontSize: '0.68rem', color: '#64748b' }}>tractor_record.db</div>
              </div>
            </div>
          </div>
        </div>

        {/* Database File Details */}
        <div style={{ marginTop: 16, padding: 12, borderRadius: 12, background: '#f8fafc', border: '1px solid #e2e8f0', fontSize: '0.75rem' }}>
          <div style={{ fontWeight: 700, color: '#334155', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
            <FileText style={{ width: 14, height: 14, color: '#64748b' }} />
            <span>Storage Path & Schema</span>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#475569', wordBreak: 'break-all', background: '#ffffff', padding: '6px 8px', borderRadius: 6, border: '1px solid #cbd5e1' }}>
            {stats?.path || 'project-root/tractor_record.db'}
          </div>
          <div style={{ color: '#64748b', fontSize: '0.72rem', marginTop: 6 }}>
            Engine: <strong>better-sqlite3</strong> • WAL Mode: <strong>Enabled</strong> • Auto-seeding on fresh start
          </div>
        </div>

        {/* Cloud Sync Option */}
        <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1e293b' }}>
              Supabase Cloud Sync
            </div>
            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
              Optionally sync local SQLite data with Supabase PostgreSQL cloud
            </div>
          </div>
          
          <button
            onClick={() => {
              onClose();
              if (onOpenSupabaseConfig) onOpenSupabaseConfig();
            }}
            style={{
              padding: '6px 12px',
              borderRadius: 8,
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              color: '#2563eb',
              fontSize: '0.72rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}
          >
            <CloudUpload style={{ width: 13, height: 13 }} />
            <span>Configure Cloud</span>
          </button>
        </div>

      </div>
    </div>
  );
}
