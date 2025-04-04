"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Orders", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      serviceProviderId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "ServiceProviders", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      title: { type: Sequelize.STRING, allowNull: false },
      description: { type: Sequelize.TEXT },
      address: { type: Sequelize.STRING, allowNull: false },
      scheduledDate: { type: Sequelize.DATE, allowNull: false },
      scheduledTime: { type: Sequelize.STRING, allowNull: false },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      originalAmount: { type: Sequelize.DECIMAL(10, 2) },
      isNegotiated: { type: Sequelize.BOOLEAN, defaultValue: false },
      status: {
        type: Sequelize.ENUM(
          "pending",
          "accepted",
          "in_progress",
          "completed",
          "cancelled",
          "rejected"
        ),
        defaultValue: "pending",
      },
      paymentStatus: {
        type: Sequelize.ENUM("pending", "completed", "refunded", "failed"),
        defaultValue: "pending",
      },
      paymentMethod: { type: Sequelize.STRING },
      rating: { type: Sequelize.DECIMAL(3, 1) },
      review: { type: Sequelize.TEXT },
      completedAt: { type: Sequelize.DATE },
      cancellationReason: { type: Sequelize.TEXT },
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
    await queryInterface.dropTable("Orders");
  },
};
