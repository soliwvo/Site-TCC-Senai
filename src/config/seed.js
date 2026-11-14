const bcrypt = require('bcrypt');
const Usuario = require('../models/Usuario');
const Missao = require('../models/Missao');
const Conquista = require('../models/Conquista');

async function popularDadosIniciais() {
  try {
    const totalUsuarios = await Usuario.count();
    if (totalUsuarios === 0) {
      const senhaPadrao = await bcrypt.hash('123456', 10);
      await Usuario.bulkCreate([
        {
          nome: 'Admin Nexa Play',
          email: 'admin@nexaplay.com',
          senha: senhaPadrao,
          tipo: 'administrador',
          pontos_xp: 600,
          nivel: 2,
        },
        {
          nome: 'Explorador Nexa',
          email: 'jogador@nexaplay.com',
          senha: senhaPadrao,
          tipo: 'jogador',
          pontos_xp: 150,
          nivel: 1,
        },
      ]);
      console.log('Usuários iniciais criados (admin@nexaplay.com / jogador@nexaplay.com - senha: 123456)');
    }

    const totalMissoes = await Missao.count();
    if (totalMissoes === 0) {
      await Missao.bulkCreate([
        {
          titulo: 'Despertar no Mundo Digital',
          descricao: 'Complete o tutorial inicial e configure seu perfil de explorador no Nexa Quest.',
          jornada: 'Jornada Iniciação',
          dificuldade: 'facil',
          pontos_recompensa: 100,
        },
        {
          titulo: 'Decifrando Algoritmos',
          descricao: 'Resolva o desafio de lógica sequencial e desbloqueie o portal da torre.',
          jornada: 'Jornada Lógica & Código',
          dificuldade: 'medio',
          pontos_recompensa: 250,
        },
        {
          titulo: 'Guardião da Segurança',
          descricao: 'Identifique vulnerabilidades e proteja os dados da base Nexa Play.',
          jornada: 'Jornada Cibersegurança',
          dificuldade: 'dificil',
          pontos_recompensa: 400,
        },
        {
          titulo: 'Arquiteto de Interfaces',
          descricao: 'Crie um protótipo responsivo pensando na experiência do usuário.',
          jornada: 'Jornada Design & UX',
          dificuldade: 'medio',
          pontos_recompensa: 200,
        },
      ]);
      console.log('Missões iniciais do Nexa Quest criadas.');
    }

    const totalConquistas = await Conquista.count();
    if (totalConquistas === 0) {
      await Conquista.bulkCreate([
        {
          titulo: 'Primeiro Passo',
          descricao: 'Alcance 100 pontos de XP na plataforma.',
          icone: '🚀',
          xp_necessario: 100,
        },
        {
          titulo: 'Mestre das Missões',
          descricao: 'Acumule 350 pontos de XP completando desafios.',
          icone: '⚔️',
          xp_necessario: 350,
        },
        {
          titulo: 'Lenda Nexa Quest',
          descricao: 'Alcance o Nível 2 (500 XP) e torne-se referência na comunidade.',
          icone: '👑',
          xp_necessario: 500,
        },
      ]);
      console.log('Conquistas (badges) iniciais criadas.');
    }
  } catch (erro) {
    console.error('Erro ao popular dados iniciais:', erro.message);
  }
}

module.exports = popularDadosIniciais;
