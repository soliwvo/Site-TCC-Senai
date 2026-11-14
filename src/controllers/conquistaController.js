const Conquista = require('../models/Conquista');
const Usuario = require('../models/Usuario');

async function cadastrar(req, res) {
  try {
    const { titulo, descricao, icone, xp_necessario } = req.body;
    const conquista = await Conquista.create({
      titulo,
      descricao,
      icone: icone || '🏆',
      xp_necessario: Number(xp_necessario),
    });
    res.status(201).json(conquista);
  } catch (erro) {
    res.status(400).json({
      mensagem: 'Erro ao cadastrar conquista',
      erro: erro.message,
    });
  }
}

async function listar(req, res) {
  try {
    const usuario = await Usuario.findByPk(req.usuario.id);
    const conquistas = await Conquista.findAll({
      order: [['xp_necessario', 'ASC']],
    });

    const resultado = conquistas.map((c) => ({
      id: c.id,
      titulo: c.titulo,
      descricao: c.descricao,
      icone: c.icone,
      xp_necessario: c.xp_necessario,
      desbloqueada: usuario ? usuario.pontos_xp >= c.xp_necessario : false,
    }));

    res.json(resultado);
  } catch (erro) {
    res.status(400).json({
      mensagem: 'Erro ao listar conquistas',
      erro: erro.message,
    });
  }
}

module.exports = { cadastrar, listar };
