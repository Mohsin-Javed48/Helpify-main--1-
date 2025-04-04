"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      // Order belongs to a user (customer)
      if (models.User) {
        Order.belongsTo(models.User, {
          foreignKey: "userId",
          as: "customer",
        });
      }

      // Order belongs to a service provider
      if (models.ServiceProvider) {
        Order.belongsTo(models.ServiceProvider, {
          foreignKey: "serviceProviderId",
          as: "serviceProvider",
        });
      }

      // Order can have many services
      if (models.Service) {
        Order.belongsToMany(models.Service, {
          through: "OrderServices",
          foreignKey: "orderId",
          as: "services",
        });
      }

      // Order can have many bids from service providers
      if (models.OrderBid) {
        Order.hasMany(models.OrderBid, {
          foreignKey: "orderId",
          as: "bids",
        });
      }
    }
  }

  Order.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      orderNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "Custom order number (e.g., ORD-1234)",
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true, // Allow null for guest orders
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      serviceProviderId: {
        type: DataTypes.INTEGER,
        allowNull: true, // Change this to allow null values
        references: {
          model: "ServiceProviders",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      details: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      area: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      zipCode: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      additionalInfo: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      scheduledDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      scheduledTime: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      originalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        comment: "Original price before negotiation",
      },
      isNegotiated: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: "Whether the price was negotiated",
      },
      status: {
        type: DataTypes.ENUM(
          "pending",
          "accepted",
          "in_progress",
          "completed",
          "cancelled",
          "rejected"
        ),
        allowNull: false,
        defaultValue: "pending",
      },
      paymentStatus: {
        type: DataTypes.ENUM("pending", "completed", "refunded", "failed"),
        allowNull: false,
        defaultValue: "pending",
      },
      paymentMethod: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      rating: {
        type: DataTypes.DECIMAL(3, 1),
        allowNull: true,
        validate: {
          min: 1.0,
          max: 5.0,
        },
      },
      review: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      completedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      cancellationReason: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Order",
      tableName: "Orders",
      timestamps: true,
    }
  );

  // Method to generate a unique order number
  Order.generateOrderNumber = async function () {
    let prefix = "ORD-";
    let randomNum = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
    let orderNum = `${prefix}${randomNum}`;

    // Check if this order number already exists
    const existingOrder = await this.findOne({
      where: { orderNumber: orderNum },
    });

    // If exists, generate a new one recursively
    if (existingOrder) {
      return this.generateOrderNumber();
    }

    return orderNum;
  };

  // Hook to automatically set order number before creation
  Order.beforeCreate(async (order) => {
    if (!order.orderNumber) {
      order.orderNumber = await Order.generateOrderNumber();
    }
  });

  return Order;
};
