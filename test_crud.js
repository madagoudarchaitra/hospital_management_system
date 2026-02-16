// CRUD Testing Script for Hospital Management System
// This script tests all CRUD operations on all modules

const BASE_URL = 'http://localhost:5000/api';
let TOKEN = '';

// Test credentials
const testUser = {
  email: 'test@hospital.com',
  password: 'test123'
};

// Test data for each module
const testData = {
  patient: {
    name: 'Test Patient',
    age: 35,
    gender: 'M'
  },
  doctor: {
    name: 'Dr. Test Smith',
    specialty: 'General Practice',
    qualifications: 'MD',
    experience: '10 years'
  },
  appointment: {
    doctorId: 1,
    patientId: 1,
    date: new Date(Date.now() + 86400000).toISOString(),
    status: 'scheduled'
  },
  billing: {
    patientId: 1,
    amount: 500.00,
    status: 'pending'
  },
  pharmacy: {
    name: 'Test Medicine',
    stock: 100,
    price: 25.50
  },
  labReport: {
    patientId: 1,
    reportType: 'Blood Test',
    result: 'Normal'
  },
  bed: {
    ward: 'A',
    number: '101',
    occupied: false
  },
  staff: {
    name: 'Test Staff',
    role: 'Nurse'
  }
};

async function request(method, endpoint, body = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': TOKEN ? `Bearer ${TOKEN}` : ''
    }
  };
  
  if (body) options.body = JSON.stringify(body);
  
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, options);
    const text = await res.text();
    const data = text ? JSON.parse(text) : {};
    return { status: res.status, data };
  } catch (err) {
    return { status: 0, error: err.message };
  }
}

async function test(name, fn) {
  try {
    await fn();
    console.log(`✅ ${name}`);
    return true;
  } catch (err) {
    console.log(`❌ ${name}: ${err.message}`);
    return false;
  }
}

async function runTests() {
  console.log('\n========== HOSPITAL MANAGEMENT SYSTEM - CRUD TEST SUITE ==========\n');
  
  // Try to login first
  console.log('--- Authenticating ---');
  let loginRes = await request('POST', '/auth/login', {
    email: 'admin@hospital.com',
    password: 'admin123'
  });
  
  if (loginRes.status === 200 && loginRes.data.token) {
    TOKEN = loginRes.data.token;
    console.log('✅ Authentication successful\n');
  } else {
    console.log('⚠️  Login failed, trying register...');
    const registerRes = await request('POST', '/auth/register', {
      name: 'Test User',
      email: 'testuser@hospital.com',
      password: 'test123',
      role: 'admin'
    });
    
    if (registerRes.status === 200 && registerRes.data.token) {
      TOKEN = registerRes.data.token;
      console.log('✅ Registration successful\n');
    } else {
      console.log('❌ Authentication failed\n');
      return;
    }
  }
  
  const modules = ['patients', 'doctors', 'appointments', 'billings', 'pharmacies', 'lab-reports', 'beds', 'staffs'];
  const results = {};
  
  // Test each module
  for (const module of modules) {
    console.log(`\n--- Testing ${module.toUpperCase()} Module ---`);
    results[module] = {};
    
    const testPayload = testData[module.replace(/s$/, '').replace('-report', 'Report')];
    let createdId = null;
    
    // CREATE
    await test(`CREATE ${module}`, async () => {
      const res = await request('POST', `/${module}`, testPayload);
      if (res.status !== 200 && res.status !== 201) throw new Error(`Status ${res.status}`);
      if (!res.data.id) throw new Error('No ID returned');
      createdId = res.data.id;
      results[module].create = 'PASS';
    });
    
    // READ LIST
    await test(`READ LIST ${module}`, async () => {
      const res = await request('GET', `/${module}`);
      if (res.status !== 200) throw new Error(`Status ${res.status}`);
      if (!Array.isArray(res.data)) throw new Error('Data is not an array');
      results[module].readList = 'PASS';
    });
    
    // READ DETAIL
    if (createdId) {
      await test(`READ DETAIL ${module}/:id`, async () => {
        const res = await request('GET', `/${module}/${createdId}`);
        if (res.status !== 200) throw new Error(`Status ${res.status}`);
        if (!res.data.id) throw new Error('No ID in response');
        results[module].readDetail = 'PASS';
      });
      
      // UPDATE
      await test(`UPDATE ${module}`, async () => {
        const updatePayload = { ...testPayload, name: testPayload.name ? testPayload.name + ' UPDATED' : undefined };
        const res = await request('PUT', `/${module}/${createdId}`, updatePayload);
        if (res.status !== 200) throw new Error(`Status ${res.status}`);
        results[module].update = 'PASS';
      });
      
      // DELETE
      await test(`DELETE ${module}`, async () => {
        const res = await request('DELETE', `/${module}/${createdId}`);
        if (res.status !== 200) throw new Error(`Status ${res.status}`);
        results[module].delete = 'PASS';
      });
    }
  }
  
  // Summary
  console.log('\n\n========== TEST SUMMARY ==========\n');
  let totalTests = 0, passedTests = 0;
  
  for (const module in results) {
    const ops = results[module];
    const passed = Object.values(ops).filter(v => v === 'PASS').length;
    const total = Object.values(ops).length;
    totalTests += total;
    passedTests += passed;
    console.log(`${module}: ${passed}/${total} operations passed`);
  }
  
  console.log(`\n📊 TOTAL: ${passedTests}/${totalTests} tests passed`);
  console.log(`✅ SUCCESS RATE: ${((passedTests/totalTests)*100).toFixed(2)}%\n`);
}

runTests();
