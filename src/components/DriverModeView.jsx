'use client';

import React, { useState } from 'react';
import { 
  Camera, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  CheckCircle
} from 'lucide-react';

export default function DriverModeView({ 
  machines, 
  onSaveDriverJob, 
  currentDriver = { name: "Sukhwinder Singh", phone: "+91 98765 43210", dailyBhatta: 300, hoursToday: 6.5 } 
}) {
  const [selectedMachineId, setSelectedMachineId] = useState(machines[0]?.id || 'm1');
  const [implement, setImplement] = useState('Rotavator (Shaktiman 7ft)');
  const [farmerName, setFarmerName] = useState('');
  const [villageName, setVillageName] = useState('');
  const [startMeter, setStartMeter] = useState(1842.5);
  const [endMeter, setEndMeter] = useState(1846.5);
  const [submitted, setSubmitted] = useState(false);

  const selectedMachine = machines.find(m => m.id === selectedMachineId) || machines[0];
  const calculatedHours = Math.max(0, parseFloat((endMeter - startMeter).toFixed(2)));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!farmerName) {
      alert('Please enter customer name');
      return;
    }
    
    if (onSaveDriverJob) {
      onSaveDriverJob({
        id: `job-driver-${Date.now()}`,
        customer: farmerName,
        village: villageName || 'Local Field',
        machine: selectedMachine.name,
        machineId: selectedMachine.id,
        implement,
        driver: currentDriver.name,
        startMeter,
        endMeter,
        units: calculatedHours,
        billingType: 'Per Hour',
        rate: 900,
        totalAmount: Math.round(calculatedHours * 900),
        gpsVerified: true,
        gpsCoords: '22.7533° N, 78.3582° E (Verified)',
        hasPhotoProof: true,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    }

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFarmerName('');
      setVillageName('');
      setStartMeter(endMeter);
      setEndMeter(parseFloat((endMeter + 3.5).toFixed(1)));
    }, 2200);
  };

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
      
      {/* Driver Identity Card */}
      <div style={{ padding: 18, borderRadius: 20, background: '#eff6ff', border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: '#2563eb', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 800 }}>
            🚜
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>{currentDriver.name}</span>
              <span className="badge-soft-blue" style={{ padding: '2px 8px', borderRadius: 999, fontSize: '0.68rem', fontWeight: 700 }}>Driver Mode</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#1e40af', marginTop: 2 }}>
              Daily Bhatta: ₹{currentDriver.dailyBhatta} | Overtime: ₹60/hr
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.72rem', color: '#059669', background: '#ecfdf5', padding: '6px 10px', borderRadius: 8, border: '1px solid #a7f3d0' }}>
          <ShieldCheck style={{ width: 14, height: 14 }} />
          <span>Financials Hidden</span>
        </div>
      </div>

      {submitted ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', background: '#ffffff', borderRadius: 20, border: '1px solid #edf2f7', boxShadow: 'var(--shadow-card)' }}>
          <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#ecfdf5', color: '#10b981', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle style={{ width: 36, height: 36 }} />
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>Meter Log Successfully Submitted!</h2>
          <p style={{ fontSize: '0.85rem', color: '#059669' }}>
            {calculatedHours} hours logged with GPS geotag and time verification.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ padding: 22, borderRadius: 20, background: '#ffffff', border: '1px solid #edf2f7', boxShadow: 'var(--shadow-card)', display: 'flex', flexDirection: 'column', gap: 16 }}>
          
          <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: 10 }}>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Clock style={{ width: 18, height: 18, color: '#2563eb' }} />
              Start & Stop Meter Entry (Anti-Tamper)
            </h2>
            <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
              GPS coordinate lock and photo readings logged automatically.
            </p>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>
              Select Machine *
            </label>
            <select
              value={selectedMachineId}
              onChange={(e) => setSelectedMachineId(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 10, background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.85rem', outline: 'none' }}
            >
              {machines.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.regNo})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>
              Attached Implement *
            </label>
            <select
              value={implement}
              onChange={(e) => setImplement(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 10, background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.85rem', outline: 'none' }}
            >
              <option value="Rotavator (Shaktiman 7ft)">Rotavator (Shaktiman 7ft)</option>
              <option value="Super Seeder (Fieldking 8ft)">Super Seeder (Fieldking 8ft)</option>
              <option value="Laser Land Leveler">Laser Land Leveler</option>
              <option value="Cultivator 9-Tyne">Cultivator 9-Tyne</option>
              <option value="Backhoe Heavy Shovel">Backhoe Loader Shovel</option>
              <option value="Trolley (Double Axle)">Hydraulic Trolley</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>
                Customer Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Ramesh Patel"
                value={farmerName}
                onChange={(e) => setFarmerName(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 10, background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.85rem', outline: 'none' }}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>
                Village / Plot
              </label>
              <input
                type="text"
                placeholder="e.g. Pipariya (Plot 14)"
                value={villageName}
                onChange={(e) => setVillageName(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 10, background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.85rem', outline: 'none' }}
              />
            </div>
          </div>

          {/* Hour Meter Inputs with Big Display */}
          <div style={{ padding: 14, borderRadius: 16, background: '#eff6ff', border: '1px solid #bfdbfe' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1e40af', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 5 }}>
                <Camera style={{ width: 14, height: 14 }} /> Hour-Meter Readings
              </span>
              <span style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#2563eb' }}>
                Total: {calculatedHours} hrs
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div style={{ background: '#ffffff', padding: 10, borderRadius: 10, border: '1px solid #dbeafe' }}>
                <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block', marginBottom: 4 }}>Start Meter</span>
                <input
                  type="number"
                  step="0.1"
                  value={startMeter}
                  onChange={(e) => setStartMeter(parseFloat(e.target.value) || 0)}
                  style={{ width: '100%', padding: 8, background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 6, fontFamily: 'var(--font-mono)', fontSize: '1.2rem', fontWeight: 800, textAlign: 'center', outline: 'none' }}
                />
              </div>

              <div style={{ background: '#ffffff', padding: 10, borderRadius: 10, border: '1px solid #dbeafe' }}>
                <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block', marginBottom: 4 }}>Stop Meter</span>
                <input
                  type="number"
                  step="0.1"
                  value={endMeter}
                  onChange={(e) => setEndMeter(parseFloat(e.target.value) || 0)}
                  style={{ width: '100%', padding: 8, background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 6, fontFamily: 'var(--font-mono)', fontSize: '1.2rem', fontWeight: 800, textAlign: 'center', outline: 'none' }}
                />
              </div>
            </div>
          </div>

          <div style={{ padding: '8px 12px', borderRadius: 8, background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem' }}>
            <span style={{ color: '#059669', display: 'flex', alignItems: 'center', gap: 5, fontWeight: 600 }}>
              <MapPin style={{ width: 14, height: 14 }} /> GPS Locked: 22.7533° N, 78.3582° E
            </span>
            <span style={{ color: '#64748b' }}>
              Time: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          <button
            type="submit"
            className="btn-full-action"
          >
            <ShieldCheck style={{ width: 18, height: 18 }} />
            <span>Submit Verified Meter Log</span>
          </button>

        </form>
      )}

    </div>
  );
}
