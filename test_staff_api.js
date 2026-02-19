require('dotenv').config({ path: './backend/.env' });
const mysql = require('mysql2/promise');

async function testStaffAPI() {
  let connection;
  try {
    console.log('🔍 Testing Staff API Setup...\n');
    
    // Connect to database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME
    });

    console.log('✅ Connected to database\n');

    // Check staffs table structure
    console.log('📋 Checking staffs table structure:');
    const [columns] = await connection.query('DESCRIBE staffs');
    console.log('Columns found:');
    columns.forEach(col => {
      console.log(`  - ${col.Field} (${col.Type})`);
    });

    // Check if required columns exist
    const columnNames = columns.map(c => c.Field);
    const requiredColumns = ['id', 'name', 'role', 'department', 'phone', 'email'];
    const missingColumns = requiredColumns.filter(c => !columnNames.includes(c));

    if (missingColumns.length > 0) {
      console.log('\n❌ Missing columns:', missingColumns.join(', '));
      console.log('\n🔧 Run this command to add missing columns:');
      console.log('   node backend/add_columns.js');
    } else {
      console.log('\n✅ All required columns exist!');
    }

    // Try to fetch staff data
    console.log('\n📊 Fetching staff data:');
    const [staffs] = await connection.query('SELECT * FROM staffs LIMIT 5');
    console.log(`Found ${staffs.length} staff records`);
    if (staffs.length > 0) {
      console.log('Sample record:', staffs[0]);
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.code === 'ER_NO_SUCH_TABLE') {
      console.log('\n🔧 The staffs table does not exist. Run database migrations.');
    }
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

testStaffAPI();
