const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Staff', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING },
    role: { type: DataTypes.STRING }
  }, { tableName: 'staffs' });
};
