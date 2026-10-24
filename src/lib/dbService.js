import { getSupabaseClient } from './supabaseClient';

export async function fetchSupabaseCustomers(fallbackData = []) {
  const client = getSupabaseClient();
  if (!client) return fallbackData;

  try {
    const { data, error } = await client
      .from('customers')
      .select('*')
      .order('name');

    if (error || !data || data.length === 0) {
      return fallbackData;
    }

    return data.map(item => ({
      id: item.id,
      name: item.name,
      village: item.village || '',
      phone: item.phone || '',
      trustScore: item.trust_score ?? 80,
      creditLimit: parseFloat(item.credit_limit || 50000),
      totalBilled: parseFloat(item.total_billed || 0),
      totalPaid: parseFloat(item.total_paid || 0),
      balance: parseFloat(item.balance || 0),
      mandiDay: item.mandi_day || 'Monday',
      barterPaid: item.barter_paid || 'None',
      lastJobDate: item.last_job_date || 'Oct 23, 2026',
    }));
  } catch (err) {
    console.warn('Supabase customers query fallback to local:', err);
    return fallbackData;
  }
}

export async function fetchSupabaseMachines(fallbackData = []) {
  const client = getSupabaseClient();
  if (!client) return fallbackData;

  try {
    const { data, error } = await client
      .from('machines')
      .select('*')
      .order('name');

    if (error || !data || data.length === 0) {
      return fallbackData;
    }

    return data.map(item => ({
      id: item.id,
      name: item.name,
      regNo: item.reg_no,
      hp: item.hp || '50 HP',
      assignedDriver: item.assigned_driver || 'Unassigned',
      currentMeter: parseFloat(item.current_meter || 0),
      fuelCapacity: parseFloat(item.fuel_capacity || 60),
      fuelLevel: parseFloat(item.fuel_level || 30),
      activeImplement: item.active_implement || 'None',
      status: item.status || 'Active',
      serviceHoursLeft: parseFloat(item.service_hours_left || 100),
      serviceInterval: parseFloat(item.service_interval || 250),
      dailyHours: parseFloat(item.daily_hours || 0),
      hourlyBurnRate: parseFloat(item.hourly_burn_rate || 4.5),
      expectedBurnRate: parseFloat(item.expected_burn_rate || 4.5),
      rcExpiry: item.rc_expiry || '2029-08-14',
      insuranceExpiry: item.insurance_expiry || '2026-11-18',
      pucExpiry: item.puc_expiry || '2027-02-10',
      fitnessExpiry: item.fitness_expiry || '2028-05-12',
    }));
  } catch (err) {
    console.warn('Supabase machines query fallback to local:', err);
    return fallbackData;
  }
}

export async function fetchSupabaseJobs(fallbackData = []) {
  const client = getSupabaseClient();
  if (!client) return fallbackData;

  try {
    const { data, error } = await client
      .from('field_jobs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return fallbackData;
    }

    return data.map(item => ({
      id: item.id,
      date: item.date,
      time: item.time,
      customer: item.customer_name,
      customerId: item.customer_id,
      machine: item.machine_name,
      machineId: item.machine_id,
      driver: item.driver_name,
      implement: item.implement,
      billingType: item.billing_type,
      rate: parseFloat(item.rate || 900),
      units: parseFloat(item.units || 1),
      totalAmount: parseFloat(item.total_amount || 0),
      startMeter: parseFloat(item.start_meter || 0),
      endMeter: parseFloat(item.end_meter || 0),
      fieldLocation: item.field_location,
      gpsVerified: item.gps_verified ?? true,
      gpsCoords: item.gps_coords || '22.7533° N, 78.3582° E',
      hasPhotoProof: item.has_photo_proof ?? true,
      isPaid: item.is_paid ?? false,
    }));
  } catch (err) {
    console.warn('Supabase field_jobs query fallback to local:', err);
    return fallbackData;
  }
}

export async function fetchSupabaseDieselLogs(fallbackData = []) {
  const client = getSupabaseClient();
  if (!client) return fallbackData;

  try {
    const { data, error } = await client
      .from('diesel_logs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return fallbackData;
    }

    return data.map(item => ({
      id: item.id,
      date: item.date,
      machine: item.machine_name,
      machineId: item.machine_id,
      liters: parseFloat(item.liters || 0),
      pricePerLiter: parseFloat(item.price_per_liter || 94.5),
      totalCost: parseFloat(item.total_cost || 0),
      pumpName: item.pump_name,
      meterReadingAtFill: parseFloat(item.meter_reading_at_fill || 0),
      receiptPhoto: item.receipt_photo ?? true,
      consumptionStatus: item.consumption_status,
      anomalyAlert: item.anomaly_alert ?? false,
    }));
  } catch (err) {
    console.warn('Supabase diesel_logs query fallback to local:', err);
    return fallbackData;
  }
}

export async function insertSupabaseJob(job) {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client.from('field_jobs').insert([{
      id: job.id,
      date: job.date,
      time: job.time,
      customer_name: job.customer,
      customer_id: job.customerId,
      machine_name: job.machine,
      machine_id: job.machineId,
      driver_name: job.driver,
      implement: job.implement,
      billing_type: job.billingType,
      rate: job.rate,
      units: job.units,
      total_amount: job.totalAmount,
      start_meter: job.startMeter,
      end_meter: job.endMeter,
      field_location: job.fieldLocation,
      gps_verified: job.gpsVerified,
      gps_coords: job.gpsCoords,
      has_photo_proof: job.hasPhotoProof,
      is_paid: job.isPaid,
    }]);

    if (error) console.warn('Supabase insert job error:', error);
    return !error;
  } catch (err) {
    console.warn('Supabase insertJob failed:', err);
    return false;
  }
}

export async function insertSupabaseDiesel(diesel) {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client.from('diesel_logs').insert([{
      id: diesel.id,
      date: diesel.date,
      machine_name: diesel.machine,
      machine_id: diesel.machineId,
      liters: diesel.liters,
      price_per_liter: diesel.pricePerLiter,
      total_cost: diesel.totalCost,
      pump_name: diesel.pumpName,
      meter_reading_at_fill: diesel.meterReadingAtFill,
      receipt_photo: diesel.receiptPhoto,
      consumption_status: diesel.consumptionStatus,
      anomaly_alert: diesel.anomalyAlert,
    }]);

    if (error) console.warn('Supabase insert diesel error:', error);
    return !error;
  } catch (err) {
    console.warn('Supabase insertDiesel failed:', err);
    return false;
  }
}

export async function insertSupabaseMachine(machine) {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client.from('machines').insert([{
      id: machine.id,
      name: machine.name,
      reg_no: machine.regNo,
      hp: machine.hp,
      assigned_driver: machine.assignedDriver,
      current_meter: machine.currentMeter,
      fuel_capacity: machine.fuelCapacity,
      fuel_level: machine.fuelLevel,
      active_implement: machine.activeImplement,
      status: machine.status || 'Active',
      service_hours_left: machine.serviceHoursLeft,
      service_interval: machine.serviceInterval || 250,
      daily_hours: machine.dailyHours || 0,
      hourly_burn_rate: machine.hourlyBurnRate || 4.5,
      expected_burn_rate: machine.expectedBurnRate || 4.5,
      rc_expiry: machine.rcExpiry,
      insurance_expiry: machine.insuranceExpiry,
      puc_expiry: machine.pucExpiry,
      fitness_expiry: machine.fitnessExpiry,
    }]);

    if (error) console.warn('Supabase insert machine error:', error);
    return !error;
  } catch (err) {
    console.warn('Supabase insertMachine failed:', err);
    return false;
  }
}
