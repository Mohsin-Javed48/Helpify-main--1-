"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.belongsTo(models.Role, { foreignKey: "roleId" }); // Each User belongs to one Role
      User.hasMany(models.Order, { foreignKey: "userId" }); // Add this line to establish the relationship with orders
    }
  }

  User.init(
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      contact: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      forgetToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "Roles", key: "id" }, // Foreign Key to Role Table
      },
      status: {
        type: DataTypes.ENUM("active", "suspended"),
        defaultValue: "active",
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "Users",
      timestamps: true,
    }
  );

  return User;
};
