"use strict";

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert("Roles", [
      { id: 1, name: "Admin", createdAt: new Date(), updatedAt: new Date() },
      { id: 2, name: "Provider", createdAt: new Date(), updatedAt: new Date() },
      { id: 3, name: "User", createdAt: new Date(), updatedAt: new Date() },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("Roles", null, {});
  },
};
