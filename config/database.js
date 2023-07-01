module.exports = {
    development: {
      dialect: 'sqlite',
      storage: './dev.database.sqlite',
    },
    production: {
      dialect: 'sqlite',
      storage: './prod.database.sqlite',
    },
  };
const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: {
    timestamps: false // Si no uso timestamps en los modelos
  },
});

module.exports = { sequelize };
