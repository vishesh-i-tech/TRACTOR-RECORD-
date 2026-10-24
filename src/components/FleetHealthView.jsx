'use client';

import React from 'react';
import { 
  Tractor, 
  Wrench, 
  Fuel, 
  Clock, 
  AlertCircle,
  FileCheck2,
  ShieldCheck,
  Plus
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function FleetHealthView({ machines, onAddServiceNote, onOpenAddMachine }) {
  const { language, t } = useLanguage();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      
      {/* Header Banner */}
      <div style={{ padding: '16px 20px', borderRadius: 20, background: '#ffffff', border: '1px solid #edf2f7', boxShadow: 'var(--shadow-card)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Wrench style={{ width: 22, height: 22 }} />
          </div>
          <div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
              {language === 'hi' ? 'मशीनरी स्वास्थ्य व डिजिटल दस्तावेज़ वॉल्ट' : 'Fleet Health & Digital Document Vault'}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
              {language === 'hi' ? 'घंटे-मीटर सर्विस काउंटडाउन, ईंधन दर और दस्तावेज़' : 'Hour-meter service countdowns, tyre life, and official certificate storage'}
            </div>
          </div>
        </div>

        {/* Action Button & Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {/* Prominent Primary Add Machine Button */}
          <button
            onClick={onOpenAddMachine}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 16px',
              borderRadius: 12,
              background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)',
              color: '#ffffff',
              border: 'none',
              fontWeight: 800,
              fontSize: '0.82rem',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
              transition: 'all 0.15s ease'
            }}
          >
            <Plus style={{ width: 16, height: 16 }} />
            <span>{language === 'hi' ? '+ नई मशीन जोड़ें' : '+ Add Machine'}</span>
          </button>

          <span className="badge-soft-amber" style={{ padding: '6px 12px', borderRadius: 999, fontSize: '0.72rem', fontWeight: 700 }}>
            {machines.filter(m => m.serviceHoursLeft <= 20).length || 1} {language === 'hi' ? 'सर्विस बाकी' : 'Service Due'}
          </span>
          <span className="badge-soft-rose" style={{ padding: '6px 12px', borderRadius: 999, fontSize: '0.72rem', fontWeight: 700 }}>
            1 {language === 'hi' ? 'बीमा नवीनीकरण' : 'Insurance Renewal Near'}
          </span>
        </div>
      </div>

      {/* Fleet Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
        {machines.map((machine) => {
          const isOverdue = machine.serviceHoursLeft <= 0;
          const isUrgent = machine.serviceHoursLeft > 0 && machine.serviceHoursLeft <= 20;
          const servicePercent = Math.min(100, Math.max(0, Math.round(((machine.serviceInterval - machine.serviceHoursLeft) / machine.serviceInterval) * 100)));

          return (
            <div 
              key={machine.id}
              style={{
                padding: 18,
                borderRadius: 20,
                background: '#ffffff',
                border: '1px solid #edf2f7',
                boxShadow: 'var(--shadow-card)',
                display: 'flex',
                flexDirection: 'column',
                gap: 12
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: machine.status === 'Active' ? '#ecfdf5' : machine.status === 'Maintenance' ? '#fef2f2' : '#f8fafc', color: machine.status === 'Active' ? '#059669' : machine.status === 'Maintenance' ? '#dc2626' : '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Tractor style={{ width: 22, height: 22 }} />
                  </div>
                  <div>
                    <h3 style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem', lineHeight: 1.2 }}>{machine.name}</h3>
                    <p style={{ fontSize: '0.7rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>{machine.regNo} • {machine.hp}</p>
                  </div>
                </div>

                <span className={
                  machine.status === 'Active' ? 'badge-soft-green' : machine.status === 'Maintenance' ? 'badge-soft-rose' : 'badge-soft-amber'
                } style={{ padding: '3px 9px', borderRadius: 999, fontSize: '0.68rem', fontWeight: 700 }}>
                  {machine.status === 'Active' 
                    ? (language === 'hi' ? 'खेत में सक्रिय' : 'In Field')
                    : machine.status === 'Maintenance' 
                    ? (language === 'hi' ? 'सर्विस पर' : 'In Service')
                    : (language === 'hi' ? 'स्टैंडबाय' : 'Standby')}
                </span>
              </div>

              {/* Meter & Fuel */}
              <div style={{ padding: 12, borderRadius: 14, background: '#f8fafc', border: '1px solid #e2e8f0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <span style={{ fontSize: '0.68rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock style={{ width: 12, height: 12, color: '#2563eb' }} /> {language === 'hi' ? 'घंटा-मीटर:' : 'Hour-Meter:'}
                  </span>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                    {machine.currentMeter.toFixed(1)} <span style={{ fontSize: '0.7rem', color: '#64748b' }}>hrs</span>
                  </div>
                  <span style={{ fontSize: '0.68rem', color: '#10b981', fontWeight: 600 }}>
                    {language === 'hi' ? 'आज:' : 'Today:'} {machine.dailyHours || 0} hrs
                  </span>
                </div>

                <div>
                  <span style={{ fontSize: '0.68rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Fuel style={{ width: 12, height: 12, color: '#f59e0b' }} /> {language === 'hi' ? 'डीजल टंकी:' : 'Diesel Tank:'}
                  </span>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                    {machine.fuelLevel} / {machine.fuelCapacity} <span style={{ fontSize: '0.7rem', color: '#64748b' }}>L</span>
                  </div>
                  <div style={{ width: '100%', height: 5, borderRadius: 999, background: '#e2e8f0', marginTop: 4 }}>
                    <div style={{ width: `${Math.min(100, (machine.fuelLevel / machine.fuelCapacity) * 100)}%`, height: '100%', borderRadius: 999, background: '#f59e0b' }}></div>
                  </div>
                </div>
              </div>

              {/* Implement & Driver */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9', padding: '6px 0' }}>
                <span>{language === 'hi' ? 'यंत्र:' : 'Implement:'} <strong style={{ color: '#0f172a' }}>{machine.activeImplement}</strong></span>
                <span>{language === 'hi' ? 'ड्राइवर:' : 'Driver:'} <strong style={{ color: '#2563eb' }}>{machine.assignedDriver}</strong></span>
              </div>

              {/* Service Interval */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: 4 }}>
                  <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Wrench style={{ width: 13, height: 13, color: '#f59e0b' }} />
                    {language === 'hi' ? '250-घंटे सर्विस शेष:' : '250-Hour Service Due:'}
                  </span>
                  <span style={{ fontWeight: 800, fontFamily: 'var(--font-mono)', color: isOverdue ? '#dc2626' : isUrgent ? '#d97706' : '#059669' }}>
                    {isOverdue 
                      ? (language === 'hi' ? `⚠️ ${Math.abs(machine.serviceHoursLeft)} hrs लेट!` : `⚠️ ${Math.abs(machine.serviceHoursLeft)} hrs Overdue!`)
                      : `${machine.serviceHoursLeft} hrs left`}
                  </span>
                </div>

                <div style={{ width: '100%', height: 6, borderRadius: 999, background: '#e2e8f0', overflow: 'hidden' }}>
                  <div 
                    style={{
                      width: `${servicePercent}%`,
                      height: '100%',
                      borderRadius: 999,
                      background: isOverdue ? '#ef4444' : isUrgent ? '#f59e0b' : '#10b981'
                    }}
                  ></div>
                </div>
              </div>

              {/* Document Vault */}
              <div>
                <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: 6 }}>
                  {language === 'hi' ? 'दस्तावेज़ स्थिति:' : 'Document Vault:'}
                </span>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, fontSize: '0.72rem' }}>
                  <div style={{ padding: '6px 8px', borderRadius: 8, background: '#f8fafc', border: '1px solid #edf2f7', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Insurance</span>
                    <span style={{ color: '#d97706', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{machine.insuranceExpiry}</span>
                  </div>

                  <div style={{ padding: '6px 8px', borderRadius: 8, background: '#f8fafc', border: '1px solid #edf2f7', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>RC</span>
                    <span style={{ color: '#059669', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>Valid</span>
                  </div>

                  <div style={{ padding: '6px 8px', borderRadius: 8, background: '#f8fafc', border: '1px solid #edf2f7', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>PUC</span>
                    <span style={{ color: '#059669', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{machine.pucExpiry}</span>
                  </div>

                  <div style={{ padding: '6px 8px', borderRadius: 8, background: '#f8fafc', border: '1px solid #edf2f7', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Fitness</span>
                    <span style={{ color: '#059669', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>Valid</span>
                  </div>
                </div>
              </div>

            </div>
          );
        })}

        {/* Clickable Card to Register New Machinery */}
        <div
          onClick={onOpenAddMachine}
          style={{
            padding: 24,
            borderRadius: 20,
            background: '#f8fafc',
            border: '2px dashed #cbd5e1',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            cursor: 'pointer',
            minHeight: 220,
            transition: 'all 0.2s ease',
            textAlign: 'center'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#2563eb'; e.currentTarget.style.background = '#eff6ff'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.background = '#f8fafc'; }}
        >
          <div style={{ width: 50, height: 50, borderRadius: '50%', background: '#dbeafe', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Plus style={{ width: 26, height: 26 }} />
          </div>
          <div>
            <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '1rem', marginBottom: 4 }}>
              {language === 'hi' ? '+ नई मशीन या ट्रैक्टर दर्ज करें' : '+ Register New Machinery'}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', maxWidth: 220 }}>
              {language === 'hi' ? 'ट्रैक्टर, जेसीबी, हार्वेस्टर या औजार को अपनी फ्लीट में शामिल करें' : 'Click to add Tractor, JCB, or Harvester to fleet'}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
