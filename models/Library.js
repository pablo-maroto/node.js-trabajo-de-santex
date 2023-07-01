const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const Library = sequelize.define('Library', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'El nombre de la librería es requerido',
          },
        },
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'La dirección de la librería es requerida',
          },
        },
      },
      telefono: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'El número de teléfono es requerido',
          },
          isNumeric: {
            msg: 'El número de teléfono debe ser numérico',
          },
        },
      },
    });
module.exports = Library;
