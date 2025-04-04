"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add status column
    await queryInterface.addColumn("Complains", "status", {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "pending",
    });

    // Add timestamps
    await queryInterface.addColumn("Complains", "createdAt", {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    });

    await queryInterface.addColumn("Complains", "updatedAt", {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove columns in reverse order
    await queryInterface.removeColumn("Complains", "updatedAt");
    await queryInterface.removeColumn("Complains", "createdAt");
    await queryInterface.removeColumn("Complains", "status");
  },
};
