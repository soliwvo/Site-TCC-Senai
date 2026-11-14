const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Conquista = sequelize.define('Conquista', {
  titulo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descricao: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  icone: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '🏆',
  },
  xp_necessario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 100,
  },
});

module.exports = Conquista;
