"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ServiceProviders", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      designation: { type: Sequelize.STRING, allowNull: false },
      location: { type: Sequelize.STRING },
      ratePerHour: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      totalOrders: { type: Sequelize.INTEGER, defaultValue: 0 },
      completedOrders: { type: Sequelize.INTEGER, defaultValue: 0 },
      totalEarnings: { type: Sequelize.DECIMAL(10, 2), defaultValue: 0.0 },
      rating: { type: Sequelize.DECIMAL(3, 2), defaultValue: 0.0 },
      experience: { type: Sequelize.INTEGER, defaultValue: 0 },
      status: {
        type: Sequelize.ENUM("active", "inactive", "pending"),
        defaultValue: "pending",
      },
      isVerified: { type: Sequelize.BOOLEAN, defaultValue: false },
      availabilityStatus: {
        type: Sequelize.ENUM("available", "busy", "offline"),
        defaultValue: "offline",
      },
      joinedDate: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      lastActive: { type: Sequelize.DATE },
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
    await queryInterface.dropTable("ServiceProviders");
  },
};
