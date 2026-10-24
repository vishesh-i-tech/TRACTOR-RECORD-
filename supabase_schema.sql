-- ========================================================
-- 🚜 Tractor Record: Supabase Database Schema & Setup
-- Copy and run this script in your Supabase SQL Editor.
-- ========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  role TEXT DEFAULT 'owner' CHECK (role IN ('owner', 'munshi', 'driver')),
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. CUSTOMERS (KHATA) TABLE
CREATE TABLE IF NOT EXISTS public.customers (
  id TEXT PRIMARY KEY DEFAULT ('c-' || substr(md5(random()::text), 1, 8)),
  name TEXT NOT NULL,
  village TEXT,
  phone TEXT,
  trust_score INTEGER DEFAULT 80,
  credit_limit NUMERIC DEFAULT 50000,
  total_billed NUMERIC DEFAULT 0,
  total_paid NUMERIC DEFAULT 0,
  balance NUMERIC DEFAULT 0,
  mandi_day TEXT DEFAULT 'Monday',
  barter_paid TEXT DEFAULT 'None',
  last_job_date TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. MACHINES (FLEET) TABLE
CREATE TABLE IF NOT EXISTS public.machines (
  id TEXT PRIMARY KEY DEFAULT ('m-' || substr(md5(random()::text), 1, 8)),
  name TEXT NOT NULL,
  reg_no TEXT NOT NULL,
  hp TEXT,
  assigned_driver TEXT,
  current_meter NUMERIC DEFAULT 0,
  fuel_capacity NUMERIC DEFAULT 60,
  fuel_level NUMERIC DEFAULT 40,
  active_implement TEXT,
  status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Idle', 'Maintenance')),
  service_hours_left NUMERIC DEFAULT 100,
  service_interval NUMERIC DEFAULT 250,
  daily_hours NUMERIC DEFAULT 0,
  hourly_burn_rate NUMERIC DEFAULT 4.5,
  expected_burn_rate NUMERIC DEFAULT 4.5,
  rc_expiry TEXT,
  insurance_expiry TEXT,
  puc_expiry TEXT,
  fitness_expiry TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. FIELD JOBS TABLE
CREATE TABLE IF NOT EXISTS public.field_jobs (
  id TEXT PRIMARY KEY DEFAULT ('job-' || substr(md5(random()::text), 1, 8)),
  date TEXT NOT NULL,
  time TEXT,
  customer_name TEXT NOT NULL,
  customer_id TEXT,
  machine_name TEXT NOT NULL,
  machine_id TEXT,
  driver_name TEXT,
  implement TEXT NOT NULL,
  billing_type TEXT DEFAULT 'Per Hour',
  rate NUMERIC DEFAULT 900,
  units NUMERIC DEFAULT 1,
  total_amount NUMERIC NOT NULL,
  start_meter NUMERIC,
  end_meter NUMERIC,
  field_location TEXT,
  gps_verified BOOLEAN DEFAULT true,
  gps_coords TEXT,
  has_photo_proof BOOLEAN DEFAULT true,
  is_paid BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. DIESEL LOGS TABLE
CREATE TABLE IF NOT EXISTS public.diesel_logs (
  id TEXT PRIMARY KEY DEFAULT ('dsl-' || substr(md5(random()::text), 1, 8)),
  date TEXT NOT NULL,
  machine_name TEXT NOT NULL,
  machine_id TEXT,
  liters NUMERIC NOT NULL,
  price_per_liter NUMERIC DEFAULT 94.5,
  total_cost NUMERIC NOT NULL,
  pump_name TEXT,
  meter_reading_at_fill NUMERIC,
  receipt_photo BOOLEAN DEFAULT true,
  consumption_status TEXT,
  anomaly_alert BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. DRIVERS TABLE
CREATE TABLE IF NOT EXISTS public.drivers (
  id TEXT PRIMARY KEY DEFAULT ('d-' || substr(md5(random()::text), 1, 8)),
  name TEXT NOT NULL,
  phone TEXT,
  assigned_machine TEXT,
  daily_bhatta NUMERIC DEFAULT 300,
  overtime_rate NUMERIC DEFAULT 60,
  hours_today NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'Present',
  monthly_earnings NUMERIC DEFAULT 0,
  advance_taken NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Row Level Security (RLS) configuration
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.machines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.field_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diesel_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to select/insert/update data
CREATE POLICY "Public read access for authenticated or demo" ON public.customers FOR ALL USING (true);
CREATE POLICY "Public read access for machines" ON public.machines FOR ALL USING (true);
CREATE POLICY "Public read access for field_jobs" ON public.field_jobs FOR ALL USING (true);
CREATE POLICY "Public read access for diesel_logs" ON public.diesel_logs FOR ALL USING (true);
CREATE POLICY "Public read access for drivers" ON public.drivers FOR ALL USING (true);
CREATE POLICY "Profiles access" ON public.profiles FOR ALL USING (true);

-- Insert initial seed data
INSERT INTO public.customers (id, name, village, phone, trust_score, credit_limit, total_billed, total_paid, balance, mandi_day, barter_paid, last_job_date)
VALUES 
  ('c1', 'Ramesh Patel', 'Pipariya Kalan', '98261 44102', 94, 60000, 86500, 64000, 22500, 'Monday', '5 Quintals Wheat (Credited @ ₹11,375)', 'Oct 22, 2026'),
  ('c2', 'Harpreet Singh Dhillon', 'Rampur Farm', '98930 11984', 90, 100000, 124000, 94000, 30000, 'Thursday', 'None', 'Oct 23, 2026'),
  ('c3', 'Vikram Meena', 'Kheri Silwani', '94250 88291', 58, 45000, 59000, 16000, 43000, 'Saturday', 'None', 'Oct 20, 2026'),
  ('c4', 'Chhote Lal Verma', 'Bankhedi', '91312 77410', 98, 50000, 38000, 38000, 0, 'Wednesday', '2 Trolleys Fodder (Credited @ ₹6,000)', 'Oct 21, 2026'),
  ('c5', 'Balwant Patel (Patwari)', 'Sobhapur', '98269 33201', 85, 75000, 72000, 53000, 19000, 'Friday', 'None', 'Oct 23, 2026')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.machines (id, name, reg_no, hp, assigned_driver, current_meter, fuel_capacity, fuel_level, active_implement, status, service_hours_left, service_interval, daily_hours, hourly_burn_rate, expected_burn_rate, rc_expiry, insurance_expiry, puc_expiry, fitness_expiry)
VALUES
  ('m1', 'Mahindra 575 DI (Sarpanch)', 'MP-04-AB-4892', '50 HP', 'Sukhwinder Singh', 1842.5, 65, 46, 'Rotavator (Shaktiman 7ft)', 'Active', 32, 250, 6.5, 4.6, 4.4, '2029-08-14', '2026-11-18', '2027-02-10', '2028-05-12'),
  ('m2', 'John Deere 5050D GearPro', 'MP-04-CD-7721', '50 HP', 'Mukesh Gurjar', 945.0, 60, 38, 'Super Seeder (Fieldking 8ft)', 'Idle', 74, 300, 0, 4.8, 4.7, '2031-03-20', '2027-04-15', '2026-12-05', '2030-01-18'),
  ('m3', 'JCB 3DX Super EcoXcellence', 'MP-04-JK-9912', '76 HP Heavy', 'Ramvilas Yadav', 4128.4, 120, 78, 'Backhoe Heavy Shovel', 'Active', 14, 250, 8.2, 7.2, 6.8, '2028-06-11', '2026-12-30', '2026-11-04', '2027-09-22'),
  ('m4', 'Sonalika DI 745 III Sikander', 'MP-04-EF-3310', '45 HP', 'Unassigned', 2344.0, 55, 18, 'Laser Land Leveler', 'Maintenance', -4, 250, 0, 5.9, 4.2, '2027-10-15', '2026-11-02', '2026-11-28', '2027-04-05')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.field_jobs (id, date, time, customer_name, machine_name, driver_name, implement, billing_type, rate, units, total_amount, start_meter, end_meter, field_location, gps_verified, gps_coords, has_photo_proof, is_paid)
VALUES
  ('job-101', 'Oct 23, 2026', '02:30 PM', 'Harpreet Singh Dhillon', 'Mahindra 575 DI', 'Sukhwinder Singh', 'Laser Land Leveler', 'Per Hour', 1100, 3.5, 3850, 1839.0, 1842.5, 'Rampur North Field (Khasra #142/2)', true, '22.7533° N, 78.3582° E', true, false),
  ('job-102', 'Oct 23, 2026', '11:15 AM', 'Balwant Patel (Patwari)', 'JCB 3DX Super', 'Ramvilas Yadav', 'Backhoe Shovel (Trenching)', 'Per Hour', 1100, 4.5, 4950, 4123.9, 4128.4, 'Sobhapur Canal Side', true, '22.7118° N, 78.3991° E', true, false),
  ('job-103', 'Oct 22, 2026', '05:45 PM', 'Ramesh Patel', 'Mahindra 575 DI', 'Sukhwinder Singh', 'Rotavator (Shaktiman 7ft)', 'Per Acre', 1400, 4.5, 6300, 1834.0, 1839.0, 'Pipariya Kalan West', true, '22.7601° N, 78.3412° E', true, false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.diesel_logs (id, date, machine_name, liters, price_per_liter, total_cost, pump_name, meter_reading_at_fill, receipt_photo, consumption_status, anomaly_alert)
VALUES
  ('dsl-201', 'Oct 23, 2026', 'Mahindra 575 DI', 40, 94.5, 3780, 'HPCL Kisan Seva Kendra, Pipariya', 1838.0, true, 'Normal (4.5 L/hr)', false),
  ('dsl-202', 'Oct 22, 2026', 'JCB 3DX Super', 65, 94.5, 6142.5, 'Bharat Petroleum Highway, Hoshangabad', 4120.0, true, 'Normal (6.8 L/hr)', false),
  ('dsl-203', 'Oct 21, 2026', 'Sonalika DI 745 III', 50, 94.5, 4725, 'Indian Oil Rural Outlet, Silwani', 2335.5, true, '⚠️ Anomaly (6.4 L/hr vs 4.2 L/hr benchmark) - Leak/Theft Alert', true)
ON CONFLICT (id) DO NOTHING;
