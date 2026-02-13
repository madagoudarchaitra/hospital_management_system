const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Patient', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: true },
    age: { type: DataTypes.INTEGER },
    gender: { type: DataTypes.STRING },
    address: { type: DataTypes.STRING }
  }, { tableName: 'patients' });
};
