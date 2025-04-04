"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ServiceProvider extends Model {
    static associate(models) {
      // Define associations
      if (models.User) {
        ServiceProvider.belongsTo(models.User, { foreignKey: "userId" });
      }

      //   One service provider can have many orders
      ServiceProvider.hasMany(models.Order, {
        foreignKey: "serviceProviderId",
        as: "orders",
      });

      // Service provider can submit many bids
      if (models.OrderBid) {
        ServiceProvider.hasMany(models.OrderBid, {
          foreignKey: "serviceProviderId",
          as: "bids",
        });
      }
    }
  }

  ServiceProvider.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "Users", key: "id" },
      },
      designation: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "Service provider job title (e.g., Plumber, Electrician)",
      },
      location: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      ratePerHour: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      totalOrders: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      completedOrders: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      totalEarnings: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.0,
      },
      rating: {
        type: DataTypes.DECIMAL(3, 2),
        defaultValue: 0.0,
        validate: {
          min: 0,
          max: 5,
        },
      },
      experience: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: "Experience in years",
      },
      status: {
        type: DataTypes.ENUM("active", "inactive", "pending"),
        defaultValue: "pending",
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      availabilityStatus: {
        type: DataTypes.ENUM("available", "busy", "offline"),
        defaultValue: "offline",
      },
      joinedDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      lastActive: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "ServiceProvider",
      tableName: "ServiceProviders",
      timestamps: true,
    }
  );

  return ServiceProvider;
};
