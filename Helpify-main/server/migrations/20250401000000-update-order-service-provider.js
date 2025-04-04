"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Make serviceProviderId nullable
    await queryInterface.changeColumn("Orders", "serviceProviderId", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "ServiceProviders",
        key: "id",
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Revert back to non-nullable
    await queryInterface.changeColumn("Orders", "serviceProviderId", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "ServiceProviders",
        key: "id",
      },
    });
  },
};
