'use client';

import React, { useState } from 'react';
import { 
  X, 
  Fuel, 
  Camera, 
  AlertTriangle, 
  CheckCircle2, 
  Receipt
} from 'lucide-react';

export default function AddDieselModal({ 
  isOpen, 
  onClose, 
  machines, 
  onSaveDiesel 
}) {
  const [machineId, setMachineId] = useState(machines[0]?.id || '');
  const [liters, setLiters] = useState(40);
  const [ratePerLiter, setRatePerLiter] = useState(95);
  const [pumpName, setPumpName] = useState('');
  const [meterReading, setMeterReading] = useState(machines[0]?.currentMeter || 0);

  if (!isOpen) return null;

  const selectedMachine = machines.find(m => m.id === machineId) || machines[0] || {
    id: 'm1',
    name: 'Tractor Fleet',
    expectedBurnRate: 4.5,
    fuelCapacity: 60
  };
  const totalCost = Math.round(liters * ratePerLiter);

  const benchmarkRate = selectedMachine?.expectedBurnRate || 4.5;
  const simulatedBurnRate = (liters / 7.5).toFixed(1);
  const isAnomaly = simulatedBurnRate > benchmarkRate * 1.25;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSaveDiesel) {
      onSaveDiesel({
        id: `dsl-${Date.now()}`,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        machine: selectedMachine.name,
        machineId: selectedMachine.id,
        liters: parseFloat(liters),
        pricePerLiter: parseFloat(ratePerLiter),
        totalCost,
        pumpName,
        meterReadingAtFill: parseFloat(meterReading),
        receiptPhoto: true,
        consumptionStatus: isAnomaly 
          ? `⚠️ Anomaly (${simulatedBurnRate} L/hr vs ${benchmarkRate} L/hr benchmark) - Theft Alert` 
          : `Normal (${simulatedBurnRate} L/hr)`,
        anomalyAlert: isAnomaly
      });
    }
    onClose();
  };

  return (
    <div className="app-modal-overlay" onClick={onClose}>
      <div 
        className="app-modal-sheet"
        style={{ maxWidth: 460 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-sheet-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: '#fffbeb', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Fuel style={{ width: 22, height: 22 }} />
            </div>
            <div>
              <div className="modal-sheet-title">Log Fuel Slip & Audit</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Track consumption, cost, and detect siphon theft</div>
            </div>
          </div>
          <button onClick={onClose} className="sheet-close-btn">
            <X style={{ width: 18, height: 18 }} />
          </button>
        </div>

        {/* Big Amount Card */}
        <div style={{ background: '#fffbeb', borderRadius: 20, padding: '18px 16px', border: '1px solid #fef3c7', textAlign: 'center', marginBottom: 18 }}>
          <div style={{ fontSize: '0.75rem', color: '#b45309', fontWeight: 600 }}>Total Fuel Expense</div>
          <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#92400e', fontFamily: 'var(--font-mono)' }}>
            ₹{totalCost.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#d97706', fontWeight: 600, marginTop: 2 }}>
            {liters} Liters @ ₹{ratePerLiter}/L
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>Select Machine *</label>
            <select
              value={machineId}
              onChange={(e) => setMachineId(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 10, background: '#ffffff', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.8rem', outline: 'none' }}
            >
              {machines.length === 0 ? (
                <option value="m1">Tractor Fleet (Benchmark: 4.5 L/hr)</option>
              ) : (
                machines.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} (Benchmark: {m.expectedBurnRate || 4.5} L/hr)
                  </option>
                ))
              )}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>Fuel Quantity (Liters)</label>
              <input
                type="number"
                step="0.5"
                value={liters}
                onChange={(e) => setLiters(parseFloat(e.target.value) || 0)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 10, background: '#ffffff', border: '1px solid #cbd5e1', color: '#0f172a', fontFamily: 'var(--font-mono)', fontSize: '0.9rem', outline: 'none' }}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>Rate / Liter (₹)</label>
              <input
                type="number"
                step="0.1"
                value={ratePerLiter}
                onChange={(e) => setRatePerLiter(parseFloat(e.target.value) || 0)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 10, background: '#ffffff', border: '1px solid #cbd5e1', color: '#0f172a', fontFamily: 'var(--font-mono)', fontSize: '0.9rem', outline: 'none' }}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>Petrol Pump Name</label>
              <input
                type="text"
                placeholder="Petrol Pump Name"
                value={pumpName}
                onChange={(e) => setPumpName(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 10, background: '#ffffff', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.8rem', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>Meter Reading at Fill</label>
              <input
                type="number"
                step="0.1"
                value={meterReading}
                onChange={(e) => setMeterReading(parseFloat(e.target.value) || 0)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 10, background: '#ffffff', border: '1px solid #cbd5e1', color: '#0f172a', fontFamily: 'var(--font-mono)', fontSize: '0.9rem', outline: 'none' }}
              />
            </div>
          </div>

          {/* Anomaly Check */}
          {isAnomaly ? (
            <div style={{ padding: 12, borderRadius: 12, background: '#fef2f2', border: '1px solid #fecaca', display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: '0.75rem', color: '#991b1b' }}>
              <AlertTriangle style={{ width: 16, height: 16, color: '#ef4444', flexShrink: 0, marginTop: 2 }} />
              <div>
                <strong style={{ display: 'block', color: '#b91c1c' }}>Fuel Anomaly Flagged!</strong>
                <span>Estimated burn rate {simulatedBurnRate} L/hr exceeds normal benchmark {selectedMachine.expectedBurnRate} L/hr. Possible fuel theft or leak.</span>
              </div>
            </div>
          ) : (
            <div style={{ padding: 10, borderRadius: 12, background: '#ecfdf5', border: '1px solid #a7f3d0', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: '#065f46' }}>
              <CheckCircle2 style={{ width: 15, height: 15, color: '#10b981' }} />
              <span>Normal consumption rate ({simulatedBurnRate} L/hr matches standard engine load).</span>
            </div>
          )}

          <button
            type="submit"
            className="btn-full-action"
            style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', marginTop: 6 }}
          >
            <Fuel style={{ width: 18, height: 18 }} />
            <span>Save Fuel Slip Record</span>
          </button>

        </form>
      </div>
    </div>
  );
}
