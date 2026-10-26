'use client';

import React, { useState } from 'react';
import { 
  X, 
  UserPlus, 
  CheckCircle2, 
  AlertCircle, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  CreditCard, 
  Calendar,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const VILLAGE_PRESETS = [
  'Pipariya Kalan',
  'Sobhapur',
  'Semri Harchand',
  'Bankhedi',
  'Sandia'
];

export default function AddCustomerModal({ isOpen, onClose, onSaveCustomer }) {
  const { language } = useLanguage();

  const [name, setName] = useState('');
  const [village, setVillage] = useState('');
  const [phone, setPhone] = useState('');
  const [creditLimit, setCreditLimit] = useState(50000);
  const [openingBalance, setOpeningBalance] = useState(0);
  const [mandiDay, setMandiDay] = useState('Monday');
  const [trustScore, setTrustScore] = useState(85);

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError(language === 'hi' ? 'कृपया किसान का नाम दर्ज करें' : 'Please enter farmer / customer name');
      return;
    }
    if (!village.trim()) {
      setError(language === 'hi' ? 'कृपया गाँव या स्थान का नाम दर्ज करें' : 'Please enter village or location');
      return;
    }

    const newCustomer = {
      id: `c-${Date.now()}`,
      name: name.trim(),
      village: village.trim(),
      phone: phone.trim() || '98000 00000',
      trustScore: parseInt(trustScore) || 85,
      creditLimit: parseFloat(creditLimit) || 50000,
      totalBilled: parseFloat(openingBalance) || 0,
      totalPaid: 0,
      balance: parseFloat(openingBalance) || 0,
      mandiDay: mandiDay || 'Monday',
      barterPaid: 'None',
      lastJobDate: 'New Account',
      history: openingBalance > 0 ? [
        {
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          implement: 'Opening Khata Balance',
          units: '-',
          amount: parseFloat(openingBalance),
          status: 'Credit'
        }
      ] : []
    };

    onSaveCustomer(newCustomer);
    setSuccessMsg(language === 'hi' ? 'किसान खाता सफलतापूर्वक जोड़ा गया!' : 'Farmer account created successfully!');
    
    setTimeout(() => {
      setSuccessMsg('');
      setName('');
      setVillage('');
      setPhone('');
      setOpeningBalance(0);
      setCreditLimit(50000);
      onClose();
    }, 700);
  };

  return (
    <div className="app-modal-overlay" onClick={onClose}>
      <div 
        className="app-modal-sheet" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 520, maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* Header */}
        <div className="modal-sheet-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <UserPlus style={{ width: 22, height: 22 }} />
            </div>
            <div>
              <div className="modal-sheet-title">
                {language === 'hi' ? 'नया किसान (खाता) जोड़ें' : 'Add New Farmer / Customer'}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                {language === 'hi' ? 'उधार खाता, साख स्कोर व संपर्क विवरण दर्ज करें' : 'Setup credit ledger, contact info & Mandi settlement'}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="sheet-close-btn">
            <X style={{ width: 18, height: 18 }} />
          </button>
        </div>

        {/* Success / Error Alerts */}
        {error && (
          <div style={{ margin: '12px 0', padding: '10px 14px', borderRadius: 10, background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertCircle style={{ width: 16, height: 16 }} />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div style={{ margin: '12px 0', padding: '10px 14px', borderRadius: 10, background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#047857', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 8 }}>
            <CheckCircle2 style={{ width: 16, height: 16 }} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Quick Village Presets */}
        <div style={{ margin: '14px 0 16px' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
            <Sparkles style={{ width: 12, height: 12, color: '#f59e0b' }} />
            <span>{language === 'hi' ? 'त्वरित गाँव चुनें' : 'Quick Village Select'}</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {VILLAGE_PRESETS.map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setVillage(v)}
                style={{
                  padding: '4px 10px',
                  borderRadius: 20,
                  fontSize: '0.75rem',
                  border: village === v ? '1.5px solid #2563eb' : '1px solid #e2e8f0',
                  background: village === v ? '#eff6ff' : '#ffffff',
                  color: village === v ? '#1d4ed8' : '#475569',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>
              {language === 'hi' ? 'किसान / ग्राहक का पूरा नाम *' : 'Farmer / Customer Name *'}
            </label>
            <input
              type="text"
              placeholder={language === 'hi' ? 'किसान का पूरा नाम' : 'Farmer / Customer Full Name'}
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 10, background: '#ffffff', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.85rem', outline: 'none' }}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>
                <MapPin style={{ width: 12, height: 12, display: 'inline', marginRight: 4, verticalAlign: -1 }} />
                {language === 'hi' ? 'गाँव / पंचायत *' : 'Village / Location *'}
              </label>
              <input
                type="text"
                placeholder={language === 'hi' ? 'गाँव या पंचायत' : 'Village / Location'}
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 10, background: '#ffffff', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.85rem', outline: 'none' }}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>
                <Phone style={{ width: 12, height: 12, display: 'inline', marginRight: 4, verticalAlign: -1 }} />
                {language === 'hi' ? 'मोबाइल नंबर (व्हाट्सएप)' : 'Phone (WhatsApp)'}
              </label>
              <input
                type="tel"
                placeholder={language === 'hi' ? 'मोबाइल नंबर' : 'Phone Number'}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 10, background: '#ffffff', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.85rem', outline: 'none' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>
                <CreditCard style={{ width: 12, height: 12, display: 'inline', marginRight: 4, verticalAlign: -1 }} />
                {language === 'hi' ? 'उधार सीमा (₹)' : 'Credit Limit (₹)'}
              </label>
              <input
                type="number"
                step="5000"
                value={creditLimit}
                onChange={(e) => setCreditLimit(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 10, background: '#ffffff', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.85rem', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>
                {language === 'hi' ? 'पिछला बकाया (₹)' : 'Opening Balance (₹)'}
              </label>
              <input
                type="number"
                step="500"
                placeholder="0"
                value={openingBalance}
                onChange={(e) => setOpeningBalance(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 10, background: '#ffffff', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.85rem', outline: 'none' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>
                <Calendar style={{ width: 12, height: 12, display: 'inline', marginRight: 4, verticalAlign: -1 }} />
                {language === 'hi' ? 'मंडी भुगतान का दिन' : 'Mandi Day'}
              </label>
              <select
                value={mandiDay}
                onChange={(e) => setMandiDay(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 10, background: '#ffffff', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.85rem', outline: 'none' }}
              >
                <option value="Monday">Monday (सोमवार)</option>
                <option value="Tuesday">Tuesday (मंगलवार)</option>
                <option value="Wednesday">Wednesday (बुधवार)</option>
                <option value="Thursday">Thursday (गुरुवार)</option>
                <option value="Friday">Friday (शुक्रवार)</option>
                <option value="Saturday">Saturday (शनिवार)</option>
                <option value="Sunday">Sunday (रविवार)</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>
                <ShieldCheck style={{ width: 12, height: 12, display: 'inline', marginRight: 4, verticalAlign: -1 }} />
                {language === 'hi' ? 'साख स्कोर (%)' : 'Trust Score (%)'}
              </label>
              <input
                type="number"
                min="30"
                max="100"
                value={trustScore}
                onChange={(e) => setTrustScore(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 10, background: '#ffffff', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.85rem', outline: 'none' }}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-full-action"
            style={{ marginTop: 8 }}
          >
            <CheckCircle2 style={{ width: 18, height: 18 }} />
            <span>{language === 'hi' ? 'खाता बनाएं व सहेजें' : 'Save & Register Customer'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
