const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('./Usuario');
const Missao = require('./Missao');

const ProgressoMissao = sequelize.define('ProgressoMissao', {
  status: {
    type: DataTypes.ENUM('em_andamento', 'concluida'),
    allowNull: false,
    defaultValue: 'concluida',
  },
  pontos_ganhos: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  data_conclusao: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

Usuario.hasMany(ProgressoMissao, { foreignKey: 'usuario_id' });
ProgressoMissao.belongsTo(Usuario, { foreignKey: 'usuario_id' });

Missao.hasMany(ProgressoMissao, { foreignKey: 'missao_id' });
ProgressoMissao.belongsTo(Missao, { foreignKey: 'missao_id' });

module.exports = ProgressoMissao;
