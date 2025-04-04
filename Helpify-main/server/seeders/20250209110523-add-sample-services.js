"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Services", [
      {
        name: "Mixer Tap Installation",
        description: "Install mixer taps per piece",
        price: 300.0,
        providerId: 8,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Drain Cleaning",
        description: "Clear clogged drains per hour",
        price: 500.0,
        providerId: 8,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Pipe Leak Repair",
        description: "Repair leaking pipes per service",
        price: 400.0,
        providerId: 8,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Water Heater Installation",
        description: "Install water heaters per unit",
        price: 2000.0,
        providerId: 8,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Toilet Installation",
        description: "Install toilets per unit",
        price: 1500.0,
        providerId: 8,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Shower Head Replacement",
        description: "Replace shower heads per service",
        price: 250.0,
        providerId: 8,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Geyser Maintenance",
        description: "Geyser maintenance per hour",
        price: 600.0,
        providerId: 8,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Services", { providerId: 1 }, {});
  },
};
