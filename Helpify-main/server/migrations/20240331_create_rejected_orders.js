"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("rejected_orders", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
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
      rejectedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });

    // Add a unique constraint to prevent duplicate rejections
    await queryInterface.addConstraint("rejected_orders", {
      fields: ["orderId", "serviceProviderId"],
      type: "unique",
      name: "unique_order_provider_rejection",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("rejected_orders");
  },
};
