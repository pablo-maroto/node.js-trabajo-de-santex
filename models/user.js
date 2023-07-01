const { DataTypes } = require('sequelize');
const Sequelize = require('sequelize');
const sequelize = new Sequelize('../config/database', 'username', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  storage: 'database.sqlite',
});

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

User.sync({ alter: true })
  .then(() => {
    console.log('Modelo de Usuario sincronizado con la base de datos');
  })
  .catch((error) => {
    console.log('Error al sincronizar el modelo de Usuario:', error);
  });

module.exports = User;
