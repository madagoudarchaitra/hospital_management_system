const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Staff', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.STRING, allowNull: false }
  }, { 
    tableName: 'staffs',
    timestamps: false
  });
};
