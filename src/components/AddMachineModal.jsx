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

export default function AddMachineModal({ isOpen, onClose, onSaveMachine, drivers = [], onAddDriver }) {
  const { language, t } = useLanguage();

  const [machineType, setMachineType] = useState('Tractor');
  const [name, setName] = useState('');
  const [regNo, setRegNo] = useState('');
  const [hp, setHp] = useState('50 HP');
  const [currentMeter, setCurrentMeter] = useState(0);
  const [fuelCapacity, setFuelCapacity] = useState(60);
  const [fuelLevel, setFuelLevel] = useState(30);
  const [activeImplement, setActiveImplement] = useState('Rotavator (Shaktiman 7ft)');
  const [assignedDriver, setAssignedDriver] = useState(drivers[0]?.name || 'Self / Owner Operated');
  const [serviceInterval, setServiceInterval] = useState(250);
  const [serviceHoursLeft, setServiceHoursLeft] = useState(250);
  const [hourlyBurnRate, setHourlyBurnRate] = useState(4.5);
  const [insuranceExpiry, setInsuranceExpiry] = useState('2027-11-20');
  const [rcExpiry, setRcExpiry] = useState('2032-05-15');
  const [pucExpiry, setPucExpiry] = useState('2027-04-10');
  const [fitnessExpiry, setFitnessExpiry] = useState('2028-08-30');

  // Inline Driver Creation State
  const [isAddingDriver, setIsAddingDriver] = useState(false);
  const [newDriverName, setNewDriverName] = useState('');
  const [newDriverPhone, setNewDriverPhone] = useState('');
  const [driverError, setDriverError] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSelectType = (type) => {
    setMachineType(type);
    if (type === 'JCB / Excavator') {
      setHp('76 HP');
      setFuelCapacity(120);
      setHourlyBurnRate(8.0);
      setActiveImplement('Backhoe Heavy Shovel');
    } else if (type === 'Harvester') {
      setHp('101 HP');
      setFuelCapacity(140);
      setHourlyBurnRate(11.0);
      setActiveImplement('Paddy Harvester Cutter');
    } else if (type === 'Trolley') {
      setHp('N/A');
      setFuelCapacity(0);
      setHourlyBurnRate(0);
      setActiveImplement('Tipping Trolley (Hydraulic)');
    } else if (type === 'Equipment') {
      setHp('50 HP');
      setFuelCapacity(50);
      setHourlyBurnRate(4.0);
    } else {
      setHp('50 HP');
      setFuelCapacity(60);
      setHourlyBurnRate(4.5);
      setActiveImplement('Rotavator (Shaktiman 7ft)');
    }
  };

  const handleQuickAddDriver = (e) => {
    if (e) e.preventDefault();
    setDriverError('');
    if (!newDriverName.trim()) {
      setDriverError(language === 'hi' ? 'कृपया ड्राइवर का नाम दर्ज करें' : 'Please enter driver name');
      return;
    }

    const created = {
      id: `drv-${Date.now()}`,
      name: newDriverName.trim(),
      phone: newDriverPhone.trim() || '',
      assignedMachine: name.trim() || 'Unassigned',
      shiftStatus: 'Active',
      bhattaBalance: 0
    };

    if (onAddDriver) {
      onAddDriver(created);
    }

    setAssignedDriver(created.name);
    setIsAddingDriver(false);
    setNewDriverName('');
    setNewDriverPhone('');
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
      assignedDriver: assignedDriver || 'Self / Owner Operated',
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
                {language === 'hi' ? 'नई मशीन / फ्लीट दर्ज करें' : 'Register New Machinery'}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                {language === 'hi' ? 'ट्रैक्टर, जेसीबी, हार्वेस्टर या अन्य मशीन जोड़ें' : 'Add Tractor, JCB, Harvester or any machinery to fleet'}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="sheet-close-btn">
            <X style={{ width: 18, height: 18 }} />
          </button>
        </div>

        {/* Machinery Type Filter Strip */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Sparkles style={{ width: 13, height: 13, color: '#2563eb' }} />
            <span>{language === 'hi' ? 'मशीनरी का प्रकार:' : 'Machinery Category:'}</span>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {[
              { type: 'Tractor', icon: '🚜', label: 'Tractor' },
              { type: 'JCB / Excavator', icon: '🏗️', label: 'JCB / Excavator' },
              { type: 'Harvester', icon: '🌾', label: 'Harvester' },
              { type: 'Trolley', icon: '🚚', label: 'Trolley / Tipper' },
              { type: 'Equipment', icon: '⚙️', label: 'Other Equipment' }
            ].map((cat) => (
              <button
                key={cat.type}
                type="button"
                onClick={() => handleSelectType(cat.type)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 999,
                  background: machineType === cat.type ? '#eff6ff' : '#f8fafc',
                  border: machineType === cat.type ? '1.5px solid #2563eb' : '1px solid #cbd5e1',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  color: machineType === cat.type ? '#1d4ed8' : '#334155',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5
                }}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
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
                placeholder={language === 'hi' ? 'मशीन का नाम' : 'Machine / Model Name'}
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
                placeholder={language === 'hi' ? 'गाड़ी नंबर' : 'Registration Number'}
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
                <option value="None / Custom Implement">None / Custom Implement</option>
              </select>
            </div>

            {/* Assigned Driver with Quick Add */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', display: 'block' }}>
                  {language === 'hi' ? 'नियत ड्राइवर' : 'Assigned Driver'}
                </label>
                <button
                  type="button"
                  onClick={() => setIsAddingDriver(!isAddingDriver)}
                  style={{
                    background: isAddingDriver ? '#fee2e2' : '#eff6ff',
                    border: isAddingDriver ? '1px solid #fecaca' : '1px solid #bfdbfe',
                    color: isAddingDriver ? '#dc2626' : '#2563eb',
                    borderRadius: 6,
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 3,
                    padding: '2px 7px'
                  }}
                >
                  {isAddingDriver ? <X style={{ width: 11, height: 11 }} /> : <Plus style={{ width: 11, height: 11 }} />}
                  <span>{isAddingDriver ? 'Cancel' : '+ Add Driver'}</span>
                </button>
              </div>

              <select
                value={assignedDriver}
                onChange={(e) => {
                  if (e.target.value === '__add_driver__') {
                    setIsAddingDriver(true);
                  } else {
                    setAssignedDriver(e.target.value);
                  }
                }}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 10, background: '#f8fafc', border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none' }}
              >
                <option value="Self / Owner Operated">Self / Owner Operated</option>
                {drivers.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name} {d.phone ? `(${d.phone})` : ''}
                  </option>
                ))}
                <option value="__add_driver__" style={{ color: '#2563eb', fontWeight: 700 }}>
                  ➕ + Add New Driver...
                </option>
              </select>
            </div>
          </div>

          {/* Inline Add Driver Box */}
          {isAddingDriver && (
            <div style={{
              padding: 12,
              borderRadius: 12,
              background: '#f8fafc',
              border: '1.5px dashed #3b82f6',
              boxShadow: '0 2px 8px rgba(37, 99, 235, 0.08)'
            }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1e40af', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                <UserCheck style={{ width: 14, height: 14 }} />
                <span>{language === 'hi' ? 'नया ड्राइवर जोड़ें' : 'Register New Driver'}</span>
              </div>

              {driverError && (
                <div style={{ fontSize: '0.72rem', color: '#dc2626', marginBottom: 6, fontWeight: 600 }}>
                  {driverError}
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
                <input
                  type="text"
                  placeholder={language === 'hi' ? 'ड्राइवर का नाम' : 'Driver Name'}
                  value={newDriverName}
                  onChange={(e) => setNewDriverName(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.8rem', background: '#ffffff', outline: 'none' }}
                  autoFocus
                />
                <input
                  type="tel"
                  placeholder={language === 'hi' ? 'मोबाइल नंबर' : 'Phone Number'}
                  value={newDriverPhone}
                  onChange={(e) => setNewDriverPhone(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.8rem', background: '#ffffff', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  type="button"
                  onClick={handleQuickAddDriver}
                  style={{
                    flex: 1,
                    padding: '7px 12px',
                    borderRadius: 8,
                    background: '#2563eb',
                    color: '#ffffff',
                    border: 'none',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {language === 'hi' ? 'ड्राइवर सहेजें व चुनें' : 'Save & Select Driver'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingDriver(false)}
                  style={{
                    padding: '7px 12px',
                    borderRadius: 8,
                    background: '#e2e8f0',
                    color: '#475569',
                    border: 'none',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

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
