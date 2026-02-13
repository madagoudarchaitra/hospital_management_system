const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const User = require('./user')(sequelize);
const Patient = require('./patient')(sequelize);
const Doctor = require('./doctor')(sequelize);
const Appointment = require('./appointment')(sequelize);
const Billing = require('./billing')(sequelize);
const Pharmacy = require('./pharmacy')(sequelize);
const LabReport = require('./labReport')(sequelize);
const Bed = require('./bed')(sequelize);
const Staff = require('./staff')(sequelize);

// Associations
User.hasOne(Doctor, { foreignKey: 'userId' });
User.hasOne(Patient, { foreignKey: 'userId' });
Doctor.belongsTo(User, { foreignKey: 'userId' });
Patient.belongsTo(User, { foreignKey: 'userId' });

Doctor.hasMany(Appointment, { foreignKey: 'doctorId' });
Patient.hasMany(Appointment, { foreignKey: 'patientId' });
Appointment.belongsTo(Doctor, { foreignKey: 'doctorId' });
Appointment.belongsTo(Patient, { foreignKey: 'patientId' });

module.exports = {
  sequelize,
  Sequelize,
  User,
  Patient,
  Doctor,
  Appointment,
  Billing,
  Pharmacy,
  LabReport,
  Bed,
  Staff
};
