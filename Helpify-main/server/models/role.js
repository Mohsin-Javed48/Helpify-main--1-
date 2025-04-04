'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    static associate(models) {
      Role.hasMany(models.User, { foreignKey: 'roleId' }); // One Role -> Many Users
    }
  }

  Role.init(
    {
      name: { 
        type: DataTypes.STRING, 
        allowNull: false, 
        unique: true, 
      },
      
    },
    {
      sequelize,
      modelName: 'Role',
      tableName: 'Roles',
      timestamps: false,
    }
  );

  return Role;
};
