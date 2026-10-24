'use client';

import React, { useState } from 'react';
import { 
  X, 
  Tractor, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  Wrench, 
  Fuel, 
  Clock, 
  FileText, 
  UserCheck,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const MACHINE_PRESETS = [
  { name: 'Mahindra 575 DI (Sarpanch)', hp: '50 HP', fuelCapacity: 65, burnRate: 4.5, defaultImplement: 'Rotavator (Shaktiman 7ft)' },
  { name: 'Swaraj 855 FE Power Steering', hp: '52 HP', fuelCapacity: 60, burnRate: 4.8, defaultImplement: 'Laser Land Leveler' },
  { name: 'John Deere 5050D GearPro', hp: '50 HP', fuelCapacity: 60, burnRate: 4.4, defaultImplement: 'Super Seeder' },
  { name: 'Sonalika DI 745 III Sikander', hp: '50 HP', fuelCapacity: 55, burnRate: 4.2, defaultImplement: 'Cultivator 9-Tine' },
  { name: 'JCB 3DX Super EcoXcellence', hp: '76 HP Heavy', fuelCapacity: 120, burnRate: 8.5, defaultImplement: 'Backhoe Heavy Shovel' },
  { name: 'Preet 987 Crop Harvester', hp: '101 HP', fuelCapacity: 140, burnRate: 11.2, defaultImplement: 'Paddy Cutter Bar' },
];

export default function AddMachineModal({ isOpen, onClose, onSaveMachine, drivers = [] }) {
  const { language, t } = useLanguage();

  const [name, setName] = useState('');
  const [regNo, setRegNo] = useState('');
  const [hp, setHp] = useState('50 HP');
  const [currentMeter, setCurrentMeter] = useState(0);
  const [fuelCapacity, setFuelCapacity] = useState(60);
  const [fuelLevel, setFuelLevel] = useState(40);
  const [activeImplement, setActiveImplement] = useState('Rotavator (Shaktiman 7ft)');
  const [assignedDriver, setAssignedDriver] = useState(drivers[0]?.name || 'Sukhwinder Singh');
  const [serviceInterval, setServiceInterval] = useState(250);
  const [serviceHoursLeft, setServiceHoursLeft] = useState(250);
  const [hourlyBurnRate, setHourlyBurnRate] = useState(4.5);
  const [insuranceExpiry, setInsuranceExpiry] = useState('2027-11-20');
  const [rcExpiry, setRcExpiry] = useState('2032-05-15');
  const [pucExpiry, setPucExpiry] = useState('2027-04-10');
  const [fitnessExpiry, setFitnessExpiry] = useState('2028-08-30');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleApplyPreset = (preset) => {
    setName(preset.name);
    setHp(preset.hp);
    setFuelCapacity(preset.fuelCapacity);
    setFuelLevel(Math.round(preset.fuelCapacity * 0.7));
    setHourlyBurnRate(preset.burnRate);
    setActiveImplement(preset.defaultImplement);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError(language === 'hi' ? 'कृपया मशीन का नाम दर्ज करें' : 'Please enter machine name');
      return;
    }
    if (!regNo.trim()) {
      setError(language === 'hi' ? 'कृपया वाहन पंजीकरण नंबर दर्ज करें' : 'Please enter registration number');
      return;
    }

    setLoading(true);

    const newMachine = {
      id: `m-${Date.now()}`,
      name: name.trim(),
      regNo: regNo.trim().toUpperCase(),
      hp: hp.trim(),
      assignedDriver: assignedDriver || 'Unassigned',
      currentMeter: parseFloat(currentMeter) || 0,
      fuelCapacity: parseFloat(fuelCapacity) || 60,
      fuelLevel: parseFloat(fuelLevel) || 30,
      activeImplement: activeImplement || 'None',
      status: 'Active',
      serviceHoursLeft: parseFloat(serviceHoursLeft) || 250,
      serviceInterval: parseFloat(serviceInterval) || 250,
      dailyHours: 0,
      hourlyBurnRate: parseFloat(hourlyBurnRate) || 4.5,
      expectedBurnRate: parseFloat(hourlyBurnRate) || 4.5,
      rcExpiry: rcExpiry || '2030-01-01',
      insuranceExpiry: insuranceExpiry || '2027-01-01',
      pucExpiry: pucExpiry || '2027-01-01',
      fitnessExpiry: fitnessExpiry || '2028-01-01',
    };

    onSaveMachine(newMachine);
    setSuccessMsg(language === 'hi' ? 'मशीन सफलतापूर्वक जोड़ दी गई!' : 'Machine successfully added to fleet!');

    setTimeout(() => {
      setLoading(false);
      onClose();
    }, 700);
  };

  return (
    <div className="app-modal-overlay" onClick={onClose}>
      <div 
        className="app-modal-sheet" 
        style={{ maxWidth: 560 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-sheet-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Tractor style={{ width: 22, height: 22 }} />
            </div>
            <div>
              <div className="modal-sheet-title">
                {language === 'hi' ? 'नई मशीन / ट्रैक्टर दर्ज करें' : 'Register New Machinery'}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                {language === 'hi' ? 'फ्लीट, मीटर और दस्तावेजों का विवरण भरें' : 'Add Tractor, JCB, or Harvester to fleet manager'}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="sheet-close-btn">
            <X style={{ width: 18, height: 18 }} />
          </button>
        </div>

        {/* 1-Click Common Presets Strip */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Sparkles style={{ width: 13, height: 13, color: '#2563eb' }} />
            <span>{language === 'hi' ? 'त्वरित प्रीसेट (1-क्लिक से भरें):' : 'Quick Models (1-Click Fill):'}</span>
          </div>
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 6 }}>
            {MACHINE_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                style={{
                  padding: '6px 10px',
                  borderRadius: 999,
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: '#1e293b',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                <span>🚜</span>
                <span>{preset.name.split(' ')[0]} {preset.name.split(' ')[1] || ''}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>
                {language === 'hi' ? 'मशीन / मॉडल का नाम *' : 'Machine / Model Name *'}
              </label>
              <input
                type="text"
                placeholder="e.g. Mahindra 575 DI (Sarpanch)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 10, background: '#f8fafc', border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none' }}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>
                {language === 'hi' ? 'वाहन पंजीकरण नंबर *' : 'Vehicle Reg. No (RC) *'}
              </label>
              <input
                type="text"
                placeholder="e.g. MP-04-AB-4892"
                value={regNo}
                onChange={(e) => setRegNo(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 10, background: '#f8fafc', border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none', textTransform: 'uppercase' }}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>
                {language === 'hi' ? 'हॉर्सपावर (HP)' : 'Engine Power (HP)'}
              </label>
              <input
                type="text"
                placeholder="50 HP"
                value={hp}
                onChange={(e) => setHp(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 10, background: '#f8fafc', border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>
                {language === 'hi' ? 'प्रारंभिक मीटर (hrs)' : 'Start Hour Meter'}
              </label>
              <input
                type="number"
                step="0.1"
                placeholder="0.0"
                value={currentMeter}
                onChange={(e) => setCurrentMeter(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 10, background: '#f8fafc', border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>
                {language === 'hi' ? 'डीजल टंकी क्षमता (L)' : 'Tank Capacity (L)'}
              </label>
              <input
                type="number"
                placeholder="60"
                value={fuelCapacity}
                onChange={(e) => setFuelCapacity(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 10, background: '#f8fafc', border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>
                {language === 'hi' ? 'डिफ़ॉल्ट यंत्र (Implement)' : 'Default Implement'}
              </label>
              <select
                value={activeImplement}
                onChange={(e) => setActiveImplement(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 10, background: '#f8fafc', border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none' }}
              >
                <option value="Rotavator (Shaktiman 7ft)">Rotavator (Shaktiman 7ft)</option>
                <option value="Laser Land Leveler">Laser Land Leveler</option>
                <option value="Super Seeder (Fieldking 8ft)">Super Seeder (Fieldking 8ft)</option>
                <option value="Cultivator (9-Tine Heavy)">Cultivator (9-Tine Heavy)</option>
                <option value="Disc Harrow (16-Disc)">Disc Harrow (16-Disc)</option>
                <option value="Tipping Trolley (Hydraulic)">Tipping Trolley (Hydraulic)</option>
                <option value="Backhoe Heavy Shovel">Backhoe Heavy Shovel (JCB)</option>
                <option value="Paddy Harvester Cutter">Paddy Harvester Cutter</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>
                {language === 'hi' ? 'नियत ड्राइवर (Assigned Driver)' : 'Assigned Driver'}
              </label>
              <select
                value={assignedDriver}
                onChange={(e) => setAssignedDriver(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 10, background: '#f8fafc', border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none' }}
              >
                <option value="Sukhwinder Singh">Sukhwinder Singh</option>
                <option value="Mukesh Gurjar">Mukesh Gurjar</option>
                <option value="Ramvilas Yadav">Ramvilas Yadav</option>
                <option value="Self / Owner Operated">Self / Owner Operated</option>
              </select>
            </div>
          </div>

          {/* Document Dates */}
          <div style={{ padding: 12, borderRadius: 14, background: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 5 }}>
              <FileText style={{ width: 13, height: 13, color: '#2563eb' }} />
              <span>{language === 'hi' ? 'दस्तावेज़ समाप्ति तिथियां (Document Expiry):' : 'Document Vault Expiries:'}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <label style={{ fontSize: '0.7rem', color: '#64748b', display: 'block', marginBottom: 2 }}>
                  {language === 'hi' ? 'बीमा समाप्ति (Insurance Expiry)' : 'Insurance Expiry'}
                </label>
                <input
                  type="date"
                  value={insuranceExpiry}
                  onChange={(e) => setInsuranceExpiry(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 8, background: '#ffffff', border: '1px solid #cbd5e1', fontSize: '0.78rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.7rem', color: '#64748b', display: 'block', marginBottom: 2 }}>
                  {language === 'hi' ? 'आरसी समाप्ति (RC Expiry)' : 'RC Valid Upto'}
                </label>
                <input
                  type="date"
                  value={rcExpiry}
                  onChange={(e) => setRcExpiry(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 8, background: '#ffffff', border: '1px solid #cbd5e1', fontSize: '0.78rem' }}
                />
              </div>
            </div>
          </div>

          {error && (
            <div style={{ padding: 10, borderRadius: 10, background: '#fef2f2', border: '1px solid #fecaca', fontSize: '0.78rem', color: '#dc2626', display: 'flex', alignItems: 'center', gap: 6 }}>
              <AlertCircle style={{ width: 14, height: 14 }} />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div style={{ padding: 10, borderRadius: 10, background: '#ecfdf5', border: '1px solid #a7f3d0', fontSize: '0.78rem', color: '#059669', display: 'flex', alignItems: 'center', gap: 6 }}>
              <CheckCircle2 style={{ width: 14, height: 14 }} />
              <span>{successMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-full-action"
            style={{ marginTop: 6 }}
          >
            <Plus style={{ width: 18, height: 18 }} />
            <span>{loading ? (language === 'hi' ? 'मशीन जोड़ी जा रही है...' : 'Saving Machine...') : (language === 'hi' ? 'मशीन फ्लीट में शामिल करें' : 'Add Machine to Fleet')}</span>
          </button>
        </form>

      </div>
    </div>
  );
}
