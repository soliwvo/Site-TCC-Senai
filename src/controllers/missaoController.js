const Missao = require('../models/Missao');
const { Op } = require('sequelize');

async function cadastrar(req, res) {
  try {
    const { titulo, descricao, jornada, dificuldade, pontos_recompensa } = req.body;

    const missao = await Missao.create({
      titulo,
      descricao,
      jornada,
      dificuldade,
      pontos_recompensa,
    });

    res.status(201).json(missao);
  } catch (erro) {
    res.status(400).json({
      mensagem: 'Erro ao cadastrar missão',
      erro: erro.message,
    });
  }
}

async function listar(req, res) {
  try {
    const { pagina = 1, limite = 5, nome, jornada } = req.query;
    const filtro = {};

    if (nome) {
      filtro.titulo = { [Op.like]: `%${nome}%` };
    }

    if (jornada) {
      filtro.jornada = { [Op.like]: `%${jornada}%` };
    }

    const missoes = await Missao.findAll({
      where: filtro,
      limit: Number(limite),
      offset: (Number(pagina) - 1) * Number(limite),
      order: [['id', 'ASC']],
    });

    res.json(missoes);
  } catch (erro) {
    res.status(400).json({
      mensagem: 'Erro ao listar missões',
      erro: erro.message,
    });
  }
}

async function deletar(req, res) {
  try {
    const { id } = req.params;
    const missao = await Missao.findByPk(id);

    if (!missao) {
      return res.status(404).json({ mensagem: 'Missão não encontrada' });
    }

    await missao.destroy();
    res.status(200).json({ mensagem: 'Missão removida com sucesso' });
  } catch (erro) {
    res.status(400).json({
      mensagem: 'Erro ao remover missão',
      erro: erro.message,
    });
  }
}

module.exports = { cadastrar, listar, deletar };
