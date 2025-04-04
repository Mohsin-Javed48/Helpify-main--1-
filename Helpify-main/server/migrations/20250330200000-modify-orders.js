"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add new columns
    await queryInterface.addColumn("Orders", "orderNumber", {
      type: Sequelize.STRING,
      allowNull: true,
      comment: "Custom order number (e.g., ORD-1234)",
    });

    await queryInterface.addColumn("Orders", "area", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("Orders", "city", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("Orders", "zipCode", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("Orders", "additionalInfo", {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    // Modify existing columns
    await queryInterface.changeColumn("Orders", "serviceProviderId", {
      type: Sequelize.INTEGER,
      allowNull: true, // Allow null because provider may not be assigned at creation
      references: {
        model: "ServiceProviders",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });

    await queryInterface.changeColumn("Orders", "userId", {
      type: Sequelize.INTEGER,
      allowNull: true, // Allow null for guest orders
      references: {
        model: "Users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });

    // Remove title column (not needed per frontend model)
    await queryInterface.removeColumn("Orders", "title");

    // Rename description column to match frontend (if needed)
    await queryInterface.renameColumn("Orders", "description", "details");
  },

  async down(queryInterface, Sequelize) {
    // Revert the changes
    await queryInterface.removeColumn("Orders", "orderNumber");
    await queryInterface.removeColumn("Orders", "area");
    await queryInterface.removeColumn("Orders", "city");
    await queryInterface.removeColumn("Orders", "zipCode");
    await queryInterface.removeColumn("Orders", "additionalInfo");

    // Restore original columns
    await queryInterface.changeColumn("Orders", "serviceProviderId", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "ServiceProviders",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });

    await queryInterface.changeColumn("Orders", "userId", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });

    // Restore title column
    await queryInterface.addColumn("Orders", "title", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    // Rename back to original
    await queryInterface.renameColumn("Orders", "details", "description");
  },
};
