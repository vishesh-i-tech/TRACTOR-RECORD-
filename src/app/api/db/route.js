import { NextResponse } from 'next/server';
import { 
  getAllCustomers, 
  getAllMachines, 
  getAllJobs, 
  getAllDieselLogs, 
  getAllDrivers, 
  insertCustomer, 
  insertMachine, 
  insertJob, 
  insertDieselLog, 
  insertDriver,
  addPayment,
  getDbStats,
  registerUser,
  authenticateUser,
  findUserByEmail,
  getAppSetting,
  setAppSetting
} from '../../../lib/sqliteDb';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all';

    if (type === 'rates') {
      return NextResponse.json({ success: true, rates: getAppSetting('default_rates', null) });
    }

    if (type === 'stats') {
      return NextResponse.json({ success: true, stats: getDbStats() });
    }

    if (type === 'customers') {
      return NextResponse.json({ success: true, customers: getAllCustomers() });
    }

    if (type === 'machines') {
      return NextResponse.json({ success: true, machines: getAllMachines() });
    }

    if (type === 'jobs') {
      return NextResponse.json({ success: true, jobs: getAllJobs() });
    }

    if (type === 'diesel') {
      return NextResponse.json({ success: true, dieselLogs: getAllDieselLogs() });
    }

    // Return complete snapshot
    const [customers, machines, jobs, dieselLogs, drivers, stats] = [
      getAllCustomers(),
      getAllMachines(),
      getAllJobs(),
      getAllDieselLogs(),
      getAllDrivers(),
      getDbStats()
    ];

    return NextResponse.json({
      success: true,
      database: 'SQLite',
      stats,
      customers,
      machines,
      jobs,
      dieselLogs,
      drivers
    });
  } catch (err) {
    console.error('SQLite GET Error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'SQLite query failed' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, data } = body;

    if (action === 'auth_signup') {
      const res = registerUser(data);
      if (res.error) {
        return NextResponse.json({ 
          success: false, 
          error: res.message, 
          code: res.error,
          alreadyExists: res.error === 'already_exists'
        }, { status: 400 });
      }
      return NextResponse.json({ success: true, user: res.user });
    }

    if (action === 'auth_signin') {
      const { email, password } = data;
      const res = authenticateUser(email, password);
      if (res.error) {
        return NextResponse.json({ 
          success: false, 
          error: res.message, 
          code: res.error,
          notFound: res.error === 'user_not_found',
          invalidCredentials: res.error === 'invalid_credentials'
        }, { status: 400 });
      }
      return NextResponse.json({ success: true, user: res.user });
    }

    if (action === 'insert_customer') {
      const saved = insertCustomer(data);
      return NextResponse.json({ success: true, data: saved });
    }

    if (action === 'insert_machine') {
      const saved = insertMachine(data);
      return NextResponse.json({ success: true, data: saved });
    }

    if (action === 'insert_job') {
      const saved = insertJob(data);
      return NextResponse.json({ success: true, data: saved });
    }

    if (action === 'insert_diesel') {
      const saved = insertDieselLog(data);
      return NextResponse.json({ success: true, data: saved });
    }

    if (action === 'insert_driver') {
      const saved = insertDriver(data);
      return NextResponse.json({ success: true, data: saved });
    }

    if (action === 'save_rates') {
      const saved = setAppSetting('default_rates', data);
      return NextResponse.json({ success: true, data: saved });
    }

    if (action === 'get_rates') {
      const rates = getAppSetting('default_rates', null);
      return NextResponse.json({ success: true, rates });
    }

    if (action === 'add_payment') {
      const { customerId, amount, mode, barterDetail } = data;
      const ok = addPayment(customerId, amount, mode, barterDetail);
      return NextResponse.json({ success: ok });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  } catch (err) {
    console.error('SQLite POST Error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'SQLite mutation failed' },
      { status: 500 }
    );
  }
}
