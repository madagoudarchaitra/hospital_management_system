require('dotenv').config();
const { sequelize } = require('./models');

async function fixDatabase() {
  try {
    console.log('🔄 Connecting to database...');
    await sequelize.authenticate();
    console.log('✅ Connected to database');

    // Remove invalid billing records (where patientId doesn't exist in patients table)
    console.log('🔧 Cleaning up invalid billing records...');
    const [billingResults] = await sequelize.query(`
      DELETE FROM billings 
      WHERE patientId NOT IN (SELECT id FROM patients)
    `);
    console.log(`✅ Removed ${billingResults.affectedRows || 0} invalid billing records`);

    // Remove invalid lab_reports records
    console.log('🔧 Cleaning up invalid lab report records...');
    const [labResults] = await sequelize.query(`
      DELETE FROM lab_reports 
      WHERE patientId NOT IN (SELECT id FROM patients)
    `);
    console.log(`✅ Removed ${labResults.affectedRows || 0} invalid lab report records`);

    console.log('✨ Database fixed! You can now restart the server.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    console.error(err);
    process.exit(1);
  }
}

fixDatabase();
