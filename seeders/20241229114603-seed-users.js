'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword1 = await bcrypt.hash('password123', 10);
    const hashedPassword2 = await bcrypt.hash('emina', 10);
    const hashedPassword3 = await bcrypt.hash('operator', 10);

    await queryInterface.bulkInsert('Users', [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        username: 'johndoe',
        password: hashedPassword1, 
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
        password: hashedPassword2,
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
        password: hashedPassword3,
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
