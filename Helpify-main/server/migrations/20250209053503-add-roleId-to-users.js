'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'roleId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 3, // Assign default role (e.g., User)
      references: {
        model: 'Roles', // Table name in the database
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('Users', 'roleId');
  },
};
