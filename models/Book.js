const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const Book = sequelize.define('Book', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  isbn: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El título del libro es requerido',
      },
    },
  },
  autor: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El autor del libro es requerido',
      },
    },
  },
  year: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El año de edición del libro es requerido',
      },
    },
  },
  library: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

module.exports = Book;
