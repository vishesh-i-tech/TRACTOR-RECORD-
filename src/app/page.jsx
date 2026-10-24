'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import AuthView from '../components/AuthView';
import VoiceAssistantModal from '../components/VoiceAssistantModal';
import DriverModeView from '../components/DriverModeView';
import CustomerKhataModal from '../components/CustomerKhataModal';
import WhatsAppInvoiceModal from '../components/WhatsAppInvoiceModal';
import AddJobModal from '../components/AddJobModal';
import AddDieselModal from '../components/AddDieselModal';
import AddMachineModal from '../components/AddMachineModal';
import FleetHealthView from '../components/FleetHealthView';
import BankReportModal from '../components/BankReportModal';
import AuthModal from '../components/AuthModal';
import SupabaseConfigModal from '../components/SupabaseConfigModal';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  fetchSupabaseCustomers, 
  fetchSupabaseMachines, 
  fetchSupabaseJobs, 
  fetchSupabaseDieselLogs, 
  insertSupabaseJob, 
  insertSupabaseDiesel,
  insertSupabaseMachine 
} from '../lib/dbService';

import { 
  TRANSLATIONS, 
  INITIAL_MACHINES, 
  INITIAL_CUSTOMERS, 
  INITIAL_DRIVERS, 
  INITIAL_JOBS, 
  INITIAL_DIESEL_LOGS 
} from '../data/mockData';

import { 
  Tractor, 
  Fuel, 
  Users, 
  Clock, 
  Search, 
  Plus, 
  Share2, 
  Mic, 
  Landmark, 
  ArrowUpRight, 
  ArrowDownRight, 
  ChevronRight,
  Home as HomeIcon,
  Layers,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Sparkles
} from 'lucide-react';

