const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Missao = sequelize.define('Missao', {
  titulo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  jornada: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dificuldade: {
    type: DataTypes.ENUM('facil', 'medio', 'dificil'),
    allowNull: false,
    defaultValue: 'facil',
  },
  pontos_recompensa: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 100,
  },
});

module.exports = Missao;
