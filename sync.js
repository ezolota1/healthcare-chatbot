const { sequelize } = require('./models');

sequelize.sync({ force: true, logging: console.log })
  .then(() => {
    console.log('Database synced successfully');
  })
  .catch((err) => {
    console.error('Error syncing database:', err);
  });
