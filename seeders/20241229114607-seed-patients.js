'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Patients', [
      {
        userId: 2, 
        medicalRecord: JSON.stringify({ allergies: 'Peanuts', bloodType: 'O+' }),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Patients', null, {});
  },
};
