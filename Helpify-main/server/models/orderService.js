"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class OrderService extends Model {
    static associate(models) {
      // OrderService belongs to an order
      if (models.Order) {
        OrderService.belongsTo(models.Order, {
          foreignKey: "orderId",
        });
      }

      // OrderService belongs to a service
      if (models.Service) {
        OrderService.belongsTo(models.Service, {
          foreignKey: "serviceId",
        });
      }
    }
  }

  OrderService.init(
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
      serviceId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Services",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      title: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "Title of the service (cached from service)",
      },
      subtitle: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "Subtitle or description of the service (cached from service)",
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "URL or path to service image (cached from service)",
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      subtotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "OrderService",
      tableName: "OrderServices",
      timestamps: true,
    }
  );

  // Hook to calculate subtotal before creating or updating
  OrderService.beforeCreate((orderService) => {
    if (orderService.price && orderService.quantity) {
      orderService.subtotal =
        parseFloat(orderService.price) * orderService.quantity;
    }
  });

  OrderService.beforeUpdate((orderService) => {
    if (orderService.price && orderService.quantity) {
      orderService.subtotal =
        parseFloat(orderService.price) * orderService.quantity;
    }
  });

  // Hook to copy service details if they're not provided
  OrderService.beforeCreate(async (orderService, options) => {
    // If title, subtitle, or image are not provided, try to get them from the service
    if (!orderService.title || !orderService.subtitle || !orderService.image) {
      try {
        const Service = sequelize.models.Service;
        const service = await Service.findByPk(orderService.serviceId, {
          transaction: options.transaction,
        });

        if (service) {
          if (!orderService.title) orderService.title = service.name;
          if (!orderService.subtitle)
            orderService.subtitle = service.description;
          if (!orderService.image) orderService.image = service.image;
          if (!orderService.price) orderService.price = service.price;
        }
      } catch (error) {
        console.error("Error copying service details:", error);
      }
    }
  });

  return OrderService;
};
