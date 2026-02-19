const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Pharmacy', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    stock: { type: DataTypes.INTEGER, defaultValue: 0 },
    price: { type: DataTypes.DECIMAL(10,2), defaultValue: 0 }
  }, { 
    tableName: 'pharmacies',
    timestamps: false
  });
};
