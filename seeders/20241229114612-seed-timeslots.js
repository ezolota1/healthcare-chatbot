'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Timeslots', [
      {
        scheduleId: 1, 
        time: '09:00:00',
        date: '2025-02-15',
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        scheduleId: 1,
        time: '10:00:00',
        date: '2025-02-15',
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        scheduleId: 1, 
        time: '11:00:00',
        date: '2025-02-15',
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        scheduleId: 1,
        time: '12:00:00',
        date: '2025-02-15',
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Timeslots', null, {});
  },
};
