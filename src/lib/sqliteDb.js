import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { 
  INITIAL_CUSTOMERS, 
  INITIAL_MACHINES, 
  INITIAL_DRIVERS, 
  INITIAL_JOBS, 
  INITIAL_DIESEL_LOGS 
} from '../data/mockData.js';

let dbInstance = null;

export function getDb() {
  if (dbInstance) return dbInstance;

  const dbDir = process.cwd();
  const dbPath = path.join(dbDir, 'tractor_record.db');

  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');

  // Initialize Tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS customers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      village TEXT,
      phone TEXT,
      trust_score INTEGER DEFAULT 80,
      credit_limit REAL DEFAULT 50000,
      total_billed REAL DEFAULT 0,
      total_paid REAL DEFAULT 0,
      balance REAL DEFAULT 0,
      mandi_day TEXT DEFAULT 'Monday',
      barter_paid TEXT DEFAULT 'None',
      last_job_date TEXT,
      history_json TEXT DEFAULT '[]',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS machines (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      reg_no TEXT NOT NULL,
      hp TEXT,
      assigned_driver TEXT,
      current_meter REAL DEFAULT 0,
      fuel_capacity REAL DEFAULT 60,
      fuel_level REAL DEFAULT 40,
      active_implement TEXT,
      status TEXT DEFAULT 'Active',
      service_hours_left REAL DEFAULT 100,
      service_interval REAL DEFAULT 250,
      daily_hours REAL DEFAULT 0,
      hourly_burn_rate REAL DEFAULT 4.5,
      expected_burn_rate REAL DEFAULT 4.5,
      rc_expiry TEXT,
      insurance_expiry TEXT,
      puc_expiry TEXT,
      fitness_expiry TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS field_jobs (
      id TEXT PRIMARY KEY,
      date TEXT,
      time TEXT,
      customer TEXT,
      customer_id TEXT,
      machine TEXT,
      machine_id TEXT,
      driver TEXT,
      implement TEXT,
      billing_type TEXT,
      rate REAL,
      units REAL,
      total_amount REAL,
      start_meter REAL,
      end_meter REAL,
      field_location TEXT,
      gps_verified INTEGER DEFAULT 1,
      gps_coords TEXT,
      has_photo_proof INTEGER DEFAULT 1,
      is_paid INTEGER DEFAULT 0,
      signature_verified INTEGER DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS diesel_logs (
      id TEXT PRIMARY KEY,
      date TEXT,
      machine TEXT,
      machine_id TEXT,
      liters REAL,
      price_per_liter REAL,
      total_cost REAL,
      pump_name TEXT,
      meter_reading_at_fill REAL,
      receipt_photo TEXT,
      consumption_status TEXT,
      anomaly_alert INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS drivers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      phone TEXT,
      assigned_machine TEXT,
      shift_status TEXT,
      bhatta_balance REAL DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT DEFAULT 'owner',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS app_settings (
      key TEXT PRIMARY KEY,
      value_json TEXT,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Auto-seed initial data if tables are empty
  seedDatabaseIfEmpty(db);

  dbInstance = db;
  return dbInstance;
}

function seedDatabaseIfEmpty(db) {
  // Production Ready: Clean database with zero sample records
}


// -------------------------------------------------------------
// Database Query & Mutation Methods
// -------------------------------------------------------------

export function getAllCustomers() {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM customers ORDER BY created_at DESC').all();
  return rows.map(r => ({
    id: r.id,
    name: r.name,
    village: r.village,
    phone: r.phone,
    trustScore: r.trust_score,
    creditLimit: r.credit_limit,
    totalBilled: r.total_billed,
    totalPaid: r.total_paid,
    balance: r.balance,
    mandiDay: r.mandi_day,
    barterPaid: r.barter_paid,
    lastJobDate: r.last_job_date,
    history: r.history_json ? JSON.parse(r.history_json) : []
  }));
}

export function insertCustomer(c) {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO customers (
      id, name, village, phone, trust_score, credit_limit, 
      total_billed, total_paid, balance, mandi_day, barter_paid, 
      last_job_date, history_json
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    String(c.id),
    String(c.name),
    String(c.village || ''),
    String(c.phone || ''),
    Number(c.trustScore ?? 85),
    Number(c.creditLimit || 50000),
    Number(c.totalBilled || 0),
    Number(c.totalPaid || 0),
    Number(c.balance || 0),
    String(c.mandiDay || 'Monday'),
    String(c.barterPaid || 'None'),
    String(c.lastJobDate || 'New Account'),
    JSON.stringify(c.history || [])
  );

  return c;
}

export function getAllMachines() {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM machines ORDER BY created_at DESC').all();
  return rows.map(m => ({
    id: m.id,
    name: m.name,
    regNo: m.reg_no,
    hp: m.hp,
    assignedDriver: m.assigned_driver,
    currentMeter: m.current_meter,
    fuelCapacity: m.fuel_capacity,
    fuelLevel: m.fuel_level,
    activeImplement: m.active_implement,
    status: m.status,
    serviceHoursLeft: m.service_hours_left,
    serviceInterval: m.service_interval,
    dailyHours: m.daily_hours,
    hourlyBurnRate: m.hourly_burn_rate,
    expectedBurnRate: m.expected_burn_rate,
    rcExpiry: m.rc_expiry,
    insuranceExpiry: m.insurance_expiry,
    pucExpiry: m.puc_expiry,
    fitnessExpiry: m.fitness_expiry
  }));
}

export function insertMachine(m) {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO machines (
      id, name, reg_no, hp, assigned_driver, current_meter, 
      fuel_capacity, fuel_level, active_implement, status, 
      service_hours_left, service_interval, daily_hours, 
      hourly_burn_rate, expected_burn_rate, rc_expiry, 
      insurance_expiry, puc_expiry, fitness_expiry
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    String(m.id),
    String(m.name),
    String(m.regNo),
    String(m.hp || '50 HP'),
    String(m.assignedDriver || 'Unassigned'),
    Number(m.currentMeter || 0),
    Number(m.fuelCapacity || 60),
    Number(m.fuelLevel || 30),
    String(m.activeImplement || 'None'),
    String(m.status || 'Active'),
    Number(m.serviceHoursLeft ?? 250),
    Number(m.serviceInterval || 250),
    Number(m.dailyHours || 0),
    Number(m.hourlyBurnRate || 4.5),
    Number(m.expectedBurnRate || 4.5),
    String(m.rcExpiry || '2030-01-01'),
    String(m.insuranceExpiry || '2027-01-01'),
    String(m.pucExpiry || '2027-01-01'),
    String(m.fitnessExpiry || '2028-01-01')
  );

  return m;
}

export function getAllJobs() {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM field_jobs ORDER BY created_at DESC').all();
  return rows.map(j => ({
    id: j.id,
    date: j.date,
    time: j.time,
    customer: j.customer,
    customerId: j.customer_id,
    machine: j.machine,
    machineId: j.machine_id,
    driver: j.driver,
    implement: j.implement,
    billingType: j.billing_type,
    rate: j.rate,
    units: j.units,
    totalAmount: j.total_amount,
    startMeter: j.start_meter,
    endMeter: j.end_meter,
    fieldLocation: j.field_location,
    gpsVerified: Boolean(j.gps_verified),
    gpsCoords: j.gps_coords,
    hasPhotoProof: Boolean(j.has_photo_proof),
    isPaid: Boolean(j.is_paid),
    signatureVerified: Boolean(j.signature_verified)
  }));
}

export function insertJob(job) {
  const db = getDb();

  const insertJobTx = db.transaction(() => {
    // 1. Insert field job
    const stmt = db.prepare(`
      INSERT INTO field_jobs (
        id, date, time, customer, customer_id, machine, machine_id, 
        driver, implement, billing_type, rate, units, total_amount, 
        start_meter, end_meter, field_location, gps_verified, gps_coords, 
        has_photo_proof, is_paid, signature_verified
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      String(job.id),
      String(job.date),
      String(job.time || ''),
      String(job.customer),
      String(job.customerId || ''),
      String(job.machine),
      String(job.machineId || ''),
      String(job.driver || ''),
      String(job.implement || ''),
      String(job.billingType || 'Per Hour'),
      Number(job.rate || 0),
      Number(job.units || 0),
      Number(job.totalAmount || 0),
      Number(job.startMeter || 0),
      Number(job.endMeter || 0),
      String(job.fieldLocation || ''),
      job.gpsVerified ? 1 : 0,
      String(job.gpsCoords || ''),
      job.hasPhotoProof ? 1 : 0,
      job.isPaid ? 1 : 0,
      job.signatureVerified ? 1 : 0
    );

    // 2. Update Machine meter & hours
    if (job.machineId) {
      const addedHours = job.billingType === 'Per Hour' 
        ? Number(job.units || 0) 
        : Math.max(0, Number(job.endMeter || 0) - Number(job.startMeter || 0));

      db.prepare(`
        UPDATE machines 
        SET current_meter = current_meter + ?, 
            daily_hours = daily_hours + ?, 
            service_hours_left = service_hours_left - ? 
        WHERE id = ?
      `).run(addedHours, addedHours, addedHours, String(job.machineId));
    }

    // 3. Update Customer Khata balance & history
    const customer = db.prepare('SELECT * FROM customers WHERE id = ? OR name = ?').get(job.customerId, job.customer);
    if (customer) {
      let history = [];
      try {
        history = JSON.parse(customer.history_json || '[]');
      } catch (e) {
        history = [];
      }

      history.unshift({
        date: job.date,
        implement: job.implement,
        units: `${job.units} ${job.billingType === 'Per Hour' ? 'hrs' : 'acres'}`,
        amount: job.totalAmount,
        status: 'Credit'
      });

      db.prepare(`
        UPDATE customers 
        SET total_billed = total_billed + ?, 
            balance = balance + ?, 
            last_job_date = ?, 
            history_json = ? 
        WHERE id = ?
      `).run(Number(job.totalAmount), Number(job.totalAmount), String(job.date), JSON.stringify(history), customer.id);
    }
  });

  insertJobTx();
  return job;
}

export function getAllDieselLogs() {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM diesel_logs ORDER BY created_at DESC').all();
  return rows.map(d => ({
    id: d.id,
    date: d.date,
    machine: d.machine,
    machineId: d.machine_id,
    liters: d.liters,
    pricePerLiter: d.price_per_liter,
    totalCost: d.total_cost,
    pumpName: d.pump_name,
    meterReadingAtFill: d.meter_reading_at_fill,
    receiptPhoto: d.receipt_photo,
    consumptionStatus: d.consumption_status,
    anomalyAlert: Boolean(d.anomaly_alert)
  }));
}

export function insertDieselLog(diesel) {
  const db = getDb();

  const insertDieselTx = db.transaction(() => {
    const stmt = db.prepare(`
      INSERT INTO diesel_logs (
        id, date, machine, machine_id, liters, price_per_liter, 
        total_cost, pump_name, meter_reading_at_fill, receipt_photo, 
        consumption_status, anomaly_alert
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      String(diesel.id),
      String(diesel.date),
      String(diesel.machine),
      String(diesel.machineId || ''),
      Number(diesel.liters || 0),
      Number(diesel.pricePerLiter || 95),
      Number(diesel.totalCost || 0),
      String(diesel.pumpName || ''),
      Number(diesel.meterReadingAtFill || 0),
      String(diesel.receiptPhoto || ''),
      String(diesel.consumptionStatus || 'Normal'),
      diesel.anomalyAlert ? 1 : 0
    );

    // Update fuel level of the machine
    if (diesel.machineId) {
      db.prepare(`
        UPDATE machines 
        SET fuel_level = MIN(fuel_capacity, fuel_level + ?) 
        WHERE id = ?
      `).run(Number(diesel.liters), String(diesel.machineId));
    }
  });

  insertDieselTx();
  return diesel;
}

export function addPayment(customerId, amount, mode, barterDetail) {
  const db = getDb();
  const customer = db.prepare('SELECT * FROM customers WHERE id = ?').get(customerId);
  if (!customer) return false;

  let history = [];
  try {
    history = JSON.parse(customer.history_json || '[]');
  } catch (e) {
    history = [];
  }

  history.unshift({
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    implement: `Payment (${mode}) ${barterDetail ? `[${barterDetail}]` : ''}`,
    units: '-',
    amount: -Number(amount),
    status: 'Paid'
  });

  db.prepare(`
    UPDATE customers 
    SET total_paid = total_paid + ?, 
        balance = MAX(0, balance - ?), 
        barter_paid = COALESCE(?, barter_paid), 
        history_json = ? 
    WHERE id = ?
  `).run(
    Number(amount), 
    Number(amount), 
    barterDetail ? String(barterDetail) : null, 
    JSON.stringify(history), 
    String(customerId)
  );

  return true;
}

export function getAllDrivers() {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM drivers ORDER BY created_at DESC').all();
  return rows.map(d => ({
    id: d.id,
    name: d.name,
    phone: d.phone,
    assignedMachine: d.assigned_machine,
    shiftStatus: d.shift_status,
    bhattaBalance: d.bhatta_balance
  }));
}

export function insertDriver(d) {
  const db = getDb();
  const id = d.id || `drv-${Date.now()}`;
  const stmt = db.prepare(`
    INSERT INTO drivers (id, name, phone, assigned_machine, shift_status, bhatta_balance)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  stmt.run(
    String(id),
    String(d.name || 'Driver'),
    String(d.phone || ''),
    String(d.assignedMachine || 'Unassigned'),
    String(d.shiftStatus || 'Active'),
    Number(d.bhattaBalance || 0)
  );
  return {
    id,
    name: d.name,
    phone: d.phone || '',
    assignedMachine: d.assignedMachine || 'Unassigned',
    shiftStatus: d.shiftStatus || 'Active',
    bhattaBalance: d.bhattaBalance || 0
  };
}

export function getAppSetting(key, defaultValue = null) {
  const db = getDb();
  const row = db.prepare('SELECT value_json FROM app_settings WHERE key = ?').get(key);
  if (!row) return defaultValue;
  try {
    return JSON.parse(row.value_json);
  } catch (e) {
    return defaultValue;
  }
}

export function setAppSetting(key, value) {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO app_settings (key, value_json, updated_at)
    VALUES (?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(key) DO UPDATE SET value_json = excluded.value_json, updated_at = CURRENT_TIMESTAMP
  `);
  stmt.run(key, JSON.stringify(value));
  return value;
}

export function getDbStats() {
  const db = getDb();
  const dbPath = path.join(process.cwd(), 'tractor_record.db');
  let fileSizeKb = 0;
  try {
    const stats = fs.statSync(dbPath);
    fileSizeKb = Math.round(stats.size / 1024);
  } catch (e) {
    fileSizeKb = 0;
  }

  return {
    engine: 'SQLite (better-sqlite3)',
    filename: 'tractor_record.db',
    path: dbPath,
    fileSizeKb,
    customersCount: db.prepare('SELECT COUNT(*) as count FROM customers').get().count,
    machinesCount: db.prepare('SELECT COUNT(*) as count FROM machines').get().count,
    jobsCount: db.prepare('SELECT COUNT(*) as count FROM field_jobs').get().count,
    dieselCount: db.prepare('SELECT COUNT(*) as count FROM diesel_logs').get().count,
    driversCount: db.prepare('SELECT COUNT(*) as count FROM drivers').get().count,
    usersCount: db.prepare('SELECT COUNT(*) as count FROM users').get().count,
    status: 'Active (WAL Mode)'
  };
}

export function findUserByEmail(email) {
  const db = getDb();
  if (!email) return null;
  const row = db.prepare('SELECT * FROM users WHERE LOWER(TRIM(email)) = LOWER(TRIM(?))').get(email);
  return row || null;
}

export function registerUser({ email, password, name, role = 'owner' }) {
  const db = getDb();
  const cleanEmail = String(email || '').trim().toLowerCase();
  const existing = findUserByEmail(cleanEmail);
  if (existing) {
    return { 
      error: 'already_exists', 
      message: 'An account with this email/mobile already exists. Please Sign In.' 
    };
  }

  const id = `usr-${Date.now()}`;
  const userName = String(name || cleanEmail.split('@')[0] || 'User').trim();
  const stmt = db.prepare(`
    INSERT INTO users (id, email, password, name, role)
    VALUES (?, ?, ?, ?, ?)
  `);

  stmt.run(id, cleanEmail, String(password || ''), userName, String(role));

  return {
    success: true,
    user: {
      id,
      email: cleanEmail,
      name: userName,
      role: String(role),
      avatar: userName.substring(0, 2).toUpperCase()
    }
  };
}

export function authenticateUser(email, password) {
  const cleanEmail = String(email || '').trim().toLowerCase();
  const user = findUserByEmail(cleanEmail);
  if (!user) {
    return { 
      error: 'user_not_found', 
      message: 'No account found with this email or mobile. Please Sign Up.' 
    };
  }

  if (user.password !== String(password || '')) {
    return { 
      error: 'invalid_credentials', 
      message: 'Incorrect password or PIN. Please try again.' 
    };
  }

  return {
    success: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: (user.name || 'U').substring(0, 2).toUpperCase()
    }
  };
}

export function getAllUsers() {
  const db = getDb();
  const rows = db.prepare('SELECT id, email, name, role, created_at FROM users ORDER BY created_at DESC').all();
  return rows.map(u => ({
    id: u.id,
    email: u.email,
    name: u.name,
    role: u.role,
    avatar: (u.name || 'U').substring(0, 2).toUpperCase(),
    createdAt: u.created_at
  }));
}

