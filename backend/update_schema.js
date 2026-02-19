const sequelize = require('./src/config/db');

async function updateSchema() {
  try {
    console.log('🔄 Updating database schema...');
    
    await sequelize.authenticate();
    console.log('✅ Database connected');
    
    // Sync with alter to add new columns
    await sequelize.sync({ alter: true });
    console.log('✅ Schema updated successfully!');
    
    console.log('\n📋 New columns added to staffs table:');
    console.log('   - department');
    console.log('   - phone');
    console.log('   - email');
    
    console.log('\n🚀 You can now restart your backend server');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating schema:', error.message);
    console.error(error);
    process.exit(1);
  }
}

updateSchema();
