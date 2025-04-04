'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    await queryInterface.addColumn('Users', 'address', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('Users', 'vatNumber', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    
    await queryInterface.addColumn('Users', 'contact', {
      type: Sequelize.STRING,
      allowNull: true,
    });

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'address');
    await queryInterface.removeColumn('Users', 'vatNumber');
    await queryInterface.removeColumn('Users', 'contact');

  }
};