export default function Home() {
  const { user, isSupabaseLive } = useAuth();
  const { language, t } = useLanguage();
  const [currentRole, setRole] = useState('owner'); // 'owner' | 'munshi' | 'driver'
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'khata' | 'jobs' | 'diesel' | 'fleet'
  const [isExpandedView, setIsExpandedView] = useState(false);

  const [machines, setMachines] = useState(INITIAL_MACHINES);
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  const [drivers, setDrivers] = useState(INITIAL_DRIVERS);
  const [jobs, setJobs] = useState(INITIAL_JOBS);
  const [dieselLogs, setDieselLogs] = useState(INITIAL_DIESEL_LOGS);

  const [searchQuery, setSearchQuery] = useState('');

  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isAddJobOpen, setIsAddJobOpen] = useState(false);
  const [isAddDieselOpen, setIsAddDieselOpen] = useState(false);
  const [isAddMachineOpen, setIsAddMachineOpen] = useState(false);
  const [isBankReportOpen, setIsBankReportOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSupabaseConfigOpen, setIsSupabaseConfigOpen] = useState(false);

  const [selectedCustomerForKhata, setSelectedCustomerForKhata] = useState(null);
  const [selectedCustomerForBill, setSelectedCustomerForBill] = useState(null);
  const [selectedJobForBill, setSelectedJobForBill] = useState(null);

  // Sync data with Supabase if live connection is active
  useEffect(() => {
    let isMounted = true;
    const loadSupabaseData = async () => {
      if (isSupabaseLive) {
        try {
          const [remoteCust, remoteMach, remoteJobs, remoteDiesel] = await Promise.all([
            fetchSupabaseCustomers(INITIAL_CUSTOMERS),
            fetchSupabaseMachines(INITIAL_MACHINES),
            fetchSupabaseJobs(INITIAL_JOBS),
            fetchSupabaseDieselLogs(INITIAL_DIESEL_LOGS),
          ]);
          if (isMounted) {
            if (remoteCust && remoteCust.length > 0) setCustomers(remoteCust);
            if (remoteMach && remoteMach.length > 0) setMachines(remoteMach);
            if (remoteJobs && remoteJobs.length > 0) setJobs(remoteJobs);
            if (remoteDiesel && remoteDiesel.length > 0) setDieselLogs(remoteDiesel);
          }
        } catch (err) {
          console.warn('Error loading data from Supabase:', err);
        }
      }
    };
    loadSupabaseData();
    return () => { isMounted = false; };
  }, [isSupabaseLive]);

  // Keep role in sync with active user profile
  useEffect(() => {
    if (user?.role && user.role !== currentRole) {
      setRole(user.role);
    }
  }, [user?.role]);

  // Key KPI Calculations
  const totalOutstanding = customers.reduce((sum, c) => sum + c.balance, 0);
  const totalHoursToday = machines.reduce((sum, m) => sum + (m.dailyHours || 0), 0);
  const activeMachineCount = machines.filter(m => m.status === 'Active').length;
  const fuelAlertCount = dieselLogs.filter(d => d.anomalyAlert).length;
  const totalDieselExpense = dieselLogs.reduce((sum, d) => sum + d.totalCost, 0);

  const handleSaveJob = (newJob) => {
    // Persist to Supabase DB if connected
    insertSupabaseJob(newJob);

    setJobs([newJob, ...jobs]);
    
    setCustomers(customers.map(c => {
      if (c.name.toLowerCase() === newJob.customer.toLowerCase() || c.id === newJob.customerId) {
        return {
          ...c,
          totalBilled: c.totalBilled + newJob.totalAmount,
          balance: c.balance + newJob.totalAmount,
          lastJobDate: newJob.date,
          history: [
            {
              date: newJob.date,
              implement: newJob.implement,
              units: `${newJob.units} ${newJob.billingType === 'Per Hour' ? 'hrs' : 'acres'}`,
              amount: newJob.totalAmount,
              status: 'Credit'
            },
            ...(c.history || [])
          ]
        };
      }
      return c;
    }));

    setMachines(machines.map(m => {
      if (m.name.toLowerCase() === newJob.machine.toLowerCase() || m.id === newJob.machineId) {
        const addedHours = newJob.billingType === 'Per Hour' ? newJob.units : 3.5;
        return {
          ...m,
          currentMeter: m.currentMeter + addedHours,
          dailyHours: (m.dailyHours || 0) + addedHours,
          serviceHoursLeft: m.serviceHoursLeft - addedHours
        };
      }
      return m;
    }));
  };

  const handleSaveDiesel = (newDiesel) => {
    // Persist to Supabase DB if connected
    insertSupabaseDiesel(newDiesel);

    setDieselLogs([newDiesel, ...dieselLogs]);
    if (newDiesel.machineId) {
      setMachines(machines.map(m => {
        if (m.id === newDiesel.machineId) {
          return {
            ...m,
            fuelLevel: Math.min(m.fuelCapacity, m.fuelLevel + newDiesel.liters)
          };
        }
        return m;
      }));
    }
  };

  const handleAddPayment = (customerId, amount, mode, barterDetail) => {
    setCustomers(customers.map(c => {
      if (c.id === customerId) {
        return {
          ...c,
          totalPaid: c.totalPaid + amount,
          balance: Math.max(0, c.balance - amount),
          barterPaid: barterDetail || c.barterPaid,
          history: [
            {
              date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              implement: `Payment (${mode}) ${barterDetail ? `[${barterDetail}]` : ''}`,
              units: '-',
              amount: -amount,
              status: 'Paid'
            },
            ...(c.history || [])
          ]
        };
      }
      return c;
    }));
  };

  const openWhatsAppModal = (customer, job = null) => {
    setSelectedCustomerForBill(customer);
    setSelectedJobForBill(job);
  };

  const openKhataModal = (customer) => {
    setSelectedCustomerForKhata(customer);
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery)
  );

  const filteredJobs = jobs.filter(j => 
    j.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    j.machine.toLowerCase().includes(searchQuery.toLowerCase()) ||
    j.implement.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSaveMachine = (newMachine) => {
    insertSupabaseMachine(newMachine);
    setMachines(prev => [newMachine, ...prev]);
  };

  // Mandatory Authentication Gate: Always display AuthView first if user is not signed in
  if (!user) {
    return (
      <div className="app-screen-container">
        <div className={`mobile-frame-wrapper ${isExpandedView ? 'desktop-expanded-mode' : ''}`}>
          <AuthView onOpenSupabaseConfig={() => setIsSupabaseConfigOpen(true)} />
          <SupabaseConfigModal 
            isOpen={isSupabaseConfigOpen} 
            onClose={() => setIsSupabaseConfigOpen(false)} 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="app-screen-container">
      
      {/* Mobile Frame Container matching Reference UI */}
      <div className={`mobile-frame-wrapper ${isExpandedView ? 'desktop-expanded-mode' : ''}`}>
        
        {/* Top Header matching reference */}
        <Navbar
          currentRole={currentRole}
          setRole={setRole}
          isExpandedView={isExpandedView}
          setIsExpandedView={setIsExpandedView}
          openVoiceModal={() => setIsVoiceOpen(true)}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          onOpenSupabaseConfig={() => setIsSupabaseConfigOpen(true)}
          totalAlerts={fuelAlertCount}
        />

        {/* Dedicated Inner Scroll Container for smooth internal scrolling */}
        <div className="app-scrollable-content">
          {/* If DRIVER MODE is active */}
        {currentRole === 'driver' ? (
          <div style={{ padding: '0 20px 20px 20px' }}>
            <DriverModeView 
              machines={machines}
              onSaveDriverJob={handleSaveJob}
              currentDriver={drivers[0]}
            />
          </div>
        ) : (
          <div>

            {/* Hero Blue Wave Gradient Balance Card (The focal element from reference Dashboard 1 & 2) */}
            <div className="hero-balance-card">
              <div className="hero-balance-top">
                <span className="balance-card-label">Outstanding Receivables</span>
                <div className="pill-selector">
                  <span>Khata Ledger</span>
                  <span style={{ fontSize: '0.65rem' }}>▾</span>
                </div>
              </div>

              <div className="hero-balance-value">
                ₹{totalOutstanding.toLocaleString('en-IN')}
              </div>

              {/* Glowing SVG Wave Chart */}
              <svg className="wave-graphic-svg" viewBox="0 0 300 50" preserveAspectRatio="none">
                <path 
                  d="M0,35 C50,15 90,45 150,20 C210,-5 250,30 300,10 L300,50 L0,50 Z" 
                  fill="rgba(255, 255, 255, 0.15)" 
                />
                <path 
                  d="M0,35 C50,15 90,45 150,20 C210,-5 250,30 300,10" 
                  fill="none" 
                  stroke="#ffffff" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                />
              </svg>

              {/* Card Footer Metric Chips */}
              <div className="hero-card-footer">
                <span className="balance-chip balance-chip-income">
                  <ArrowUpRight style={{ width: 13, height: 13 }} /> Receivable ₹{totalOutstanding.toLocaleString('en-IN')}
                </span>
                <span className="balance-chip balance-chip-expense">
                  <ArrowDownRight style={{ width: 13, height: 13 }} /> Fuel ₹{totalDieselExpense.toLocaleString('en-IN')}
                </span>
                <span className="balance-chip">
                  Today {totalHoursToday.toFixed(1)} hrs
                </span>
              </div>
            </div>

            {/* Quick Action Circles Strip (matching reference UI) */}
            <div className="quick-action-strip">
              <button 
                onClick={() => setIsAddJobOpen(true)}
                className="action-circle-item"
              >
                <div className="action-icon-bubble action-bubble-green">
                  <Plus style={{ width: 22, height: 22 }} />
                </div>
                <span className="action-bubble-label">Record Job</span>
              </button>

              <button 
                onClick={() => setIsAddDieselOpen(true)}
                className="action-circle-item"
              >
                <div className="action-icon-bubble action-bubble-amber">
                  <Fuel style={{ width: 20, height: 20 }} />
                </div>
                <span className="action-bubble-label">Fuel Slip</span>
              </button>

              <button 
                onClick={() => setIsVoiceOpen(true)}
                className="action-circle-item"
              >
                <div className="action-icon-bubble action-bubble-purple">
                  <Mic style={{ width: 20, height: 20 }} />
                </div>
                <span className="action-bubble-label">Voice AI</span>
              </button>

              <button 
                onClick={() => setIsBankReportOpen(true)}
                className="action-circle-item"
              >
                <div className="action-icon-bubble action-bubble-blue">
                  <BarChart3 style={{ width: 20, height: 20 }} />
                </div>
                <span className="action-bubble-label">Bank P&L</span>
              </button>

              <button 
                onClick={() => setIsAddMachineOpen(true)}
                className="action-circle-item"
                title="Add Machinery / नई मशीन जोड़ें"
              >
                <div className="action-icon-bubble" style={{ background: '#059669', color: '#ffffff' }}>
                  <Tractor style={{ width: 20, height: 20 }} />
                </div>
                <span className="action-bubble-label">{language === 'hi' ? '+ मशीनरी' : '+ Machinery'}</span>
              </button>
            </div>

            {/* Segmented Filter Pills (matching reference 1D 1W 1M 3M / Manage Invest) */}
            <div className="segmented-pill-bar">
              <button 
                onClick={() => setActiveTab('overview')}
                className={`segmented-pill-btn ${activeTab === 'overview' ? 'active' : ''}`}
              >
                Overview
              </button>
              <button 
                onClick={() => setActiveTab('khata')}
                className={`segmented-pill-btn ${activeTab === 'khata' ? 'active' : ''}`}
              >
                Farmer Khata
              </button>
              <button 
                onClick={() => setActiveTab('jobs')}
                className={`segmented-pill-btn ${activeTab === 'jobs' ? 'active' : ''}`}
              >
                Field Logs
              </button>
              <button 
                onClick={() => setActiveTab('diesel')}
                className={`segmented-pill-btn ${activeTab === 'diesel' ? 'active' : ''}`}
              >
                Diesel Audit
              </button>
              <button 
                onClick={() => setActiveTab('fleet')}
                className={`segmented-pill-btn ${activeTab === 'fleet' ? 'active' : ''}`}
              >
                Fleet Health
              </button>
            </div>

            {/* VIEW TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div>
                
                {/* Machine Utilization Donut Ring (matching reference "Your Account Spendings") */}
                <div className="app-section">
                  <div className="donut-spending-card">
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                      <span className="section-main-title" style={{ fontSize: '0.95rem' }}>Fleet Utilization Today</span>
                      <span className="badge-soft-green" style={{ padding: '2px 8px', borderRadius: 999, fontSize: '0.68rem', fontWeight: 700 }}>
                        {activeMachineCount} of {machines.length} Active
                      </span>
                    </div>

                    <div className="donut-visual-container">
                      <svg width="140" height="140" viewBox="0 0 140 140">
                        {/* Background ring */}
                        <circle cx="70" cy="70" r="54" fill="none" stroke="#f1f5f9" strokeWidth="12" />
                        {/* Mahindra slice (green) */}
                        <circle cx="70" cy="70" r="54" fill="none" stroke="#10b981" strokeWidth="12"
                          strokeDasharray="148 340" strokeDashoffset="0" strokeLinecap="round" />
                        {/* JCB slice (cyan) */}
                        <circle cx="70" cy="70" r="54" fill="none" stroke="#06b6d4" strokeWidth="12"
                          strokeDasharray="186 340" strokeDashoffset="-154" strokeLinecap="round" />
                      </svg>
                      <div className="donut-center-stat">
                        <div className="donut-center-number">{totalHoursToday.toFixed(1)}h</div>
                        <div className="donut-center-sub">Total Hours</div>
                      </div>
                    </div>

                    <div className="donut-legend-chips">
                      <span className="legend-badge" style={{ background: '#ecfdf5', color: '#059669' }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }}></span>
                        Mahindra 575 DI (6.5h)
                      </span>
                      <span className="legend-badge" style={{ background: '#cffafe', color: '#0891b2' }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#06b6d4' }}></span>
                        JCB 3DX Super (8.2h)
                      </span>
                      <span className="legend-badge" style={{ background: '#fef3c7', color: '#d97706' }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b' }}></span>
                        John Deere (Idle)
                      </span>
                      <span className="legend-badge" style={{ background: '#fee2e2', color: '#dc2626' }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }}></span>
                        Sonalika (Service)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Recent Field Logs (Styled like "Transactions" in reference Dashboard 1 & 4) */}
                <div className="app-section">
                  <div className="section-header-row">
                    <h3 className="section-main-title">Recent Field Operations</h3>
                    <span 
                      onClick={() => setActiveTab('jobs')}
                      className="section-link-action"
                    >
                      <span>View All ({jobs.length})</span>
                      <ChevronRight style={{ width: 14, height: 14 }} />
                    </span>
                  </div>

                  <div className="transaction-list-card">
                    {filteredJobs.slice(0, 3).map((job) => {
                      const customerObj = customers.find(c => c.name.toLowerCase() === job.customer.toLowerCase()) || {
                        name: job.customer,
                        village: 'Local Field',
                        phone: '9826144102',
                        balance: job.totalAmount
                      };

                      return (
                        <div key={job.id} className="transaction-row-item">
                          <div className="transaction-left-group">
                            <div className="trans-icon-box trans-icon-green">
                              <Tractor style={{ width: 22, height: 22 }} />
                            </div>
                            <div>
                              <div className="trans-title">{job.customer}</div>
                              <div className="trans-subtitle">
                                {job.implement} • {job.units} {job.billingType === 'Per Hour' ? 'hrs' : 'acres'}
                              </div>
                              <div style={{ fontSize: '0.65rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: 3, marginTop: 2 }}>
                                <CheckCircle2 style={{ width: 11, height: 11 }} /> GPS Geotag Verified
                              </div>
                            </div>
                          </div>

                          <div className="trans-right-amount">
                            <div className="trans-amount-bold trans-amount-credit">
                              + ₹{job.totalAmount.toLocaleString('en-IN')}
                            </div>
                            <button
                              onClick={() => openWhatsAppModal(customerObj, job)}
                              style={{
                                marginTop: 4,
                                padding: '3px 8px',
                                borderRadius: 6,
                                background: '#ecfdf5',
                                border: '1px solid #a7f3d0',
                                color: '#059669',
                                fontSize: '0.68rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 3
                              }}
                            >
                              <Share2 style={{ width: 10, height: 10 }} /> WhatsApp Bill
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Farmer Khata Watchlist (Styled like "Top Gainers / Stocks Watchlist" in reference Dashboard 2) */}
                <div className="app-section">
                  <div className="section-header-row">
                    <h3 className="section-main-title">Farmer Khata & Trust Scores</h3>
                    <span 
                      onClick={() => setActiveTab('khata')}
                      className="section-link-action"
                    >
                      <span>All Accounts ({customers.length})</span>
                      <ChevronRight style={{ width: 14, height: 14 }} />
                    </span>
                  </div>

                  <div className="transaction-list-card">
                    {filteredCustomers.slice(0, 3).map((customer) => {
                      const isHighRisk = customer.trustScore < 70;
                      return (
                        <div key={customer.id} className="transaction-row-item">
                          <div className="transaction-left-group">
                            <div className="trans-icon-box trans-icon-blue" style={{ fontWeight: 800 }}>
                              {customer.name.charAt(0)}
                            </div>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <span className="trans-title">{customer.name}</span>
                                <span className={customer.trustScore >= 80 ? 'badge-soft-green' : 'badge-soft-amber'} style={{ padding: '1px 6px', borderRadius: 999, fontSize: '0.65rem', fontWeight: 700 }}>
                                  {customer.trustScore}% Trust
                                </span>
                              </div>
                              <div className="trans-subtitle">
                                {customer.village} • Mandi: {customer.mandiDay}
                              </div>
                            </div>
                          </div>

                          <div className="trans-right-amount">
                            <div className="trans-amount-bold" style={{ color: '#0f172a' }}>
                              ₹{customer.balance.toLocaleString('en-IN')}
                            </div>
                            <span style={{ fontSize: '0.68rem', color: '#64748b' }}>Balance Due</span>
                            <div style={{ display: 'flex', gap: 4, marginTop: 4, justifyContent: 'flex-end' }}>
                              <button
                                onClick={() => openKhataModal(customer)}
                                style={{ padding: '3px 7px', borderRadius: 6, background: '#f1f5f9', border: '1px solid #cbd5e1', color: '#334155', fontSize: '0.68rem', fontWeight: 600, cursor: 'pointer' }}
                              >
                                Ledger
                              </button>
                              <button
                                onClick={() => openWhatsAppModal(customer)}
                                style={{ padding: '3px 7px', borderRadius: 6, background: '#eff6ff', border: '1px solid #bfdbfe', color: '#2563eb', fontSize: '0.68rem', fontWeight: 700, cursor: 'pointer' }}
                              >
                                Share
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Monthly Work Targets (matching reference "Monthly Budgets") */}
                <div className="app-section">
                  <div style={{ padding: 18, borderRadius: 20, background: '#ffffff', border: '1px solid #edf2f7', boxShadow: 'var(--shadow-card)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a' }}>Monthly Field Work Target</span>
                      <span className="badge-soft-blue" style={{ padding: '2px 8px', borderRadius: 999, fontSize: '0.7rem', fontWeight: 700 }}>
                        58% Reached
                      </span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: 10 }}>
                      104.5 of 180 planned tractor operating hours logged this month
                    </div>
                    <div style={{ width: '100%', height: 8, borderRadius: 999, background: '#f1f5f9', overflow: 'hidden' }}>
                      <div style={{ width: '58%', height: '100%', borderRadius: 999, background: 'linear-gradient(90deg, #3b82f6, #2563eb)' }}></div>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* VIEW TAB 2: FARMER KHATA DIRECTORY */}
            {activeTab === 'khata' && (
              <div className="app-section">
                <div className="section-header-row">
                  <div>
                    <h2 className="section-main-title">Farmer Credit Ledgers (Khata)</h2>
                    <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      Track outstanding credit, trust rating, and send instant WhatsApp invoices
                    </p>
                  </div>
                  <button 
                    onClick={() => setIsAddJobOpen(true)}
                    className="amount-chip-btn"
                    style={{ background: '#2563eb', color: '#ffffff', borderColor: '#2563eb' }}
                  >
                    + New Khata Bill
                  </button>
                </div>

                <div className="transaction-list-card">
                  {filteredCustomers.map((customer) => {
                    const creditPct = Math.min(100, Math.round((customer.balance / customer.creditLimit) * 100));
                    const isHighRisk = customer.trustScore < 70 || creditPct > 85;

                    return (
                      <div key={customer.id} className="transaction-row-item">
                        <div className="transaction-left-group">
                          <div className="trans-icon-box trans-icon-blue" style={{ fontWeight: 800 }}>
                            {customer.name.charAt(0)}
                          </div>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <span className="trans-title">{customer.name}</span>
                              <span className={customer.trustScore >= 80 ? 'badge-soft-green' : 'badge-soft-amber'} style={{ padding: '1px 6px', borderRadius: 999, fontSize: '0.65rem', fontWeight: 700 }}>
                                {customer.trustScore}% Trust
                              </span>
                            </div>
                            <div className="trans-subtitle">
                              {customer.village} • +91 {customer.phone}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: 2 }}>
                              Limit: ₹{customer.creditLimit.toLocaleString('en-IN')} ({creditPct}% used)
                            </div>
                          </div>
                        </div>

                        <div className="trans-right-amount">
                          <div className="trans-amount-bold" style={{ color: isHighRisk ? '#dc2626' : '#0f172a' }}>
                            ₹{customer.balance.toLocaleString('en-IN')}
                          </div>
                          <span style={{ fontSize: '0.68rem', color: '#64748b' }}>Balance Due</span>
                          <div style={{ display: 'flex', gap: 4, marginTop: 4, justifyContent: 'flex-end' }}>
                            <button
                              onClick={() => openKhataModal(customer)}
                              style={{ padding: '4px 8px', borderRadius: 6, background: '#f1f5f9', border: '1px solid #cbd5e1', color: '#334155', fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer' }}
                            >
                              Ledger
                            </button>
                            <button
                              onClick={() => openWhatsAppModal(customer)}
                              style={{ padding: '4px 8px', borderRadius: 6, background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#059669', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3 }}
                            >
                              <Share2 style={{ width: 11, height: 11 }} /> WhatsApp
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* VIEW TAB 3: ALL FIELD LOGS */}
            {activeTab === 'jobs' && (
              <div className="app-section">
                <div className="section-header-row">
                  <div>
                    <h2 className="section-main-title">Field Work Operations</h2>
                    <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      Hour-meter logs, implement rates, and geotag proof
                    </p>
                  </div>
                  <button 
                    onClick={() => setIsAddJobOpen(true)}
                    className="amount-chip-btn"
                    style={{ background: '#2563eb', color: '#ffffff', borderColor: '#2563eb' }}
                  >
                    + Record Operation
                  </button>
                </div>

                <div className="transaction-list-card">
                  {filteredJobs.map((job) => {
                    const customerObj = customers.find(c => c.name.toLowerCase() === job.customer.toLowerCase()) || {
                      name: job.customer,
                      village: 'Local Field',
                      phone: '9826144102',
                      balance: job.totalAmount
                    };

                    return (
                      <div key={job.id} className="transaction-row-item">
                        <div className="transaction-left-group">
                          <div className="trans-icon-box trans-icon-green">
                            <Tractor style={{ width: 22, height: 22 }} />
                          </div>
                          <div>
                            <div className="trans-title">{job.customer}</div>
                            <div className="trans-subtitle">
                              {job.machine} • {job.implement}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: 2, fontFamily: 'var(--font-mono)' }}>
                              Meter: {job.startMeter} → {job.endMeter} ({job.units} {job.billingType === 'Per Hour' ? 'hrs' : 'acres'})
                            </div>
                            <div style={{ fontSize: '0.65rem', color: '#059669', display: 'flex', alignItems: 'center', gap: 3, marginTop: 2 }}>
                              <CheckCircle2 style={{ width: 11, height: 11 }} /> {job.gpsCoords}
                            </div>
                          </div>
                        </div>

                        <div className="trans-right-amount">
                          <div className="trans-amount-bold trans-amount-credit">
                            + ₹{job.totalAmount.toLocaleString('en-IN')}
                          </div>
                          <span style={{ fontSize: '0.68rem', color: '#64748b' }}>{job.date}</span>
                          <div style={{ marginTop: 4 }}>
                            <button
                              onClick={() => openWhatsAppModal(customerObj, job)}
                              style={{ padding: '4px 8px', borderRadius: 6, background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#059669', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 3 }}
                            >
                              <Share2 style={{ width: 11, height: 11 }} /> WhatsApp
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* VIEW TAB 4: DIESEL AUDIT & THEFT DETECTOR */}
            {activeTab === 'diesel' && (
              <div className="app-section">
                <div className="section-header-row">
                  <div>
                    <h2 className="section-main-title">Fuel Audit & Siphon Theft Detection</h2>
                    <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      Consumption benchmarks, pump receipts, and burn rate anomaly alerts
                    </p>
                  </div>
                  <button 
                    onClick={() => setIsAddDieselOpen(true)}
                    className="amount-chip-btn"
                    style={{ background: '#f59e0b', color: '#ffffff', borderColor: '#f59e0b' }}
                  >
                    + Log Fuel Slip
                  </button>
                </div>

                <div className="transaction-list-card">
                  {dieselLogs.map((log) => (
                    <div key={log.id} className="transaction-row-item">
                      <div className="transaction-left-group">
                        <div className={`trans-icon-box ${log.anomalyAlert ? 'trans-icon-purple' : 'trans-icon-amber'}`}>
                          <Fuel style={{ width: 22, height: 22 }} />
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span className="trans-title">{log.machine}</span>
                            <span className={log.anomalyAlert ? 'badge-soft-rose' : 'badge-soft-green'} style={{ padding: '1px 6px', borderRadius: 999, fontSize: '0.65rem', fontWeight: 700 }}>
                              {log.anomalyAlert ? 'Theft Alert' : 'Normal Burn'}
                            </span>
                          </div>
                          <div className="trans-subtitle">
                            {log.pumpName} • Meter: {log.meterReadingAtFill} hrs
                          </div>
                          <div style={{ fontSize: '0.72rem', color: log.anomalyAlert ? '#dc2626' : '#059669', fontWeight: 600, marginTop: 2 }}>
                            {log.consumptionStatus}
                          </div>
                        </div>
                      </div>

                      <div className="trans-right-amount">
                        <div className="trans-amount-bold" style={{ color: '#0f172a' }}>
                          ₹{log.totalCost.toLocaleString('en-IN')}
                        </div>
                        <span style={{ fontSize: '0.72rem', color: '#d97706', fontWeight: 700 }}>{log.liters} L</span>
                        <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: 2 }}>{log.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* VIEW TAB 5: FLEET HEALTH */}
            {activeTab === 'fleet' && (
              <div className="app-section">
                <FleetHealthView 
                  machines={machines}
                  onAddServiceNote={() => alert("Service note logged")}
                  onOpenAddMachine={() => setIsAddMachineOpen(true)}
                />
              </div>
            )}

          </div>
        )}

        </div>

        {/* Floating Bottom Navigation Bar (Matching Reference) */}
        <div className="floating-bottom-nav">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`bottom-nav-item ${activeTab === 'overview' ? 'active' : ''}`}
          >
            <HomeIcon style={{ width: 20, height: 20 }} />
            <span>Dashboard</span>
          </button>

          <button 
            onClick={() => setActiveTab('khata')}
            className={`bottom-nav-item ${activeTab === 'khata' ? 'active' : ''}`}
          >
            <Users style={{ width: 20, height: 20 }} />
            <span>Khata</span>
          </button>

          {/* Elevated Circular Center Action Button matching Reference UI */}
          <button 
            onClick={() => setIsAddJobOpen(true)}
            className="floating-center-add-btn"
            title="Record New Job"
          >
            <Plus style={{ width: 26, height: 26 }} />
          </button>

          <button 
            onClick={() => setActiveTab('fleet')}
            className={`bottom-nav-item ${activeTab === 'fleet' ? 'active' : ''}`}
          >
            <Tractor style={{ width: 20, height: 20 }} />
            <span>Fleet</span>
          </button>

          <button 
            onClick={() => setIsBankReportOpen(true)}
            className="bottom-nav-item"
          >
            <BarChart3 style={{ width: 20, height: 20 }} />
            <span>Reports</span>
          </button>
        </div>

      </div>

      {/* Modals */}
      <VoiceAssistantModal
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        onApplyJobFromOcr={(parsedJob) => {
          handleSaveJob({
            id: `job-ocr-${Date.now()}`,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            customer: parsedJob.customer,
            machine: parsedJob.machine,
            driver: 'Sukhwinder Singh',
            implement: parsedJob.implement,
            billingType: 'Per Hour',
            rate: parsedJob.rate,
            units: parsedJob.units,
            totalAmount: parsedJob.totalAmount,
            startMeter: parsedJob.startMeter,
            endMeter: parsedJob.endMeter,
            fieldLocation: parsedJob.fieldLocation,
            gpsVerified: true,
            gpsCoords: "22.7533° N, 78.3582° E (OCR Geotag)",
            hasPhotoProof: true,
            isPaid: false,
            signatureVerified: true,
          });
        }}
      />

      <CustomerKhataModal
        customer={selectedCustomerForKhata}
        isOpen={!!selectedCustomerForKhata}
        onClose={() => setSelectedCustomerForKhata(null)}
        onOpenWhatsAppBill={(c) => {
          setSelectedCustomerForKhata(null);
          openWhatsAppModal(c);
        }}
        onAddPayment={handleAddPayment}
      />

      <WhatsAppInvoiceModal
        customer={selectedCustomerForBill}
        job={selectedJobForBill}
        isOpen={!!selectedCustomerForBill}
        onClose={() => {
          setSelectedCustomerForBill(null);
          setSelectedJobForBill(null);
        }}
      />

      <AddJobModal
        isOpen={isAddJobOpen}
        onClose={() => setIsAddJobOpen(false)}
        machines={machines}
        customers={customers}
        drivers={drivers}
        onSaveJob={handleSaveJob}
      />

      <AddDieselModal
        isOpen={isAddDieselOpen}
        onClose={() => setIsAddDieselOpen(false)}
        machines={machines}
        onSaveDiesel={handleSaveDiesel}
      />

      <BankReportModal
        isOpen={isBankReportOpen}
        onClose={() => setIsBankReportOpen(false)}
        machines={machines}
        customers={customers}
        jobs={jobs}
        dieselLogs={dieselLogs}
      />

      {/* Add Machine Modal */}
      <AddMachineModal
        isOpen={isAddMachineOpen}
        onClose={() => setIsAddMachineOpen(false)}
        onSaveMachine={handleSaveMachine}
        drivers={drivers}
      />

      {/* Settings & Account Switch Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onOpenConfig={() => setIsSupabaseConfigOpen(true)}
        currentRole={currentRole}
        setRole={setRole}
      />

      {/* Supabase Database Connection & Configuration Modal */}
      <SupabaseConfigModal
        isOpen={isSupabaseConfigOpen}
        onClose={() => setIsSupabaseConfigOpen(false)}
      />

    </div>
  );
}
