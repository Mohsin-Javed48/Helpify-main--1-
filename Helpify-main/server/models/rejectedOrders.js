const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class RejectedOrder extends Model {
    static associate(models) {
      RejectedOrder.belongsTo(models.Order, {
        foreignKey: "orderId",
        as: "order",
      });
      RejectedOrder.belongsTo(models.ServiceProvider, {
        foreignKey: "serviceProviderId",
        as: "serviceProvider",
      });
    }
  }

  RejectedOrder.init(
    {
      orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Orders",
          key: "id",
        },
      },
      serviceProviderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "ServiceProviders",
          key: "id",
        },
      },
      rejectedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "RejectedOrder",
      tableName: "rejected_orders",
    }
  );

  return RejectedOrder;
};
