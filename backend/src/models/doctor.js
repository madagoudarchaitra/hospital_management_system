const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Doctor', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: true },
    specialty: { type: DataTypes.STRING },
    phone: { type: DataTypes.STRING }
  }, { tableName: 'doctors' });
};
