'use client';

import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Wheat, 
  Share2, 
  AlertTriangle,
  CreditCard,
  CheckCircle2
} from 'lucide-react';

export default function CustomerKhataModal({ 
  customer, 
  isOpen, 
  onClose, 
  onOpenWhatsAppBill, 
  onAddPayment 
}) {
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [payAmount, setPayAmount] = useState('');
  const [payMode, setPayMode] = useState('UPI');
  const [barterItem, setBarterItem] = useState('Wheat');
  const [barterQuintals, setBarterQuintals] = useState('2');

  if (!isOpen || !customer) return null;

  const creditPercentage = Math.min(100, Math.round((customer.balance / customer.creditLimit) * 100));
  const isHighRisk = customer.trustScore < 70 || creditPercentage > 85;

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    const amt = parseFloat(payAmount);
    if (!amt || amt <= 0) {
      alert('Please enter a valid payment amount');
      return;
    }

    if (onAddPayment) {
      onAddPayment(customer.id, amt, payMode, payMode === 'Barter' ? `${barterQuintals} Quintals ${barterItem}` : null);
    }
    setPayAmount('');
    setShowAddPayment(false);
  };

  return (
    <div className="app-modal-overlay" onClick={onClose}>
      <div 
        className="app-modal-sheet"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-sheet-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: '#eff6ff', color: '#2563eb', fontWeight: 800, fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {customer.name.charAt(0)}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="modal-sheet-title">{customer.name}</span>
                <span className={customer.trustScore >= 80 ? 'badge-soft-green' : 'badge-soft-amber'} style={{ padding: '2px 8px', borderRadius: 999, fontSize: '0.7rem', fontWeight: 700 }}>
                  {customer.trustScore}% Trust
                </span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Village: {customer.village} • Phone: +91 {customer.phone}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="sheet-close-btn">
            <X style={{ width: 18, height: 18 }} />
          </button>
        </div>

        {/* 3 Metric Pills matching reference */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 18 }}>
          <div style={{ padding: 12, borderRadius: 14, background: '#f8fafc', border: '1px solid #e2e8f0', textAlign: 'center' }}>
            <span style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase', display: 'block', fontWeight: 600 }}>Total Billed</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>
              ₹{customer.totalBilled.toLocaleString('en-IN')}
            </span>
          </div>

          <div style={{ padding: 12, borderRadius: 14, background: '#ecfdf5', border: '1px solid #d1fae5', textAlign: 'center' }}>
            <span style={{ fontSize: '0.68rem', color: '#059669', textTransform: 'uppercase', display: 'block', fontWeight: 600 }}>Received</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '1rem', color: '#059669' }}>
              ₹{customer.totalPaid.toLocaleString('en-IN')}
            </span>
          </div>

          <div style={{ padding: 12, borderRadius: 14, background: '#fef2f2', border: '1px solid #fee2e2', textAlign: 'center' }}>
            <span style={{ fontSize: '0.68rem', color: '#dc2626', textTransform: 'uppercase', display: 'block', fontWeight: 600 }}>Balance Due</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '1rem', color: '#dc2626' }}>
              ₹{customer.balance.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Credit Limit & Mandi Card */}
        <div style={{ padding: 16, borderRadius: 16, background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
            <span style={{ color: '#64748b' }}>
              Credit Limit: <strong style={{ color: '#0f172a' }}>₹{customer.creditLimit.toLocaleString('en-IN')}</strong>
            </span>
            <span style={{ fontWeight: 700, color: isHighRisk ? '#d97706' : '#10b981' }}>
              {creditPercentage}% Utilized
            </span>
          </div>

          <div style={{ width: '100%', height: 7, borderRadius: 999, background: '#e2e8f0', overflow: 'hidden' }}>
            <div style={{ width: `${creditPercentage}%`, height: '100%', borderRadius: 999, background: isHighRisk ? '#f59e0b' : '#2563eb' }}></div>
          </div>

          {isHighRisk && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: '#b45309' }}>
              <AlertTriangle style={{ width: 14, height: 14, color: '#f59e0b', flexShrink: 0 }} />
              <span>Warning: Customer is approaching maximum credit limit. Collect advance.</span>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', borderTop: '1px solid #e2e8f0', paddingTop: 8 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Calendar style={{ width: 13, height: 13, color: '#f59e0b' }} /> Mandi Cycle: <strong style={{ color: '#0f172a' }}>{customer.mandiDay}</strong>
            </span>
            {customer.barterPaid && customer.barterPaid !== 'None' && (
              <span style={{ color: '#059669', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Wheat style={{ width: 13, height: 13 }} /> Barter: {customer.barterPaid}
              </span>
            )}
          </div>
        </div>

        {/* Action Toggle */}
        {showAddPayment ? (
          <form onSubmit={handlePaymentSubmit} style={{ padding: 16, borderRadius: 16, background: '#eff6ff', border: '1px solid #bfdbfe', display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#1e3a8a', textTransform: 'uppercase' }}>
                Record Customer Payment
              </span>
              <button type="button" onClick={() => setShowAddPayment(false)} style={{ background: 'transparent', border: 'none', color: '#64748b', fontSize: '0.75rem', cursor: 'pointer' }}>
                Cancel
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <label style={{ fontSize: '0.72rem', color: '#475569', display: 'block', marginBottom: 4, fontWeight: 600 }}>Payment Mode</label>
                <select
                  value={payMode}
                  onChange={(e) => setPayMode(e.target.value)}
                  style={{ width: '100%', padding: '9px', borderRadius: 8, background: '#ffffff', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.8rem' }}
                >
                  <option value="UPI">UPI (PhonePe / GPay)</option>
                  <option value="Cash">Cash</option>
                  <option value="Bank">Bank Transfer (NEFT)</option>
                  <option value="Barter">Barter (Grain / Fodder)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.72rem', color: '#475569', display: 'block', marginBottom: 4, fontWeight: 600 }}>Amount (₹)</label>
                <input
                  type="number"
                  placeholder="₹ Amount"
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  style={{ width: '100%', padding: '9px', borderRadius: 8, background: '#ffffff', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.8rem', outline: 'none' }}
                  required
                />
              </div>
            </div>

            {payMode === 'Barter' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: '0.72rem', color: '#475569', display: 'block', marginBottom: 4, fontWeight: 600 }}>Commodity Name</label>
                  <input
                    type="text"
                    value={barterItem}
                    onChange={(e) => setBarterItem(e.target.value)}
                    style={{ width: '100%', padding: '9px', borderRadius: 8, background: '#ffffff', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.8rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.72rem', color: '#475569', display: 'block', marginBottom: 4, fontWeight: 600 }}>Quantity (Quintals)</label>
                  <input
                    type="text"
                    value={barterQuintals}
                    onChange={(e) => setBarterQuintals(e.target.value)}
                    style={{ width: '100%', padding: '9px', borderRadius: 8, background: '#ffffff', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.8rem' }}
                  />
                </div>
              </div>
            )}

            <button type="submit" className="btn-full-action" style={{ padding: '10px' }}>
              Confirm Payment & Update Khata
            </button>
          </form>
        ) : (
          <div style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
            <button
              onClick={() => setShowAddPayment(true)}
              className="amount-chip-btn"
              style={{ flex: 1, padding: '10px 14px', background: '#eff6ff', color: '#2563eb', borderColor: '#bfdbfe' }}
            >
              + Record Payment / Barter
            </button>
            <button
              onClick={() => onOpenWhatsAppBill(customer)}
              className="btn-full-action"
              style={{ flex: 1, padding: '10px 14px' }}
            >
              <Share2 style={{ width: 15, height: 15 }} />
              <span>WhatsApp Bill</span>
            </button>
          </div>
        )}

        {/* History Transactions List */}
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: 10 }}>
            Transaction History:
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 180, overflowY: 'auto' }}>
            {customer.history && customer.history.map((h, i) => (
              <div 
                key={i} 
                style={{ padding: '10px 14px', borderRadius: 12, background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem' }}
              >
                <div>
                  <div style={{ fontWeight: 700, color: '#0f172a' }}>{h.implement}</div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{h.date} • {h.units}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: h.amount < 0 ? '#10b981' : '#0f172a' }}>
                    {h.amount < 0 ? `- ₹${Math.abs(h.amount).toLocaleString('en-IN')}` : `+ ₹${h.amount.toLocaleString('en-IN')}`}
                  </div>
                  <span style={{ fontSize: '0.7rem', color: h.status === 'Paid' ? '#10b981' : '#d97706', fontWeight: 600 }}>
                    {h.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
