const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Doctor', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: true },
    name: { type: DataTypes.STRING },
    specialty: { type: DataTypes.STRING },
    phone: { type: DataTypes.STRING },
    qualifications: { type: DataTypes.STRING },
    experience: { type: DataTypes.TEXT }
  }, { 
    tableName: 'doctors',
    timestamps: false
  });
};
