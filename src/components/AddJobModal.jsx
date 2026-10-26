'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle,
  PlusCircle,
  UserPlus,
  Tractor,
  Layers,
  MapPin,
  Phone,
  Check,
  Settings,
  Plus,
  UserCheck
} from 'lucide-react';
import { saveSqliteRates, fetchSqliteRates } from '../lib/dbService';

export default function AddJobModal({ 
  isOpen, 
  onClose, 
  machines = [], 
  customers = [], 
  drivers = [], 
  onSaveJob,
  onAddCustomer,
  onAddMachine,
  onAddDriver
}) {
  // Default Standard Rates State (load from localStorage / SQLite)
  const [defaultRates, setDefaultRates] = useState({
    'Per Hour': 900,
    'Per Acre': 1400,
    'Per Trip': 600,
    'Flat Rate': 2500
  });

  const [isRateSettingsOpen, setIsRateSettingsOpen] = useState(false);
  const [tempDefaultRates, setTempDefaultRates] = useState({ ...defaultRates });

  // Main Form States
  const [customerId, setCustomerId] = useState(customers[0]?.id || '');
  const [machineId, setMachineId] = useState(machines[0]?.id || '');
  const [driverName, setDriverName] = useState(drivers[0]?.name || 'Self / Owner Operated');
  const [implement, setImplement] = useState('Rotavator (Shaktiman 7ft)');
  const [billingType, setBillingType] = useState('Per Hour');
  const [rate, setRate] = useState(900);
  const [units, setUnits] = useState(4.0);
  const [startMeter, setStartMeter] = useState(0);
  const [endMeter, setEndMeter] = useState(4.0);
  const [fieldLocation, setFieldLocation] = useState('');

  // Quick Customer Creation States
  const [isAddingNewCustomer, setIsAddingNewCustomer] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerVillage, setNewCustomerVillage] = useState('');
  const [newCustomerPhone, setNewCustomerPhone] = useState('');
  const [quickAddError, setQuickAddError] = useState('');
  const [customerSuccessNote, setCustomerSuccessNote] = useState('');

  // Quick Machine Creation States
  const [isAddingNewMachine, setIsAddingNewMachine] = useState(false);
  const [newMachineName, setNewMachineName] = useState('');
  const [newMachineRegNo, setNewMachineRegNo] = useState('');
  const [newMachineType, setNewMachineType] = useState('Tractor');
  const [newMachineMeter, setNewMachineMeter] = useState(0);
  const [machineError, setMachineError] = useState('');
  const [machineSuccessNote, setMachineSuccessNote] = useState('');

  // Quick Driver Creation States
  const [isAddingNewDriver, setIsAddingNewDriver] = useState(false);
  const [newDriverName, setNewDriverName] = useState('');
  const [newDriverPhone, setNewDriverPhone] = useState('');
  const [driverError, setDriverError] = useState('');

  // Load standard rates on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('tr_standard_rates');
      if (saved) {
        const parsed = JSON.parse(saved);
        setDefaultRates(parsed);
        setTempDefaultRates(parsed);
        if (parsed[billingType]) {
          setRate(parsed[billingType]);
        }
      } else {
        fetchSqliteRates().then((res) => {
          if (res) {
            setDefaultRates(res);
            setTempDefaultRates(res);
            if (res[billingType]) setRate(res[billingType]);
          }
        });
      }
    } catch (e) {}
  }, []);

  // Sync default machine/customer on open or change
  useEffect(() => {
    if (machines.length > 0 && (!machineId || !machines.some(m => m.id === machineId))) {
      setMachineId(machines[0].id);
      const cur = parseFloat(machines[0].currentMeter) || 0;
      setStartMeter(cur);
      setEndMeter(cur + units);
    }
    if (customers.length > 0 && (!customerId || !customers.some(c => c.id === customerId))) {
      setCustomerId(customers[0].id);
    }
  }, [machines, customers]);

  if (!isOpen) return null;

  const selectedCustomer = customers.find(c => c.id === customerId) || customers[0] || {
    id: 'c-temp',
    name: 'Customer',
    village: ''
  };
  const selectedMachine = machines.find(m => m.id === machineId) || machines[0];
  const totalAmount = billingType === 'Flat Rate' ? Math.round(rate) : Math.round(rate * units);

  const handleUnitChange = (val) => {
    const u = parseFloat(val) || 0;
    setUnits(u);
    if (billingType === 'Per Hour') {
      setEndMeter(parseFloat((startMeter + u).toFixed(1)));
    }
  };

  const handleBillingTypeChange = (type) => {
    setBillingType(type);
    const standardRate = defaultRates[type] || (type === 'Per Hour' ? 900 : type === 'Per Acre' ? 1400 : type === 'Per Trip' ? 600 : 2500);
    setRate(standardRate);
  };

  const handleSaveDefaultRates = () => {
    setDefaultRates(tempDefaultRates);
    setRate(tempDefaultRates[billingType] || rate);
    try {
      localStorage.setItem('tr_standard_rates', JSON.stringify(tempDefaultRates));
      saveSqliteRates(tempDefaultRates);
    } catch (e) {}
    setIsRateSettingsOpen(false);
  };

  const handleQuickAddCustomer = (e) => {
    if (e) e.preventDefault();
    setQuickAddError('');

    if (!newCustomerName.trim()) {
      setQuickAddError('Please enter farmer name / किसान का नाम दर्ज करें');
      return false;
    }

    const createdCustomer = {
      id: `c-${Date.now()}`,
      name: newCustomerName.trim(),
      village: newCustomerVillage.trim() || '',
      phone: newCustomerPhone.trim() || '',
      trustScore: 85,
      creditLimit: 50000,
      totalBilled: 0,
      totalPaid: 0,
      balance: 0,
      mandiDay: 'Monday',
      barterPaid: 'None',
      lastJobDate: 'Today',
      history: []
    };

    if (onAddCustomer) {
      onAddCustomer(createdCustomer);
    }

    setCustomerId(createdCustomer.id);
    setCustomerSuccessNote(createdCustomer.name);
    setIsAddingNewCustomer(false);
    setNewCustomerName('');
    setNewCustomerVillage('');
    setNewCustomerPhone('');
    return createdCustomer;
  };

  const handleQuickAddMachine = (e) => {
    if (e) e.preventDefault();
    setMachineError('');

    if (!newMachineName.trim()) {
      setMachineError('Please enter machine / model name');
      return false;
    }

    const createdMachine = {
      id: `m-${Date.now()}`,
      name: newMachineName.trim(),
      regNo: (newMachineRegNo.trim() || 'RC-NEW').toUpperCase(),
      hp: newMachineType === 'JCB / Excavator' ? '76 HP' : newMachineType === 'Harvester' ? '101 HP' : '50 HP',
      assignedDriver: driverName || 'Self / Owner Operated',
      currentMeter: parseFloat(newMachineMeter) || 0,
      fuelCapacity: 60,
      fuelLevel: 30,
      activeImplement: implement || 'None',
      status: 'Active',
      serviceHoursLeft: 250,
      serviceInterval: 250,
      dailyHours: 0,
      hourlyBurnRate: 4.5,
      expectedBurnRate: 4.5,
      rcExpiry: '2032-01-01',
      insuranceExpiry: '2027-01-01',
      pucExpiry: '2027-01-01',
      fitnessExpiry: '2028-01-01',
    };

    if (onAddMachine) {
      onAddMachine(createdMachine);
    }

    setMachineId(createdMachine.id);
    setStartMeter(createdMachine.currentMeter);
    setEndMeter(createdMachine.currentMeter + units);
    setMachineSuccessNote(createdMachine.name);
    setIsAddingNewMachine(false);
    setNewMachineName('');
    setNewMachineRegNo('');
    setNewMachineMeter(0);
    return createdMachine;
  };

  const handleQuickAddDriver = (e) => {
    if (e) e.preventDefault();
    setDriverError('');

    if (!newDriverName.trim()) {
      setDriverError('Please enter driver name');
      return false;
    }

    const createdDriver = {
      id: `drv-${Date.now()}`,
      name: newDriverName.trim(),
      phone: newDriverPhone.trim() || '',
      assignedMachine: selectedMachine?.name || 'Unassigned',
      shiftStatus: 'Active',
      bhattaBalance: 0
    };

    if (onAddDriver) {
      onAddDriver(createdDriver);
    }

    setDriverName(createdDriver.name);
    setIsAddingNewDriver(false);
    setNewDriverName('');
    setNewDriverPhone('');
    return createdDriver;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let effectiveCustomer = selectedCustomer;
    if (isAddingNewCustomer && newCustomerName.trim()) {
      const created = handleQuickAddCustomer();
      if (created) effectiveCustomer = created;
    }

    let effectiveMachine = selectedMachine;
    if (isAddingNewMachine && newMachineName.trim()) {
      const createdM = handleQuickAddMachine();
      if (createdM) effectiveMachine = createdM;
    }

    if (onSaveJob) {
      onSaveJob({
        id: `job-${Date.now()}`,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        customer: effectiveCustomer?.name || 'Customer',
        customerId: effectiveCustomer?.id || 'c-temp',
        machine: effectiveMachine?.name || 'Machinery',
        machineId: effectiveMachine?.id || 'm-temp',
        driver: driverName || 'Self / Owner Operated',
        implement,
        billingType,
        rate: parseFloat(rate) || 0,
        units: parseFloat(units) || 0,
        totalAmount,
        startMeter: parseFloat(startMeter) || 0,
        endMeter: parseFloat(endMeter) || 0,
        fieldLocation: fieldLocation.trim() || 'Field Work',
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
        style={{ maxHeight: '92vh', overflowY: 'auto' }}
      >
        {/* Header */}
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

        {/* Big Amount Card */}
        <div style={{ background: '#f8fafc', borderRadius: 20, padding: '18px 16px', border: '1px solid #e2e8f0', textAlign: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Total Billed Amount</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-mono)', lineHeight: 1.2 }}>
            ₹{totalAmount.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600, marginTop: 4 }}>
            {billingType === 'Flat Rate' ? 'Flat Rate' : `${units} ${billingType === 'Per Hour' ? 'Hours' : 'Acres'} @ ₹${rate}/${billingType === 'Per Hour' ? 'hr' : 'acre'}`}
          </div>
        </div>

        {/* Preset Chips */}
        {billingType === 'Per Hour' && (
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 16 }}>
            {[2, 3.5, 4, 6, 8].map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => handleUnitChange(h)}
                className={`amount-chip-btn ${units === h ? 'active' : ''}`}
              >
                {h} hrs
              </button>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {/* Customer (Farmer) Selection & Adding Option */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', display: 'block' }}>
                  Customer (Farmer) *
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingNewCustomer(!isAddingNewCustomer);
                    setQuickAddError('');
                  }}
                  style={{
                    background: isAddingNewCustomer ? '#fee2e2' : '#eff6ff',
                    border: isAddingNewCustomer ? '1px solid #fecaca' : '1px solid #bfdbfe',
                    color: isAddingNewCustomer ? '#dc2626' : '#2563eb',
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
                  {isAddingNewCustomer ? <X style={{ width: 11, height: 11 }} /> : <UserPlus style={{ width: 11, height: 11 }} />}
                  <span>{isAddingNewCustomer ? 'Cancel' : '+ Add New'}</span>
                </button>
              </div>

              <select
                value={customerId}
                onChange={(e) => {
                  if (e.target.value === '__add_new__') {
                    setIsAddingNewCustomer(true);
                  } else {
                    setCustomerId(e.target.value);
                  }
                }}
                style={{ 
                  width: '100%', 
                  padding: '10px 12px', 
                  borderRadius: 10, 
                  background: '#ffffff', 
                  border: isAddingNewCustomer ? '1.5px solid #3b82f6' : '1px solid #cbd5e1', 
                  color: '#0f172a', 
                  fontSize: '0.8rem', 
                  outline: 'none' 
                }}
              >
                {customers.length === 0 ? (
                  <option value="">No Farmers Saved</option>
                ) : (
                  customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.village ? `(${c.village})` : ''}
                    </option>
                  ))
                )}
                <option value="__add_new__" style={{ color: '#2563eb', fontWeight: 700, background: '#eff6ff' }}>
                  ➕ + Add New Farmer / Customer...
                </option>
              </select>

              {customerSuccessNote && !isAddingNewCustomer && (
                <div style={{ marginTop: 4, fontSize: '0.68rem', color: '#059669', display: 'flex', alignItems: 'center', gap: 3, fontWeight: 600 }}>
                  <Check style={{ width: 12, height: 12 }} />
                  <span>Selected: {customerSuccessNote}</span>
                </div>
              )}
            </div>

            {/* Machine Selection with In-Modal Add New */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', display: 'block' }}>
                  Machine / Equipment *
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingNewMachine(!isAddingNewMachine);
                    setMachineError('');
                  }}
                  style={{
                    background: isAddingNewMachine ? '#fee2e2' : '#eff6ff',
                    border: isAddingNewMachine ? '1px solid #fecaca' : '1px solid #bfdbfe',
                    color: isAddingNewMachine ? '#dc2626' : '#2563eb',
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
                  {isAddingNewMachine ? <X style={{ width: 11, height: 11 }} /> : <Plus style={{ width: 11, height: 11 }} />}
                  <span>{isAddingNewMachine ? 'Cancel' : '+ Add New'}</span>
                </button>
              </div>

              <select
                value={machineId}
                onChange={(e) => {
                  if (e.target.value === '__add_new_machine__') {
                    setIsAddingNewMachine(true);
                  } else {
                    setMachineId(e.target.value);
                    const found = machines.find(m => m.id === e.target.value);
                    if (found) {
                      const cur = parseFloat(found.currentMeter) || 0;
                      setStartMeter(cur);
                      setEndMeter(cur + units);
                    }
                  }
                }}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 10, background: '#ffffff', border: isAddingNewMachine ? '1.5px solid #3b82f6' : '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.8rem', outline: 'none' }}
              >
                {machines.length === 0 ? (
                  <option value="">No Machinery Saved</option>
                ) : (
                  machines.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} {m.regNo ? `(${m.regNo})` : ''}
                    </option>
                  ))
                )}
                <option value="__add_new_machine__" style={{ color: '#2563eb', fontWeight: 700, background: '#eff6ff' }}>
                  ➕ + Add New Machine / Equipment...
                </option>
              </select>

              {machineSuccessNote && !isAddingNewMachine && (
                <div style={{ marginTop: 4, fontSize: '0.68rem', color: '#059669', display: 'flex', alignItems: 'center', gap: 3, fontWeight: 600 }}>
                  <Check style={{ width: 12, height: 12 }} />
                  <span>Selected: {machineSuccessNote}</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Add Farmer Card when + Add New is clicked */}
          {isAddingNewCustomer && (
            <div style={{ 
              padding: 12, 
              borderRadius: 12, 
              background: '#f8fafc', 
              border: '1.5px dashed #3b82f6',
              boxShadow: '0 2px 8px rgba(37, 99, 235, 0.08)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1e40af', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <UserPlus style={{ width: 14, height: 14 }} />
                  <span>Quick Register Farmer (नया किसान जोड़ें)</span>
                </span>
                <span style={{ fontSize: '0.68rem', color: '#64748b' }}>Instant addition to Khata</span>
              </div>

              {quickAddError && (
                <div style={{ fontSize: '0.72rem', color: '#dc2626', marginBottom: 6, fontWeight: 600 }}>
                  {quickAddError}
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <input
                  type="text"
                  placeholder="Farmer Full Name"
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.8rem', outline: 'none', background: '#ffffff' }}
                  autoFocus
                />
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <input
                    type="text"
                    placeholder="Village / Location"
                    value={newCustomerVillage}
                    onChange={(e) => setNewCustomerVillage(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.8rem', outline: 'none', background: '#ffffff' }}
                  />

                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={newCustomerPhone}
                    onChange={(e) => setNewCustomerPhone(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.8rem', outline: 'none', background: '#ffffff' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: 8, marginTop: 2 }}>
                  <button
                    type="button"
                    onClick={handleQuickAddCustomer}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: 8,
                      background: '#2563eb',
                      color: '#ffffff',
                      border: 'none',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 5
                    }}
                  >
                    <CheckCircle style={{ width: 14, height: 14 }} />
                    <span>Save & Select Farmer</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingNewCustomer(false);
                      setQuickAddError('');
                    }}
                    style={{
                      padding: '8px 12px',
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
            </div>
          )}

          {/* Quick Add Machine Card when + Add New Machine is clicked */}
          {isAddingNewMachine && (
            <div style={{ 
              padding: 12, 
              borderRadius: 12, 
              background: '#f8fafc', 
              border: '1.5px dashed #3b82f6',
              boxShadow: '0 2px 8px rgba(37, 99, 235, 0.08)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1e40af', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Tractor style={{ width: 14, height: 14 }} />
                  <span>Quick Add Machinery (नई मशीन जोड़ें)</span>
                </span>
                <span style={{ fontSize: '0.68rem', color: '#64748b' }}>Instant addition to Fleet</span>
              </div>

              {machineError && (
                <div style={{ fontSize: '0.72rem', color: '#dc2626', marginBottom: 6, fontWeight: 600 }}>
                  {machineError}
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 8 }}>
                  <input
                    type="text"
                    placeholder="Machine / Model Name"
                    value={newMachineName}
                    onChange={(e) => setNewMachineName(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.8rem', outline: 'none', background: '#ffffff' }}
                    autoFocus
                  />
                  <input
                    type="text"
                    placeholder="Registration No"
                    value={newMachineRegNo}
                    onChange={(e) => setNewMachineRegNo(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.8rem', outline: 'none', background: '#ffffff', textTransform: 'uppercase' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <select
                    value={newMachineType}
                    onChange={(e) => setNewMachineType(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.8rem', background: '#ffffff', outline: 'none' }}
                  >
                    <option value="Tractor">Tractor</option>
                    <option value="JCB / Excavator">JCB / Excavator</option>
                    <option value="Harvester">Harvester</option>
                    <option value="Trolley">Trolley / Tipper</option>
                    <option value="Equipment">Other Equipment</option>
                  </select>

                  <input
                    type="number"
                    step="0.1"
                    placeholder="Initial Hour Meter"
                    value={newMachineMeter}
                    onChange={(e) => setNewMachineMeter(parseFloat(e.target.value) || 0)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.8rem', outline: 'none', background: '#ffffff' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: 8, marginTop: 2 }}>
                  <button
                    type="button"
                    onClick={handleQuickAddMachine}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: 8,
                      background: '#2563eb',
                      color: '#ffffff',
                      border: 'none',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 5
                    }}
                  >
                    <CheckCircle style={{ width: 14, height: 14 }} />
                    <span>Save & Select Machine</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingNewMachine(false);
                      setMachineError('');
                    }}
                    style={{
                      padding: '8px 12px',
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
            </div>
          )}

          {/* Implement, Billing Unit & Custom Rate */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: 10 }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>Implement *</label>
              <select
                value={implement}
                onChange={(e) => setImplement(e.target.value)}
                style={{ width: '100%', padding: '10px 10px', borderRadius: 10, background: '#ffffff', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.8rem', outline: 'none' }}
              >
                <option value="Rotavator (Shaktiman 7ft)">Rotavator (Shaktiman 7ft)</option>
                <option value="Super Seeder (Fieldking 8ft)">Super Seeder (Fieldking 8ft)</option>
                <option value="Laser Land Leveler">Laser Land Leveler</option>
                <option value="Cultivator 9-Tyne">Cultivator 9-Tyne</option>
                <option value="Backhoe Heavy Shovel">Backhoe Loader Shovel</option>
                <option value="Paddy Harvester Cutter">Paddy Harvester Cutter</option>
                <option value="Trolley (Double Axle)">Hydraulic Trolley</option>
                <option value="Custom Attachment">Custom Attachment</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>Billing Unit</label>
              <select
                value={billingType}
                onChange={(e) => handleBillingTypeChange(e.target.value)}
                style={{ width: '100%', padding: '10px 10px', borderRadius: 10, background: '#ffffff', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.8rem', outline: 'none' }}
              >
                <option value="Per Hour">Per Hour</option>
                <option value="Per Acre">Per Acre</option>
                <option value="Per Trip">Per Trip</option>
                <option value="Flat Rate">Flat Rate</option>
              </select>
            </div>

            {/* Self Rate Input with Default Settings Button */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', display: 'block' }}>
                  Rate (₹) *
                </label>
                <button
                  type="button"
                  onClick={() => setIsRateSettingsOpen(true)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#2563eb',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 3,
                    padding: 0
                  }}
                  title="Configure default rates"
                >
                  <Settings style={{ width: 11, height: 11 }} />
                  <span>Defaults</span>
                </button>
              </div>

              <input
                type="number"
                step="10"
                value={rate}
                onChange={(e) => setRate(parseFloat(e.target.value) || 0)}
                placeholder="Rate"
                style={{ width: '100%', padding: '10px 10px', borderRadius: 10, background: '#ffffff', border: '1.5px solid #2563eb', color: '#0f172a', fontFamily: 'var(--font-mono)', fontSize: '0.88rem', fontWeight: 700, outline: 'none' }}
                required
              />
            </div>
          </div>

          {/* Driver & Location Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', display: 'block' }}>
                  Assigned Driver
                </label>
                <button
                  type="button"
                  onClick={() => setIsAddingNewDriver(!isAddingNewDriver)}
                  style={{
                    background: isAddingNewDriver ? '#fee2e2' : '#eff6ff',
                    border: isAddingNewDriver ? '1px solid #fecaca' : '1px solid #bfdbfe',
                    color: isAddingNewDriver ? '#dc2626' : '#2563eb',
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
                  {isAddingNewDriver ? <X style={{ width: 11, height: 11 }} /> : <Plus style={{ width: 11, height: 11 }} />}
                  <span>{isAddingNewDriver ? 'Cancel' : '+ Add Driver'}</span>
                </button>
              </div>

              <select
                value={driverName}
                onChange={(e) => {
                  if (e.target.value === '__add_new_driver__') {
                    setIsAddingNewDriver(true);
                  } else {
                    setDriverName(e.target.value);
                  }
                }}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 10, background: '#ffffff', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.8rem', outline: 'none' }}
              >
                <option value="Self / Owner Operated">Self / Owner Operated</option>
                {drivers.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name} {d.phone ? `(${d.phone})` : ''}
                  </option>
                ))}
                <option value="__add_new_driver__" style={{ color: '#2563eb', fontWeight: 700 }}>
                  ➕ + Add New Driver...
                </option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>
                Field Location / Plot
              </label>
              <input
                type="text"
                placeholder="Field Location / Plot"
                value={fieldLocation}
                onChange={(e) => setFieldLocation(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 10, background: '#ffffff', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.82rem', outline: 'none' }}
              />
            </div>
          </div>

          {/* Quick Add Driver Card if open */}
          {isAddingNewDriver && (
            <div style={{
              padding: 12,
              borderRadius: 12,
              background: '#f8fafc',
              border: '1.5px dashed #3b82f6',
              boxShadow: '0 2px 8px rgba(37, 99, 235, 0.08)'
            }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1e40af', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                <UserCheck style={{ width: 14, height: 14 }} />
                <span>Quick Register Driver (नया ड्राइवर जोड़ें)</span>
              </div>

              {driverError && (
                <div style={{ fontSize: '0.72rem', color: '#dc2626', marginBottom: 6, fontWeight: 600 }}>
                  {driverError}
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
                <input
                  type="text"
                  placeholder="Driver Full Name"
                  value={newDriverName}
                  onChange={(e) => setNewDriverName(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.8rem', background: '#ffffff', outline: 'none' }}
                  autoFocus
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
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
                  Save & Select Driver
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingNewDriver(false)}
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

          {/* Meter Readings */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>Start Meter Reading</label>
              <input
                type="number"
                step="0.1"
                placeholder="0.0"
                value={startMeter}
                onChange={(e) => {
                  const sm = parseFloat(e.target.value) || 0;
                  setStartMeter(sm);
                  setEndMeter(parseFloat((sm + units).toFixed(1)));
                }}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 10, background: '#ffffff', border: '1px solid #cbd5e1', color: '#0f172a', fontFamily: 'var(--font-mono)', fontSize: '0.9rem', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>Stop Meter Reading</label>
              <input
                type="number"
                step="0.1"
                placeholder="0.0"
                value={endMeter}
                onChange={(e) => {
                  const em = parseFloat(e.target.value) || 0;
                  setEndMeter(em);
                  if (billingType === 'Per Hour' && em >= startMeter) {
                    setUnits(parseFloat((em - startMeter).toFixed(1)));
                  }
                }}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 10, background: '#ffffff', border: '1px solid #cbd5e1', color: '#0f172a', fontFamily: 'var(--font-mono)', fontSize: '0.9rem', outline: 'none' }}
              />
            </div>
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

      {/* Default Rates Settings Popup */}
      {isRateSettingsOpen && (
        <div 
          className="app-modal-overlay" 
          style={{ zIndex: 1100, background: 'rgba(0, 0, 0, 0.45)' }}
          onClick={() => setIsRateSettingsOpen(false)}
        >
          <div 
            className="app-modal-sheet"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 420, padding: 20 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Settings style={{ width: 18, height: 18 }} />
                </div>
                <div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>Standard Rate Settings</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Configure your standard billing rates (₹)</div>
                </div>
              </div>
              <button onClick={() => setIsRateSettingsOpen(false)} className="sheet-close-btn">
                <X style={{ width: 16, height: 16 }} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {Object.keys(tempDefaultRates).map((unitKey) => (
                <div key={unitKey} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '10px 14px', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>
                    {unitKey}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#2563eb' }}>₹</span>
                    <input
                      type="number"
                      step="50"
                      value={tempDefaultRates[unitKey] || ''}
                      onChange={(e) => setTempDefaultRates({
                        ...tempDefaultRates,
                        [unitKey]: parseFloat(e.target.value) || 0
                      })}
                      style={{
                        width: 90,
                        padding: '6px 8px',
                        borderRadius: 8,
                        border: '1.5px solid #cbd5e1',
                        fontSize: '0.88rem',
                        fontWeight: 700,
                        fontFamily: 'var(--font-mono)',
                        textAlign: 'right',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
              <button
                type="button"
                onClick={handleSaveDefaultRates}
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: 10,
                  background: '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6
                }}
              >
                <CheckCircle style={{ width: 16, height: 16 }} />
                <span>Save Standard Rates</span>
              </button>
              <button
                type="button"
                onClick={() => setIsRateSettingsOpen(false)}
                style={{
                  padding: '10px 14px',
                  borderRadius: 10,
                  background: '#f1f5f9',
                  color: '#475569',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
