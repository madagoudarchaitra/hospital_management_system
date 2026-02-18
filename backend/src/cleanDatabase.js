require('dotenv').config();
const { sequelize } = require('./models');

async function cleanDatabase() {
  try {
    console.log('🔄 Connecting to database...');
    await sequelize.authenticate();
    console.log('✅ Connected to database');

    console.log('🗑️  Dropping all tables...');
    await sequelize.drop();
    console.log('✅ All tables dropped');

    console.log('🔨 Creating tables with proper constraints...');
    await sequelize.sync({ force: true });
    console.log('✅ All tables created successfully');

    console.log('✨ Database cleaned and ready!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

cleanDatabase();
