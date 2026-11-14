const curiosidadesEco = [
  {
    titulo: 'Pulmão do Mundo e Biodiversidade',
    texto: 'O Brasil abriga cerca de 20% de toda a biodiversidade do planeta, com milhares de espécies endêmicas da Mata Atlântica e da Amazônia.',
  },
  {
    titulo: 'Importância dos Polinizadores',
    texto: 'Mais de 75% das culturas alimentares do mundo dependem diretamente de abelhas, aves e morcegos para polinização.',
  },
  {
    titulo: 'Corredores Ecológicos',
    texto: 'Conectar fragmentos de floresta permite que animais silvestres circulem com segurança e mantenham o equilíbrio genético.',
  },
];

const animaisExtincao = [
  {
    titulo: 'Mico-Leão-Dourado',
    texto: 'Primata símbolo da Mata Atlântica fluminense. A perda de habitat reduziu drasticamente sua população silvestre.',
  },
  {
    titulo: 'Ararinha-Azul',
    texto: 'Ave nativa da Caatinga que enfrenta ameaças severas pelo tráfico de animais e destruição das matas ciliares.',
  },
  {
    titulo: 'Onça-Pintada',
    texto: 'Maior felino das Américas e espécie-chave para o equilíbrio ecológico das florestas e do Pantanal.',
  },
];

const tituloPainel = document.getElementById('titulo-painel-quest');
const conteudoPainel = document.getElementById('conteudo-painel-quest');

function renderizarCardsEstaticos(titulo, lista) {
  tituloPainel.textContent = titulo;
  mostrarMensagem('', '');
  conteudoPainel.innerHTML = lista.map((item) => `
    <div class="card-eco-item">
      <h4>${protegerTexto(item.titulo)}</h4>
      <p>${protegerTexto(item.texto)}</p>
    </div>
  `).join('');
}

async function carregarMissoesQuest() {
  tituloPainel.textContent = 'MISSÕES ATIVAS NO NEXA QUEST';
  mostrarMensagem('', '');

  if (!pegarToken()) {
    conteudoPainel.innerHTML = `
      <div class="card-eco-item">
        <h4>Faça login para jogar as missões!</h4>
        <p>Entre na sua conta Nexa Play para concluir desafios ambientais e acumular XP.</p>
        <a href="acesso.html" class="btn-concluir-eco" style="text-align: center; text-decoration: none;">ENTRAR AGORA</a>
      </div>
    `;
    return;
  }

  try {
    const resposta = await fetch('/missoes?limite=12', {
      headers: { 'Authorization': 'Bearer ' + pegarToken() },
    });

    if (tratarSessaoExpirada(resposta)) return;

    const missoes = await resposta.json();

    if (!resposta.ok || missoes.length === 0) {
      conteudoPainel.innerHTML = '<p>Nenhuma missão disponível no momento.</p>';
      return;
    }

    conteudoPainel.innerHTML = missoes.map((m) => `
      <div class="card-eco-item">
        <div>
          <span class="badge-dificuldade">${protegerTexto(m.dificuldade)} • +${m.pontos_recompensa} XP</span>
          <h4 style="margin-top: 8px;">${protegerTexto(m.titulo)}</h4>
          <p style="margin-top: 6px; font-size: 0.95rem;">${protegerTexto(m.descricao)}</p>
        </div>
        <button type="button" class="btn-concluir-eco" onclick="concluirMissaoQuest(${m.id})">
          CONCLUIR MISSÃO
        </button>
      </div>
    `).join('');
  } catch (erro) {
    mostrarMensagem('Erro ao carregar missões do servidor.', 'msg-erro');
  }
}

async function concluirMissaoQuest(id) {
  try {
    const resposta = await fetch('/progressos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + pegarToken(),
      },
      body: JSON.stringify({ missao_id: Number(id) }),
    });

    if (tratarSessaoExpirada(resposta)) return;

    const dados = await resposta.json();

    if (resposta.ok) {
      mostrarMensagem(dados.mensagem, 'msg-sucesso');
    } else {
      mostrarMensagem(dados.mensagem || dados.erro, 'msg-erro');
    }
  } catch (erro) {
    mostrarMensagem('Não foi possível conectar ao servidor.', 'msg-erro');
  }
}

document.querySelectorAll('.btn-categoria-quest').forEach((botao) => {
  botao.addEventListener('click', function () {
    document.querySelectorAll('.btn-categoria-quest').forEach((b) => b.classList.remove('ativo'));
    this.classList.add('ativo');

    const aba = this.dataset.aba;
    if (aba === 'curiosidades') {
      renderizarCardsEstaticos('CURIOSIDADES SOBRE A BIODIVERSIDADE', curiosidadesEco);
    } else if (aba === 'animais') {
      renderizarCardsEstaticos('ANIMAIS EM EXTINÇÃO', animaisExtincao);
    } else {
      carregarMissoesQuest();
    }
  });
});

document.getElementById('btn-jogue-agora-quest').addEventListener('click', function () {
  document.getElementById('painel-quest-dinamico').scrollIntoView({ behavior: 'smooth' });
  carregarMissoesQuest();
});

carregarMissoesQuest();
