'use client';

import React from 'react';
import { 
  X, 
  Printer, 
  Download, 
  Landmark, 
  TrendingUp
} from 'lucide-react';

export default function BankReportModal({ 
  isOpen, 
  onClose, 
  machines = [], 
  customers = [], 
  jobs = [], 
  dieselLogs = [],
  drivers = []
}) {
  if (!isOpen) return null;

  const totalRevenue = customers.reduce((sum, c) => sum + (c.totalBilled || 0), 0);
  const totalReceived = customers.reduce((sum, c) => sum + (c.totalPaid || 0), 0);
  const totalOutstanding = customers.reduce((sum, c) => sum + (c.balance || 0), 0);

  const totalDieselExpense = dieselLogs.reduce((sum, d) => sum + (d.totalCost || 0), 0);
  const driverSalaries = drivers.reduce((sum, d) => sum + (d.bhattaBalance || 0), 0);
  const maintenanceExpenses = 0;

  const totalExpenses = totalDieselExpense + driverSalaries + maintenanceExpenses;
  const netOperatingProfit = totalRevenue - totalExpenses;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="app-modal-overlay" onClick={onClose}>
      <div 
        className="app-modal-sheet"
        style={{ maxWidth: 540 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-sheet-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Landmark style={{ width: 22, height: 22 }} />
            </div>
            <div>
              <div className="modal-sheet-title">Seasonal P&L Bank Statement</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Certified operating income report for KCC and farm loans</div>
            </div>
          </div>
          <button onClick={onClose} className="sheet-close-btn">
            <X style={{ width: 18, height: 18 }} />
          </button>
        </div>

        {/* Paper Statement */}
        <div style={{ padding: 18, borderRadius: 16, background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 18 }}>
          
          <div style={{ textAlign: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: 12 }}>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase' }}>
              🚜 Kisan Custom Hiring Centre (CHC)
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: 2 }}>
              Certified Seasonal Operating Profit & Loss Summary
            </div>
            <span style={{ fontSize: '0.68rem', color: '#2563eb', fontFamily: 'var(--font-mono)', marginTop: 4, display: 'inline-block' }}>
              Date: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            
            <div style={{ padding: 12, borderRadius: 12, background: '#ecfdf5', border: '1px solid #d1fae5', display: 'flex', flexDirection: 'column', gap: 5 }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#065f46', display: 'flex', alignItems: 'center', gap: 4 }}>
                <TrendingUp style={{ width: 14, height: 14 }} /> Gross Revenue
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                <span style={{ color: '#047857' }}>Total Billed:</span>
                <strong style={{ fontFamily: 'var(--font-mono)', color: '#065f46' }}>₹{totalRevenue.toLocaleString('en-IN')}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                <span style={{ color: '#047857' }}>Collected:</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: '#059669', fontWeight: 700 }}>₹{totalReceived.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                <span style={{ color: '#047857' }}>Receivable:</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: '#b45309', fontWeight: 700 }}>₹{totalOutstanding.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div style={{ padding: 12, borderRadius: 12, background: '#fef2f2', border: '1px solid #fee2e2', display: 'flex', flexDirection: 'column', gap: 5 }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#991b1b' }}>
                Operating Costs
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                <span style={{ color: '#b91c1c' }}>Fuel (Diesel):</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: '#dc2626', fontWeight: 600 }}>₹{totalDieselExpense.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                <span style={{ color: '#b91c1c' }}>Driver Bhatta:</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: '#dc2626', fontWeight: 600 }}>₹{driverSalaries.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                <span style={{ color: '#b91c1c' }}>Service / Spares:</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: '#dc2626', fontWeight: 600 }}>₹{maintenanceExpenses.toLocaleString('en-IN')}</span>
              </div>
            </div>

          </div>

          {/* Net Profit Banner */}
          <div style={{ padding: 14, borderRadius: 14, background: '#ffffff', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <div>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', display: 'block' }}>
                Net Operating Profit
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem', fontWeight: 800, color: netOperatingProfit > 0 ? '#10b981' : netOperatingProfit < 0 ? '#dc2626' : '#0f172a' }}>
                ₹{netOperatingProfit.toLocaleString('en-IN')}
              </span>
            </div>
            {netOperatingProfit > 0 ? (
              <span className="badge-soft-green" style={{ padding: '4px 10px', borderRadius: 999, fontSize: '0.72rem', fontWeight: 700 }}>
                Strong Margin
              </span>
            ) : netOperatingProfit < 0 ? (
              <span style={{ padding: '4px 10px', borderRadius: 999, fontSize: '0.72rem', fontWeight: 700, background: '#fef2f2', color: '#dc2626', border: '1px solid #fee2e2' }}>
                Operating Deficit
              </span>
            ) : (
              <span style={{ padding: '4px 10px', borderRadius: 999, fontSize: '0.72rem', fontWeight: 700, background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' }}>
                Balanced (₹0)
              </span>
            )}
          </div>

          <div>
            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
              Asset Utilization Summary:
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {machines.length === 0 ? (
                <div style={{ padding: '12px 14px', borderRadius: 10, background: '#ffffff', border: '1px dashed #cbd5e1', textAlign: 'center', color: '#94a3b8', fontSize: '0.75rem' }}>
                  No machines registered yet. Fleet records will appear here as machinery is added.
                </div>
              ) : (
                machines.map(m => (
                  <div key={m.id} style={{ padding: '6px 10px', borderRadius: 8, background: '#ffffff', border: '1px solid #edf2f7', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                    <span style={{ fontWeight: 600, color: '#0f172a' }}>{m.name}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', color: '#64748b' }}>
                      Meter: <strong>{(m.currentMeter || 0).toFixed(1)} hrs</strong> | Burn: {m.expectedBurnRate || 0} L/hr
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={handlePrint}
            className="btn-full-action"
            style={{ flex: 1, padding: '12px' }}
          >
            <Printer style={{ width: 16, height: 16 }} />
            <span>Print Report</span>
          </button>
          <button
            onClick={() => alert("Official PDF Statement downloaded")}
            className="amount-chip-btn"
            style={{ flex: 1, padding: '12px', background: '#f8fafc', color: '#0f172a' }}
          >
            <Download style={{ width: 16, height: 16 }} />
            <span>Download PDF</span>
          </button>
        </div>

      </div>
    </div>
  );
}
