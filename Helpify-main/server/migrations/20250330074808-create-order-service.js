"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("OrderServices", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      orderId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Orders", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      serviceId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Services", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      quantity: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 1 },
      price: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      subtotal: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      notes: { type: Sequelize.TEXT },
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
    await queryInterface.dropTable("OrderServices");
  },
};
