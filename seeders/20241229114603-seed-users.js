'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        username: 'johndoe',
        password: 'password123', // we can hash this later
        dateOfBirth: '1990-01-01',
        phoneNumber: '123456789',
        role: 'doctor',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstName: 'Emina',
        lastName: 'Zolota',
        email: 'emina@gmail.com',
        username: 'emina',
        password: 'emina',
        dateOfBirth: '2001-09-02',
        phoneNumber: '987654321',
        role: 'patient',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstName: 'Human',
        lastName: 'Operator',
        email: 'human@gmail.com',
        username: 'operator',
        password: 'operator',
        dateOfBirth: '2000-09-02',
        phoneNumber: '111222333',
        role: 'human operator',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  },
};
