'use client';

import React, { useState } from 'react';
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  QrCode, 
  Send
} from 'lucide-react';

export default function WhatsAppInvoiceModal({ customer, job, isOpen, onClose }) {
  const [copied, setCopied] = useState(false);
  const [includeMandiReminder, setIncludeMandiReminder] = useState(true);

  if (!isOpen || !customer) return null;

  const currentBillAmount = job ? (job.totalAmount || 0) : (customer.balance || 0);
  const implementName = job ? job.implement : (customer.history && customer.history.length > 0 ? customer.history[0].implement : 'Khata Ledger Settlement');
  const unitsText = job ? `${job.units} ${job.billingType === 'Per Hour' ? 'Hours' : job.billingType === 'Per Acre' ? 'Acres' : 'Units'}` : 'Direct Ledger';
  const dateStr = job ? job.date : new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const formattedBillText = `🚜 *TRACTOR RECORD - DIGITAL INVOICE*
---------------------------------------
👤 *Customer:* ${customer.name}
📍 *Village:* ${customer.village}
📅 *Date:* ${dateStr}

🛠️ *Field Operation Details:*
• Implement: ${implementName}
• Usage: ${unitsText}
• Current Job Bill: ₹${currentBillAmount.toLocaleString('en-IN')}
---------------------------------------
💰 *Total Outstanding Due:* ₹${customer.balance.toLocaleString('en-IN')}

${includeMandiReminder ? `📢 *Payment Reminder:* Payment requested by local Mandi cycle day (${customer.mandiDay}).` : ''}

📲 *Pay via UPI QR:* 
upi://pay?pa=farmercare@upi&pn=TractorRecord&am=${customer.balance}

Thank you! 
_Powered by Tractor Record Pro_`;

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedBillText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppSend = () => {
    const cleanPhone = (customer.phone || '').replace(/\D/g, '');
    const encodedText = encodeURIComponent(formattedBillText);
    const waUrl = cleanPhone ? `https://wa.me/91${cleanPhone}?text=${encodedText}` : `https://wa.me/?text=${encodedText}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div className="app-modal-overlay" onClick={onClose}>
      <div 
        className="app-modal-sheet"
        style={{ maxWidth: 460 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-sheet-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Share2 style={{ width: 20, height: 20 }} />
            </div>
            <div>
              <div className="modal-sheet-title">WhatsApp Digital Invoice</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Itemized bill with embedded UPI QR payment</div>
            </div>
          </div>
          <button onClick={onClose} className="sheet-close-btn">
            <X style={{ width: 18, height: 18 }} />
          </button>
        </div>

        {/* Invoice Preview Sheet */}
        <div style={{ padding: 18, borderRadius: 16, background: '#f8fafc', border: '1px dashed #cbd5e1', display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 18 }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed #cbd5e1', paddingBottom: 10 }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a' }}>
                🚜 Kisan Machinery Fleet
              </div>
              <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Certified Electronic Khata Bill</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block' }}>Date: {dateStr}</span>
              <span className="badge-soft-green" style={{ padding: '2px 8px', borderRadius: 999, fontSize: '0.65rem', fontWeight: 700 }}>Verified</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.8rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>Customer:</span>
              <strong style={{ color: '#0f172a' }}>{customer.name}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>Location:</span>
              <span style={{ color: '#0f172a' }}>{customer.village}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>Implement:</span>
              <span style={{ color: '#2563eb', fontWeight: 700 }}>{implementName}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>Units / Hours:</span>
              <span style={{ color: '#0f172a', fontWeight: 600 }}>{unitsText}</span>
            </div>
          </div>

          <div style={{ padding: 12, borderRadius: 12, background: '#ffffff', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
              <span style={{ color: '#64748b' }}>Current Job Amount:</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#0f172a' }}>₹{currentBillAmount.toLocaleString('en-IN')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem', fontWeight: 800, borderTop: '1px solid #f1f5f9', paddingTop: 8 }}>
              <span style={{ color: '#0f172a' }}>Total Outstanding Due:</span>
              <span style={{ fontFamily: 'var(--font-mono)', color: '#2563eb' }}>₹{customer.balance.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* UPI QR Payment Bar */}
          <div style={{ padding: 12, borderRadius: 14, background: '#ffffff', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 5 }}>
                <QrCode style={{ width: 14, height: 14 }} /> Scan to Pay via UPI
              </span>
              <p style={{ fontSize: '0.68rem', color: '#64748b', marginTop: 2 }}>
                PhonePe, Google Pay, Paytm, or BHIM UPI
              </p>
            </div>
            <div style={{ width: 56, height: 56, background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 8, padding: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '100%', height: '100%', background: '#0f172a', borderRadius: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#10b981', fontSize: '0.55rem', fontFamily: 'var(--font-mono)' }}>
                <span>[ UPI ]</span>
                <span style={{ fontSize: '0.5rem', color: '#ffffff' }}>₹{customer.balance}</span>
              </div>
            </div>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.75rem', color: '#64748b', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={includeMandiReminder}
              onChange={(e) => setIncludeMandiReminder(e.target.checked)}
              style={{ accentColor: '#2563eb' }}
            />
            <span>Include Mandi Cycle Reminder (<strong style={{ color: '#0f172a' }}>{customer.mandiDay}</strong>)</span>
          </label>

        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={handleCopy}
            className="amount-chip-btn"
            style={{ flex: 1, padding: '12px', background: '#f1f5f9', color: '#0f172a' }}
          >
            {copied ? <Check style={{ width: 15, height: 15, color: '#10b981' }} /> : <Copy style={{ width: 15, height: 15 }} />}
            <span>{copied ? 'Copied!' : 'Copy Invoice'}</span>
          </button>

          <button
            onClick={handleWhatsAppSend}
            className="btn-full-action"
            style={{ flex: 1, padding: '12px', background: 'linear-gradient(135deg, #10b981, #059669)' }}
          >
            <Send style={{ width: 16, height: 16 }} />
            <span>Send on WhatsApp</span>
          </button>
        </div>

      </div>
    </div>
  );
}
