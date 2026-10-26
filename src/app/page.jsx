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
import AddCustomerModal from '../components/AddCustomerModal';
import FleetHealthView from '../components/FleetHealthView';
import BankReportModal from '../components/BankReportModal';
import AuthModal from '../components/AuthModal';
import SupabaseConfigModal from '../components/SupabaseConfigModal';
import SqliteInfoModal from '../components/SqliteInfoModal';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  fetchSupabaseCustomers, 
  fetchSupabaseMachines, 
  fetchSupabaseJobs, 
  fetchSupabaseDieselLogs, 
  insertSupabaseJob, 
  insertSupabaseDiesel,
  insertSupabaseMachine,
  insertSupabaseCustomer,
  fetchSqliteSnapshot,
  insertSqliteJob,
  insertSqliteDiesel,
  insertSqliteMachine,
  insertSqliteCustomer,
  insertSqliteDriver,
  addSqlitePayment
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
  UserPlus,
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
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [isBankReportOpen, setIsBankReportOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSupabaseConfigOpen, setIsSupabaseConfigOpen] = useState(false);
  const [isSqliteInfoOpen, setIsSqliteInfoOpen] = useState(false);

  const [selectedCustomerForKhata, setSelectedCustomerForKhata] = useState(null);
  const [selectedCustomerForBill, setSelectedCustomerForBill] = useState(null);
  const [selectedJobForBill, setSelectedJobForBill] = useState(null);

  // Load data from SQLite database on mount
  const refreshFromSqlite = async () => {
    try {
      const snap = await fetchSqliteSnapshot();
      if (snap && snap.success) {
        if (snap.customers !== undefined) setCustomers(snap.customers);
        if (snap.machines !== undefined) setMachines(snap.machines);
        if (snap.jobs !== undefined) setJobs(snap.jobs);
        if (snap.dieselLogs !== undefined) setDieselLogs(snap.dieselLogs);
        if (snap.drivers !== undefined) setDrivers(snap.drivers);
      }
    } catch (err) {
      console.warn('SQLite load error:', err);
    }
  };

  useEffect(() => {
    refreshFromSqlite();
  }, []);

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
    // Persist to local SQLite DB
    insertSqliteJob(newJob);
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
    // Persist to local SQLite DB
    insertSqliteDiesel(newDiesel);
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
    // Persist to local SQLite DB
    addSqlitePayment(customerId, amount, mode, barterDetail);

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
    insertSqliteMachine(newMachine);
    insertSupabaseMachine(newMachine);
    setMachines(prev => [newMachine, ...prev]);
  };

  const handleSaveCustomer = (newCustomer) => {
    insertSqliteCustomer(newCustomer);
    insertSupabaseCustomer(newCustomer);
    setCustomers(prev => [newCustomer, ...prev]);
  };

  const handleSaveDriver = (newDriver) => {
    insertSqliteDriver(newDriver);
    setDrivers(prev => [newDriver, ...prev]);
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
          onOpenSqliteInfo={() => setIsSqliteInfoOpen(true)}
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
                <span className="balance-card-label">{language === 'hi' ? 'बकाया राशि' : 'Receivables'}</span>
                <div className="pill-selector">
                  <span>{language === 'hi' ? 'खाता' : 'Ledger'}</span>
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
                  <ArrowUpRight style={{ width: 13, height: 13 }} /> ₹{totalOutstanding.toLocaleString('en-IN')}
                </span>
                <span className="balance-chip balance-chip-expense">
                  <ArrowDownRight style={{ width: 13, height: 13 }} /> ₹{totalDieselExpense.toLocaleString('en-IN')}
                </span>
                <span className="balance-chip">
                  {totalHoursToday.toFixed(1)}h
                </span>
              </div>
            </div>

            {/* Quick Action Circles Strip (matching reference UI) */}
            <div className="quick-action-strip">
              <button 
                onClick={() => setIsAddJobOpen(true)}
                className="action-circle-item"
                title="Record Job / नया कार्य दर्ज करें"
              >
                <div className="action-icon-bubble action-bubble-green">
                  <Plus style={{ width: 22, height: 22 }} />
                </div>
                <span className="action-bubble-label">{language === 'hi' ? 'कार्य' : 'Record'}</span>
              </button>

              <button 
                onClick={() => setIsAddDieselOpen(true)}
                className="action-circle-item"
                title="Log Fuel Slip / डीजल पर्ची दर्ज करें"
              >
                <div className="action-icon-bubble action-bubble-amber">
                  <Fuel style={{ width: 20, height: 20 }} />
                </div>
                <span className="action-bubble-label">{language === 'hi' ? 'डीजल' : 'Fuel'}</span>
              </button>

              <button 
                onClick={() => setIsVoiceOpen(true)}
                className="action-circle-item"
                title="Voice Assistant / आवाज सहायक"
              >
                <div className="action-icon-bubble action-bubble-purple">
                  <Mic style={{ width: 20, height: 20 }} />
                </div>
                <span className="action-bubble-label">{language === 'hi' ? 'आवाज' : 'Voice'}</span>
              </button>

              <button 
                onClick={() => setIsBankReportOpen(true)}
                className="action-circle-item"
                title="Bank Statement & P&L / बैंक रिपोर्ट"
              >
                <div className="action-icon-bubble action-bubble-blue">
                  <BarChart3 style={{ width: 20, height: 20 }} />
                </div>
                <span className="action-bubble-label">{language === 'hi' ? 'लेखा' : 'P&L'}</span>
              </button>

              <button 
                onClick={() => setIsAddCustomerOpen(true)}
                className="action-circle-item"
                title="Add Farmer / नया किसान जोड़ें"
              >
                <div className="action-icon-bubble" style={{ background: '#2563eb', color: '#ffffff' }}>
                  <UserPlus style={{ width: 20, height: 20 }} />
                </div>
                <span className="action-bubble-label">{language === 'hi' ? 'किसान' : 'Farmer'}</span>
              </button>

              <button 
                onClick={() => setIsAddMachineOpen(true)}
                className="action-circle-item"
                title="Add Machinery / नई मशीन जोड़ें"
              >
                <div className="action-icon-bubble" style={{ background: '#059669', color: '#ffffff' }}>
                  <Tractor style={{ width: 20, height: 20 }} />
                </div>
                <span className="action-bubble-label">{language === 'hi' ? 'मशीन' : 'Machine'}</span>
              </button>
            </div>

            {/* Segmented Filter Pills (matching reference 1D 1W 1M 3M / Manage Invest) */}
            <div className="segmented-pill-bar">
              <button 
                onClick={() => setActiveTab('overview')}
                className={`segmented-pill-btn ${activeTab === 'overview' ? 'active' : ''}`}
              >
                {language === 'hi' ? 'अवलोकन' : 'Overview'}
              </button>
              <button 
                onClick={() => setActiveTab('khata')}
                className={`segmented-pill-btn ${activeTab === 'khata' ? 'active' : ''}`}
              >
                {language === 'hi' ? 'खाता' : 'Khata'}
              </button>
              <button 
                onClick={() => setActiveTab('jobs')}
                className={`segmented-pill-btn ${activeTab === 'jobs' ? 'active' : ''}`}
              >
                {language === 'hi' ? 'कार्य' : 'Jobs'}
              </button>
              <button 
                onClick={() => setActiveTab('diesel')}
                className={`segmented-pill-btn ${activeTab === 'diesel' ? 'active' : ''}`}
              >
                {language === 'hi' ? 'डीजल' : 'Diesel'}
              </button>
              <button 
                onClick={() => setActiveTab('fleet')}
                className={`segmented-pill-btn ${activeTab === 'fleet' ? 'active' : ''}`}
              >
                {language === 'hi' ? 'फ्लीट' : 'Fleet'}
              </button>
            </div>

            {/* VIEW TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div>
                
                {/* Machine Utilization Donut Ring (matching reference "Your Account Spendings") */}
                <div className="app-section">
                  <div className="donut-spending-card">
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                      <span className="section-main-title" style={{ fontSize: '0.95rem' }}>
                        {language === 'hi' ? 'आज फ्लीट उपयोग' : 'Fleet Utilization Today'}
                      </span>
                      <span className="badge-soft-green" style={{ padding: '2px 8px', borderRadius: 999, fontSize: '0.68rem', fontWeight: 700 }}>
                        {activeMachineCount} of {machines.length} {language === 'hi' ? 'सक्रिय' : 'Active'}
                      </span>
                    </div>

                    <div className="donut-visual-container">
                      <svg width="140" height="140" viewBox="0 0 140 140">
                        {/* Background ring */}
                        <circle cx="70" cy="70" r="54" fill="none" stroke="#f1f5f9" strokeWidth="12" />
                        {totalHoursToday > 0 && (
                          <circle 
                            cx="70" 
                            cy="70" 
                            r="54" 
                            fill="none" 
                            stroke="#10b981" 
                            strokeWidth="12"
                            strokeDasharray={`${Math.min(339, Math.round((totalHoursToday / 20) * 339))} 340`} 
                            strokeDashoffset="0" 
                            strokeLinecap="round" 
                          />
                        )}
                      </svg>
                      <div className="donut-center-stat">
                        <div className="donut-center-number">{totalHoursToday.toFixed(1)}h</div>
                        <div className="donut-center-sub">{language === 'hi' ? 'कुल घंटे' : 'Hours'}</div>
                      </div>
                    </div>

                    {machines.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '12px 10px', fontSize: '0.78rem', color: '#64748b' }}>
                        {language === 'hi' ? 'कोई मशीन नहीं जुड़ी है। मशीन जोड़ने के लिए "मशीन" पर टैप करें।' : 'No machines registered yet. Tap "Machine" above to add your first tractor.'}
                      </div>
                    ) : (
                      <div className="donut-legend-chips">
                        {machines.map((m) => {
                          const isAct = m.status === 'Active';
                          return (
                            <span 
                              key={m.id} 
                              className="legend-badge" 
                              style={{ 
                                background: isAct ? '#ecfdf5' : '#f1f5f9', 
                                color: isAct ? '#059669' : '#475569' 
                              }}
                            >
                              <span style={{ width: 8, height: 8, borderRadius: '50%', background: isAct ? '#10b981' : '#94a3b8' }}></span>
                              {m.name} ({m.dailyHours || 0}h)
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Recent Field Logs (Styled like "Transactions" in reference Dashboard 1 & 4) */}
                <div className="app-section">
                  <div className="section-header-row">
                    <h3 className="section-main-title">{language === 'hi' ? 'हाल के कार्य' : 'Recent Field Operations'}</h3>
                    <span 
                      onClick={() => setActiveTab('jobs')}
                      className="section-link-action"
                    >
                      <span>{language === 'hi' ? 'सभी देखें' : 'View All'} ({jobs.length})</span>
                      <ChevronRight style={{ width: 14, height: 14 }} />
                    </span>
                  </div>

                  <div className="transaction-list-card">
                    {filteredJobs.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '24px 16px', color: '#64748b', fontSize: '0.82rem' }}>
                        <p style={{ fontWeight: 700, color: '#334155' }}>
                          {language === 'hi' ? 'कोई कार्य दर्ज नहीं' : 'No field operations recorded'}
                        </p>
                        <p style={{ fontSize: '0.75rem', marginTop: 4 }}>
                          {language === 'hi' ? 'पहला कार्य जोड़ने के लिए ऊपर "कार्य" पर टैप करें।' : 'Tap "Record" above to log your first field operation.'}
                        </p>
                      </div>
                    ) : (
                      filteredJobs.slice(0, 3).map((job) => {
                        const customerObj = customers.find(c => c.name.toLowerCase() === job.customer.toLowerCase()) || {
                          name: job.customer,
                          village: job.village || 'Field',
                          phone: '',
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
                      })
                    )}
                  </div>
                </div>

                {/* Farmer Khata Watchlist (Styled like "Top Gainers / Stocks Watchlist" in reference Dashboard 2) */}
                <div className="app-section">
                  <div className="section-header-row">
                    <h3 className="section-main-title">{language === 'hi' ? 'किसान खाता सूची' : 'Farmer Khata & Trust Scores'}</h3>
                    <span 
                      onClick={() => setActiveTab('khata')}
                      className="section-link-action"
                    >
                      <span>{language === 'hi' ? 'सभी खाते' : 'All Accounts'} ({customers.length})</span>
                      <ChevronRight style={{ width: 14, height: 14 }} />
                    </span>
                  </div>

                  <div className="transaction-list-card">
                    {filteredCustomers.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '24px 16px', color: '#64748b', fontSize: '0.82rem' }}>
                        <p style={{ fontWeight: 700, color: '#334155' }}>
                          {language === 'hi' ? 'कोई किसान खाता नहीं' : 'No farmers in Khata yet'}
                        </p>
                        <p style={{ fontSize: '0.75rem', marginTop: 4 }}>
                          {language === 'hi' ? 'नया खाता खोलने के लिए ऊपर "किसान" पर टैप करें।' : 'Tap "Farmer" above to add your first customer ledger.'}
                        </p>
                      </div>
                    ) : (
                      filteredCustomers.slice(0, 3).map((customer) => {
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
                      })
                    )}
                  </div>
                </div>

                {/* Monthly Work Targets (matching reference "Monthly Budgets") */}
                <div className="app-section">
                  {(() => {
                    const totalLoggedHours = jobs.reduce((sum, j) => sum + (j.billingType === 'Per Hour' ? (Number(j.units) || 0) : 0), 0);
                    const targetHours = 100;
                    const targetPct = targetHours > 0 ? Math.min(100, Math.round((totalLoggedHours / targetHours) * 100)) : 0;
                    return (
                      <div style={{ padding: 18, borderRadius: 20, background: '#ffffff', border: '1px solid #edf2f7', boxShadow: 'var(--shadow-card)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a' }}>
                            {language === 'hi' ? 'मासिक कार्य लक्ष्य' : 'Monthly Field Target'}
                          </span>
                          <span className="badge-soft-blue" style={{ padding: '2px 8px', borderRadius: 999, fontSize: '0.7rem', fontWeight: 700 }}>
                            {targetPct}% {language === 'hi' ? 'पूर्ण' : 'Reached'}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: 10 }}>
                          {totalLoggedHours.toFixed(1)} of {targetHours}h {language === 'hi' ? 'नियोजित घंटे पूर्ण' : 'planned tractor hours logged'}
                        </div>
                        <div style={{ width: '100%', height: 8, borderRadius: 999, background: '#f1f5f9', overflow: 'hidden' }}>
                          <div style={{ width: `${targetPct}%`, height: '100%', borderRadius: 999, background: 'linear-gradient(90deg, #3b82f6, #2563eb)' }}></div>
                        </div>
                      </div>
                    );
                  })()}
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
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button 
                      onClick={() => setIsAddCustomerOpen(true)}
                      className="amount-chip-btn"
                      style={{ background: '#eff6ff', color: '#2563eb', borderColor: '#bfdbfe' }}
                    >
                      + Add Farmer
                    </button>
                    <button 
                      onClick={() => setIsAddJobOpen(true)}
                      className="amount-chip-btn"
                      style={{ background: '#2563eb', color: '#ffffff', borderColor: '#2563eb' }}
                    >
                      + New Khata Bill
                    </button>
                  </div>
                </div>

                <div className="transaction-list-card">
                  {filteredCustomers.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '36px 16px', color: '#64748b' }}>
                      <Users style={{ width: 36, height: 36, margin: '0 auto 10px', color: '#94a3b8' }} />
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#334155' }}>
                        {language === 'hi' ? 'कोई किसान खाता नहीं मिला' : 'No Farmer Accounts Found'}
                      </div>
                      <div style={{ fontSize: '0.75rem', marginTop: 4, marginBottom: 14 }}>
                        {language === 'hi' ? 'नया किसान जोड़ने के लिए नीचे दिए बटन पर क्लिक करें' : 'Click the button below to register a farmer and manage their ledger'}
                      </div>
                      <button 
                        onClick={() => setIsAddCustomerOpen(true)}
                        className="amount-chip-btn"
                        style={{ background: '#2563eb', color: '#ffffff', borderColor: '#2563eb', padding: '6px 14px' }}
                      >
                        + {language === 'hi' ? 'किसान जोड़ें' : 'Add Farmer'}
                      </button>
                    </div>
                  ) : (
                    filteredCustomers.map((customer) => {
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
                    })
                  )}
                </div>
              </div>
            )}

            {/* VIEW TAB 3: ALL FIELD LOGS */}
            {activeTab === 'jobs' && (
              <div className="app-section">
                <div className="section-header-row">
                  <div>
                    <h2 className="section-main-title">{language === 'hi' ? 'खेत कार्य लॉग' : 'Field Work Operations'}</h2>
                    <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      {language === 'hi' ? 'घंटे-मीटर रीडिंग, इंप्लीमेंट दर और जियोटैग साक्ष्य' : 'Hour-meter logs, implement rates, and geotag proof'}
                    </p>
                  </div>
                  <button 
                    onClick={() => setIsAddJobOpen(true)}
                    className="amount-chip-btn"
                    style={{ background: '#2563eb', color: '#ffffff', borderColor: '#2563eb' }}
                  >
                    + {language === 'hi' ? 'कार्य दर्ज करें' : 'Record Operation'}
                  </button>
                </div>

                <div className="transaction-list-card">
                  {filteredJobs.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '36px 16px', color: '#64748b' }}>
                      <Tractor style={{ width: 36, height: 36, margin: '0 auto 10px', color: '#94a3b8' }} />
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#334155' }}>
                        {language === 'hi' ? 'कोई खेत कार्य दर्ज नहीं है' : 'No Field Operations Logged'}
                      </div>
                      <div style={{ fontSize: '0.75rem', marginTop: 4, marginBottom: 14 }}>
                        {language === 'hi' ? 'ट्रैक्टर कार्य रिकॉर्ड करने के लिए नीचे क्लिक करें' : 'Click the button below to record field work hours and rates'}
                      </div>
                      <button 
                        onClick={() => setIsAddJobOpen(true)}
                        className="amount-chip-btn"
                        style={{ background: '#2563eb', color: '#ffffff', borderColor: '#2563eb', padding: '6px 14px' }}
                      >
                        + {language === 'hi' ? 'कार्य दर्ज करें' : 'Record Operation'}
                      </button>
                    </div>
                  ) : (
                    filteredJobs.map((job) => {
                      const customerObj = customers.find(c => c.name.toLowerCase() === job.customer.toLowerCase()) || {
                        name: job.customer,
                        village: job.village || 'Field',
                        phone: '',
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
                    })
                  )}
                </div>
              </div>
            )}

            {/* VIEW TAB 4: DIESEL AUDIT & THEFT DETECTOR */}
            {activeTab === 'diesel' && (
              <div className="app-section">
                <div className="section-header-row">
                  <div>
                    <h2 className="section-main-title">{language === 'hi' ? 'डीजल ऑडिट व चोरी निवारण' : 'Fuel Audit & Siphon Detection'}</h2>
                    <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      {language === 'hi' ? 'ईंधन खपत मानक, पेट्रोल पंप रसीद और असामान्य खपत अलर्ट' : 'Consumption benchmarks, pump receipts, and burn rate anomaly alerts'}
                    </p>
                  </div>
                  <button 
                    onClick={() => setIsAddDieselOpen(true)}
                    className="amount-chip-btn"
                    style={{ background: '#f59e0b', color: '#ffffff', borderColor: '#f59e0b' }}
                  >
                    + {language === 'hi' ? 'डीजल पर्ची' : 'Log Fuel Slip'}
                  </button>
                </div>

                <div className="transaction-list-card">
                  {dieselLogs.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '36px 16px', color: '#64748b' }}>
                      <Fuel style={{ width: 36, height: 36, margin: '0 auto 10px', color: '#f59e0b' }} />
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#334155' }}>
                        {language === 'hi' ? 'कोई डीजल पर्ची दर्ज नहीं है' : 'No Fuel Slips Logged'}
                      </div>
                      <div style={{ fontSize: '0.75rem', marginTop: 4, marginBottom: 14 }}>
                        {language === 'hi' ? 'पेट्रोल पंप से डीजल भराई दर्ज करने के लिए नीचे क्लिक करें' : 'Click the button below to log fuel fills and audit burn rates'}
                      </div>
                      <button 
                        onClick={() => setIsAddDieselOpen(true)}
                        className="amount-chip-btn"
                        style={{ background: '#f59e0b', color: '#ffffff', borderColor: '#f59e0b', padding: '6px 14px' }}
                      >
                        + {language === 'hi' ? 'डीजल पर्ची' : 'Log Fuel Slip'}
                      </button>
                    </div>
                  ) : (
                    dieselLogs.map((log) => (
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
                    ))
                  )}
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
        onAddCustomer={handleSaveCustomer}
        onAddMachine={handleSaveMachine}
        onAddDriver={handleSaveDriver}
      />

      {/* Add Farmer / Customer Modal */}
      <AddCustomerModal
        isOpen={isAddCustomerOpen}
        onClose={() => setIsAddCustomerOpen(false)}
        onSaveCustomer={handleSaveCustomer}
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
        drivers={drivers}
      />

      {/* Add Machine Modal */}
      <AddMachineModal
        isOpen={isAddMachineOpen}
        onClose={() => setIsAddMachineOpen(false)}
        onSaveMachine={handleSaveMachine}
        drivers={drivers}
        onAddDriver={handleSaveDriver}
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

      {/* SQLite Database Information & Stats Modal */}
      <SqliteInfoModal
        isOpen={isSqliteInfoOpen}
        onClose={() => setIsSqliteInfoOpen(false)}
        onOpenSupabaseConfig={() => setIsSupabaseConfigOpen(true)}
        onRefreshData={refreshFromSqlite}
      />

    </div>
  );
}
