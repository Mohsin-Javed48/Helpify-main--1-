"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("OrderBids", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      orderId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Orders",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      serviceProviderId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "ServiceProviders",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      originalPrice: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        comment: "Original price calculated from services",
      },
      bidPrice: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        comment: "Price offered by service provider",
      },
      bidMessage: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: "Optional message with the bid",
      },
      customerCounterOffer: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
        comment: "Counter offer price by customer if any",
      },
      status: {
        type: Sequelize.ENUM(
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
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("OrderBids");
  },
};
