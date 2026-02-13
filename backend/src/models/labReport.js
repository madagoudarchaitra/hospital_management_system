const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('LabReport', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    patientId: { type: DataTypes.INTEGER, allowNull: false },
    reportType: { type: DataTypes.STRING },
    result: { type: DataTypes.TEXT }
  }, { tableName: 'lab_reports' });
};
