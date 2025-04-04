"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Service extends Model {
    static associate(models) {
      // Service can belong to many service providers
      if (models.ServiceProvider) {
        Service.belongsToMany(models.ServiceProvider, {
          through: "ServiceProviderServices",
          foreignKey: "serviceId",
          as: "serviceProviders",
        });
      }

      // Service can belong to many orders
      if (models.Order) {
        Service.belongsToMany(models.Order, {
          through: "OrderServices",
          foreignKey: "serviceId",
          as: "orders",
        });
      }
    }
  }

  Service.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      price: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      total_orders: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      total_providers: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true, // Image is optional
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      },
    },
    {
      sequelize,
      modelName: "Service",
      tableName: "Services",
      timestamps: true,
    }
  );

  return Service;
};
