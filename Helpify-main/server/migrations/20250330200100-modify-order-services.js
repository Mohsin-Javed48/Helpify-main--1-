"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add new columns to match the frontend service structure
    await queryInterface.addColumn("OrderServices", "title", {
      type: Sequelize.STRING,
      allowNull: true,
      comment: "Title of the service (cached from service)",
    });

    await queryInterface.addColumn("OrderServices", "subtitle", {
      type: Sequelize.STRING,
      allowNull: true,
      comment: "Subtitle or description of the service (cached from service)",
    });

    await queryInterface.addColumn("OrderServices", "image", {
      type: Sequelize.STRING,
      allowNull: true,
      comment: "URL or path to service image (cached from service)",
    });
  },

  async down(queryInterface, Sequelize) {
    // Revert the changes
    await queryInterface.removeColumn("OrderServices", "title");
    await queryInterface.removeColumn("OrderServices", "subtitle");
    await queryInterface.removeColumn("OrderServices", "image");
  },
};
