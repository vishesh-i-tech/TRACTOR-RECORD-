'use client';

import React, { useState } from 'react';
import { 
  X, 
  CheckCircle,
  PlusCircle,
  Tractor,
  Layers
} from 'lucide-react';

export default function AddJobModal({ 
  isOpen, 
  onClose, 
  machines, 
  customers, 
  drivers, 
  onSaveJob 
}) {
  const [customerId, setCustomerId] = useState(customers[0]?.id || 'c1');
  const [machineId, setMachineId] = useState(machines[0]?.id || 'm1');
  const [driverName, setDriverName] = useState(drivers[0]?.name || 'Sukhwinder Singh');
  const [implement, setImplement] = useState('Rotavator (Shaktiman 7ft)');
  const [billingType, setBillingType] = useState('Per Hour');
  const [rate, setRate] = useState(900);
  const [units, setUnits] = useState(4.0);
  const [startMeter, setStartMeter] = useState(1842.5);
  const [endMeter, setEndMeter] = useState(1846.5);
  const [fieldLocation, setFieldLocation] = useState('North Farm (Khasra #142)');

  if (!isOpen) return null;

  const selectedCustomer = customers.find(c => c.id === customerId) || customers[0];
  const selectedMachine = machines.find(m => m.id === machineId) || machines[0];
  const totalAmount = Math.round(rate * units);

  const handleUnitChange = (val) => {
    const u = parseFloat(val) || 0;
    setUnits(u);
    if (billingType === 'Per Hour') {
      setEndMeter(parseFloat((startMeter + u).toFixed(1)));
    }
  };

  const handleBillingTypeChange = (type) => {
    setBillingType(type);
    if (type === 'Per Hour') setRate(900);
    else if (type === 'Per Acre') setRate(1400);
    else if (type === 'Per Trip') setRate(600);
    else setRate(2500);
  };

  const setPresetHours = (h) => {
    handleUnitChange(h);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSaveJob) {
      onSaveJob({
        id: `job-${Date.now()}`,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        customer: selectedCustomer.name,
        customerId: selectedCustomer.id,
        machine: selectedMachine.name,
        machineId: selectedMachine.id,
        driver: driverName,
        implement,
        billingType,
        rate: parseFloat(rate),
        units: parseFloat(units),
        totalAmount,
        startMeter: parseFloat(startMeter),
        endMeter: parseFloat(endMeter),
        fieldLocation,
        gpsVerified: true,
        gpsCoords: "22.7533° N, 78.3582° E",
        hasPhotoProof: true,
        isPaid: false,
        signatureVerified: true,
      });
    }
    onClose();
  };

  return (
    <div className="app-modal-overlay" onClick={onClose}>
      <div 
        className="app-modal-sheet"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-sheet-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <PlusCircle style={{ width: 22, height: 22 }} />
            </div>
            <div>
              <div className="modal-sheet-title">Record Field Operation</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Log hours, implements, and auto-calculate invoice</div>
            </div>
          </div>
          <button onClick={onClose} className="sheet-close-btn">
            <X style={{ width: 18, height: 18 }} />
          </button>
        </div>

        {/* Big Amount Card matching reference "Transfer Amount" */}
        <div style={{ background: '#f8fafc', borderRadius: 20, padding: '20px 16px', border: '1px solid #e2e8f0', textAlign: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Total Billed Amount</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-mono)', lineHeight: 1.2 }}>
            ₹{totalAmount.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600, marginTop: 4 }}>
            {units} {billingType === 'Per Hour' ? 'Hours' : 'Acres'} @ ₹{rate}/{billingType === 'Per Hour' ? 'hr' : 'acre'}
          </div>
        </div>

        {/* Preset Chips matching reference */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 20 }}>
          {[2, 3.5, 4, 6, 8].map((h) => (
            <button
              key={h}
              type="button"
              onClick={() => setPresetHours(h)}
              className={`amount-chip-btn ${units === h ? 'active' : ''}`}
            >
              {h} hrs
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>Customer (Farmer) *</label>
              <select
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 10, background: '#ffffff', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.8rem', outline: 'none' }}
              >
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.village})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>Machine (Tractor/JCB) *</label>
              <select
                value={machineId}
                onChange={(e) => setMachineId(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 10, background: '#ffffff', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.8rem', outline: 'none' }}
              >
                {machines.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>Implement *</label>
              <select
                value={implement}
                onChange={(e) => setImplement(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 10, background: '#ffffff', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.8rem', outline: 'none' }}
              >
                <option value="Rotavator (Shaktiman 7ft)">Rotavator (Shaktiman 7ft)</option>
                <option value="Super Seeder (Fieldking 8ft)">Super Seeder (Fieldking 8ft)</option>
                <option value="Laser Land Leveler">Laser Land Leveler</option>
                <option value="Cultivator 9-Tyne">Cultivator 9-Tyne</option>
                <option value="Backhoe Heavy Shovel">Backhoe Loader Shovel</option>
                <option value="Trolley (Double Axle)">Hydraulic Trolley</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>Billing Unit</label>
              <select
                value={billingType}
                onChange={(e) => handleBillingTypeChange(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 10, background: '#ffffff', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.8rem', outline: 'none' }}
              >
                <option value="Per Hour">Per Hour (₹900)</option>
                <option value="Per Acre">Per Acre (₹1,400)</option>
                <option value="Per Trip">Per Trip (₹600)</option>
                <option value="Flat Rate">Flat Rate</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>Start Meter Reading</label>
              <input
                type="number"
                step="0.1"
                value={startMeter}
                onChange={(e) => setStartMeter(parseFloat(e.target.value) || 0)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 10, background: '#ffffff', border: '1px solid #cbd5e1', color: '#0f172a', fontFamily: 'var(--font-mono)', fontSize: '0.9rem', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>Stop Meter Reading</label>
              <input
                type="number"
                step="0.1"
                value={endMeter}
                onChange={(e) => setEndMeter(parseFloat(e.target.value) || 0)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 10, background: '#ffffff', border: '1px solid #cbd5e1', color: '#0f172a', fontFamily: 'var(--font-mono)', fontSize: '0.9rem', outline: 'none' }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>Field Location / Plot</label>
            <input
              type="text"
              value={fieldLocation}
              onChange={(e) => setFieldLocation(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 10, background: '#ffffff', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.85rem', outline: 'none' }}
            />
          </div>

          <button
            type="submit"
            className="btn-full-action"
            style={{ marginTop: 8 }}
          >
            <CheckCircle style={{ width: 18, height: 18 }} />
            <span>Confirm & Record Operation</span>
          </button>

        </form>
      </div>
    </div>
  );
}
