const bcrypt = require('bcrypt');
const Usuario = require('../models/Usuario');

async function cadastrar(req, res) {
  try {
    const { nome, email, senha, tipo } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ mensagem: 'Preencha nome, e-mail e senha.' });
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const usuario = await Usuario.create({
      nome,
      email,
      senha: senhaCriptografada,
      tipo: tipo || 'jogador',
    });

    res.status(201).json({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      tipo: usuario.tipo,
    });
  } catch (erro) {
    res.status(400).json({
      mensagem: 'Erro ao cadastrar usuário',
      erro: erro.message,
    });
  }
}

async function perfil(req, res) {
  try {
    const usuario = await Usuario.findByPk(req.usuario.id, {
      attributes: ['id', 'nome', 'email', 'tipo', 'pontos_xp', 'nivel'],
    });

    if (!usuario) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado' });
    }

    res.json(usuario);
  } catch (erro) {
    res.status(400).json({
      mensagem: 'Erro ao carregar perfil do usuário',
      erro: erro.message,
    });
  }
}

module.exports = { cadastrar, perfil };
