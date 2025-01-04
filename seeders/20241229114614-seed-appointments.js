'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Appointments', [
      {
        doctorId: 1, 
        patientId: 1, 
        firstName: 'Emina',
        lastName: 'Zolota',
        uniquePersonalIdentificationNumber: '12345',
        issueDescription: 'Routine Checkup',
        date: '2024-01-01',
        time: '09:00:00',
        status: 'Confirmed',
        timeSlotId: 1, 
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Appointments', null, {});
  },
};
