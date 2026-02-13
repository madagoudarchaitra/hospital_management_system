require('dotenv').config();
const { sequelize, User } = require('./models');
const bcrypt = require('bcrypt');

async function seed(){
  try{
    await sequelize.sync({ alter: true });
    const pw = await bcrypt.hash('admin123', 10);
    const [admin] = await User.findOrCreate({ where: { email: 'admin@example.com' }, defaults: { name: 'Admin', password: pw, role: 'admin' } });
    console.log('Seed finished. Admin:', admin.email);
    process.exit(0);
  }catch(err){ console.error(err); process.exit(1); }
}

seed();
