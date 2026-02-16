require('dotenv').config();
const { sequelize, User, Patient } = require('./models');
const bcrypt = require('bcrypt');

async function seed(){
  try{
    await sequelize.sync({ alter: true });
    const pw = await bcrypt.hash('admin123', 10);
    const [admin] = await User.findOrCreate({ where: { email: 'admin@example.com' }, defaults: { name: 'Admin', password: pw, role: 'admin' } });
    
    // Create test patient users and patients
    const patients = [
      { name: 'Alice Johnson', email: 'alice@example.com', age: 34, gender: 'Female', address: '123 Main St' },
      { name: 'Bob Smith', email: 'bob@example.com', age: 48, gender: 'Male', address: '456 Oak Ave' },
      { name: 'Carol Lee', email: 'carol@example.com', age: 29, gender: 'Female', address: '789 Pine Rd' },
      { name: 'David Brown', email: 'david@example.com', age: 55, gender: 'Male', address: '321 Elm St' },
      { name: 'Eva Martinez', email: 'eva@example.com', age: 42, gender: 'Female', address: '654 Maple Dr' }
    ];

    for (const patientData of patients) {
      const [user] = await User.findOrCreate({
        where: { email: patientData.email },
        defaults: { name: patientData.name, password: pw, role: 'patient' }
      });
      
      await Patient.findOrCreate({
        where: { userId: user.id },
        defaults: { userId: user.id, age: patientData.age, gender: patientData.gender, address: patientData.address }
      });
    }
    
    console.log('Seed finished. Admin:', admin.email);
    process.exit(0);
  }catch(err){ console.error(err); process.exit(1); }
}

seed();
