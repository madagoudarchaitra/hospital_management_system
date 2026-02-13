const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Billing', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    patientId: { type: DataTypes.INTEGER, allowNull: false },
    amount: { type: DataTypes.DECIMAL(10,2), defaultValue: 0 },
    status: { type: DataTypes.ENUM('pending','paid'), defaultValue: 'pending' }
  }, { tableName: 'billings' });
};
