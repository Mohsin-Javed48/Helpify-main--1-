"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class OrderBid extends Model {
    static associate(models) {
      // OrderBid belongs to a service provider
      if (models.ServiceProvider) {
        OrderBid.belongsTo(models.ServiceProvider, {
          foreignKey: "serviceProviderId",
          as: "provider",
        });
      }

      // OrderBid belongs to an order
      if (models.Order) {
        OrderBid.belongsTo(models.Order, {
          foreignKey: "orderId",
          as: "order",
        });
      }
    }
  }

  OrderBid.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Orders",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      serviceProviderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "ServiceProviders",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      originalPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: "Original price calculated from services",
      },
      bidPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: "Price offered by service provider",
      },
      bidMessage: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "Optional message with the bid",
      },
      customerCounterOffer: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        comment: "Counter offer price by customer if any",
      },
      status: {
        type: DataTypes.ENUM(
          "pending",
          "accepted",
          "counter_offered",
          "rejected",
          "expired"
        ),
        allowNull: false,
        defaultValue: "pending",
        comment: "Status of the bid",
      },
    },
    {
      sequelize,
      modelName: "OrderBid",
      tableName: "OrderBids",
      timestamps: true,
    }
  );

  return OrderBid;
};
