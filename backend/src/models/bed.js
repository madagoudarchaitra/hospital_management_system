const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Bed', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    ward: { type: DataTypes.STRING },
    number: { type: DataTypes.STRING },
    occupied: { type: DataTypes.BOOLEAN, defaultValue: false }
  }, { tableName: 'beds' });
};
