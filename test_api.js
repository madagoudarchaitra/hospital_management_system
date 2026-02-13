const API = 'http://localhost:5000/api';
const fetch = global.fetch || require('node-fetch');

async function req(path, method='GET', body=null, token=null){
  const headers = {};
  if(body) headers['Content-Type']='application/json';
  if(token) headers['Authorization']=`Bearer ${token}`;
  const res = await fetch(API+path, { method, headers, body: body?JSON.stringify(body):undefined });
  const text = await res.text();
  let data;
  try{ data = JSON.parse(text); }catch(e){ data = text; }
  return { status: res.status, data };
}

async function run(){
  console.log('1) Login seeded admin');
  let r = await req('/auth/login','POST',{ email: 'admin@example.com', password: 'admin123' });
  console.log(r.status, r.data);
  const adminToken = r.data.token;

  console.log('\n2) Register doctor');
  r = await req('/auth/register','POST',{ name: 'Dr Strange', email: 'doc@example.com', password: 'docpass', role: 'doctor' });
  console.log(r.status, r.data);

  console.log('\n3) Login doctor');
  r = await req('/auth/login','POST',{ email: 'doc@example.com', password: 'docpass' });
  const doctorToken = r.data.token; console.log(r.status, r.data);

  console.log('\n4) Register patient');
  r = await req('/auth/register','POST',{ name: 'Patient One', email: 'pat1@example.com', password: 'patpass', role: 'patient' });
  console.log(r.status, r.data);

  console.log('\n5) Login patient');
  r = await req('/auth/login','POST',{ email: 'pat1@example.com', password: 'patpass' });
  const patientToken = r.data.token; console.log(r.status, r.data);

  console.log('\n6) Register staff');
  r = await req('/auth/register','POST',{ name: 'Staff One', email: 'staff1@example.com', password: 'staffpass', role: 'staff' });
  console.log(r.status, r.data);

  console.log('\n7) Login staff');
  r = await req('/auth/login','POST',{ email: 'staff1@example.com', password: 'staffpass' });
  const staffToken = r.data.token; console.log(r.status, r.data);

  console.log('\n8) Get doctors list (doctor token)');
  r = await req('/doctors','GET',null,doctorToken); console.log(r.status, r.data.length? 'ok': r.data);
  const doctors = r.data;
  const docId = doctors && doctors.length? doctors[0].id : null;

  console.log('\n9) Get patients list (admin token)');
  r = await req('/patients','GET',null,adminToken); console.log(r.status, Array.isArray(r.data)? r.data.length+' patients': r.data);
  const patients = r.data;
  const patId = patients && patients.length? patients[0].id : null;

  console.log('\n10) Create appointment (doctor token)');
  r = await req('/appointments','POST',{ doctorId: docId, patientId: patId, date: new Date().toISOString() }, doctorToken);
  console.log(r.status, r.data);

  console.log('\n11) Create billing (staff token)');
  r = await req('/billings','POST',{ patientId: patId, amount: 123.45 }, staffToken);
  console.log(r.status, r.data);

  console.log('\n12) Access control test: doctor tries to delete staff (should be 403)');
  // find a staff id
  r = await req('/staffs','GET',null,adminToken);
  const staffList = r.data; const staffId = staffList && staffList.length? staffList[0].id : null;
  r = await req(`/staffs/${staffId}`,'DELETE',null,doctorToken);
  console.log(r.status, r.data);

  console.log('\nTest run finished');
}

run().catch(e=>{ console.error('Error during tests', e); process.exit(1); });
