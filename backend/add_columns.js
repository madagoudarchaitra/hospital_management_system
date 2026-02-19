require('dotenv').config();
const mysql = require('mysql2/promise');

async function addColumns() {
  let connection;
  try {
    console.log('🔧 Connecting to database...');
    
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME
    });

    console.log('✅ Connected to database');

    // Add columns to staffs table
    console.log('\n📝 Adding columns to staffs table...');
    
    try {
      await connection.query('ALTER TABLE staffs ADD COLUMN department VARCHAR(255)');
      console.log('✅ Added department column');
    } catch (e) {
      if (e.code === 'ER_DUP_FIELDNAME') {
        console.log('ℹ️  department column already exists');
      } else {
        throw e;
      }
    }

    try {
      await connection.query('ALTER TABLE staffs ADD COLUMN phone VARCHAR(255)');
      console.log('✅ Added phone column');
    } catch (e) {
      if (e.code === 'ER_DUP_FIELDNAME') {
        console.log('ℹ️  phone column already exists');
      } else {
        throw e;
      }
    }

    try {
      await connection.query('ALTER TABLE staffs ADD COLUMN email VARCHAR(255)');
      console.log('✅ Added email column');
    } catch (e) {
      if (e.code === 'ER_DUP_FIELDNAME') {
        console.log('ℹ️  email column already exists');
      } else {
        throw e;
      }
    }

    // Add columns to patients table
    console.log('\n📝 Adding columns to patients table...');
    
    try {
      await connection.query('ALTER TABLE patients ADD COLUMN name VARCHAR(255)');
      console.log('✅ Added name column');
    } catch (e) {
      if (e.code === 'ER_DUP_FIELDNAME') {
        console.log('ℹ️  name column already exists');
      } else {
        throw e;
      }
    }

    try {
      await connection.query('ALTER TABLE patients ADD COLUMN contact VARCHAR(255)');
      console.log('✅ Added contact column');
    } catch (e) {
      if (e.code === 'ER_DUP_FIELDNAME') {
        console.log('ℹ️  contact column already exists');
      } else {
        throw e;
      }
    }

    console.log('\n✅ All columns added successfully!');
    console.log('\n🚀 Now restart your backend server with: npm start');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\nPlease check:');
    console.error('1. MySQL is running');
    console.error('2. .env file has correct credentials');
    console.error('3. Database "hospital_management" exists');
  } finally {
    if (connection) {
      await connection.end();
    }
    process.exit(0);
  }
}

addColumns();
