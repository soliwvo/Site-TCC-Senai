const ProgressoMissao = require('../models/ProgressoMissao');
const Missao = require('../models/Missao');
const Usuario = require('../models/Usuario');

async function concluir(req, res) {
  try {
    const { missao_id } = req.body;
    const usuario_id = req.usuario.id;

    const missao = await Missao.findByPk(missao_id);
    if (!missao) {
      return res.status(404).json({ mensagem: 'Missão não encontrada' });
    }

    const jaConcluida = await ProgressoMissao.findOne({
      where: { usuario_id, missao_id, status: 'concluida' },
    });

    if (jaConcluida) {
      return res.status(400).json({ mensagem: 'Você já concluiu esta missão!' });
    }

    const usuario = await Usuario.findByPk(usuario_id);
    const novoXp = usuario.pontos_xp + missao.pontos_recompensa;
    const novoNivel = Math.floor(novoXp / 500) + 1;

    await usuario.update({
      pontos_xp: novoXp,
      nivel: novoNivel,
    });

    const progresso = await ProgressoMissao.create({
      usuario_id,
      missao_id,
      status: 'concluida',
      pontos_ganhos: missao.pontos_recompensa,
    });

    res.status(201).json({
      mensagem: `Missão concluída! +${missao.pontos_recompensa} XP conquistados!`,
      progresso,
      pontos_xp: novoXp,
      nivel: novoNivel,
    });
  } catch (erro) {
    res.status(400).json({
      mensagem: 'Erro ao concluir missão',
      erro: erro.message,
    });
  }
}

async function listar(req, res) {
  try {
    const progressos = await ProgressoMissao.findAll({
      where: { usuario_id: req.usuario.id },
      order: [['createdAt', 'DESC']],
    });
    res.json(progressos);
  } catch (erro) {
    res.status(400).json({
      mensagem: 'Erro ao listar histórico de missões',
      erro: erro.message,
    });
  }
}

module.exports = { concluir, listar };
