// ===== PARTE 1: LISTAR =====
protegerPagina();

let paginaAtual = 1;
const limite = 5;

async function carregarMissoes() {
  const nome = document.getElementById('busca-nome').value;

  try {
    const resposta = await fetch(`/missoes?pagina=${paginaAtual}&limite=${limite}&nome=${nome}`, {
      headers: { 'Authorization': 'Bearer ' + pegarToken() },
    });

    if (tratarSessaoExpirada(resposta)) return;

    const dados = await resposta.json();

    if (!resposta.ok) {
      mostrarMensagem(dados.mensagem || dados.erro, 'erro');
      return;
    }

    const tabela = document.getElementById('lista-missoes');
    tabela.innerHTML = '';

    if (dados.length === 0) {
      tabela.innerHTML = '<tr><td colspan="6">Nenhuma missão encontrada.</td></tr>';
    }

    dados.forEach(function (missao) {
      const textoDificuldade =
        missao.dificuldade === 'facil' ? 'Fácil' :
        missao.dificuldade === 'medio' ? 'Médio' : 'Difícil';

      tabela.innerHTML += `
        <tr>
          <td>${missao.id}</td>
          <td>
            <strong>${protegerTexto(missao.titulo)}</strong><br>
            <small>${protegerTexto(missao.descricao)}</small>
          </td>
          <td>${protegerTexto(missao.jornada)}</td>
          <td><span class="etiqueta ${missao.dificuldade}">${textoDificuldade}</span></td>
          <td>+${missao.pontos_recompensa} XP</td>
          <td>
            <div class="acoes-linha">
              <button type="button" class="botao botao-destaque botao-pequeno" onclick="concluirMissao(${missao.id})">Concluir</button>
              <button type="button" class="botao botao-perigo botao-pequeno" onclick="excluirMissao(${missao.id})">Excluir</button>
            </div>
          </td>
        </tr>
      `;
    });

    document.getElementById('numero-pagina').textContent = paginaAtual;
    document.getElementById('botao-anterior').disabled = paginaAtual === 1;
    document.getElementById('botao-proxima').disabled = dados.length < limite;
  } catch (erro) {
    mostrarMensagem('Não foi possível conectar ao servidor.', 'erro');
  }
}

carregarMissoes();

// ===== PARTE 2: CADASTRAR (ADMINISTRADOR) =====
const formMissao = document.getElementById('form-missao');

formMissao.addEventListener('submit', async function (evento) {
  evento.preventDefault();

  const missao = {
    titulo: document.getElementById('titulo').value,
    jornada: document.getElementById('jornada').value,
    descricao: document.getElementById('descricao').value,
    dificuldade: document.getElementById('dificuldade').value,
    pontos_recompensa: Number(document.getElementById('pontos_recompensa').value),
  };

  try {
    const resposta = await fetch('/missoes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + pegarToken(),
      },
      body: JSON.stringify(missao),
    });

    if (tratarSessaoExpirada(resposta)) return;

    const dados = await resposta.json();

    if (resposta.ok) {
      mostrarMensagem('Missão cadastrada com sucesso!', 'sucesso');
      formMissao.reset();
      carregarMissoes();
    } else {
      mostrarMensagem(dados.mensagem || dados.erro, 'erro');
    }
  } catch (erro) {
    mostrarMensagem('Não foi possível conectar ao servidor.', 'erro');
  }
});

// ===== PARTE 3: CONCLUIR MISSÃO E EXCLUIR =====
async function concluirMissao(id) {
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
      mostrarMensagem(dados.mensagem, 'sucesso');
    } else {
      mostrarMensagem(dados.mensagem || dados.erro, 'erro');
    }
  } catch (erro) {
    mostrarMensagem('Não foi possível conectar ao servidor.', 'erro');
  }
}

async function excluirMissao(id) {
  if (!confirm('Tem certeza que deseja excluir esta missão?')) return;

  try {
    const resposta = await fetch(`/missoes/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': 'Bearer ' + pegarToken() },
    });

    if (tratarSessaoExpirada(resposta)) return;

    const dados = await resposta.json();

    if (resposta.ok) {
      mostrarMensagem(dados.mensagem, 'sucesso');
      carregarMissoes();
    } else {
      mostrarMensagem(dados.mensagem || dados.erro, 'erro');
    }
  } catch (erro) {
    mostrarMensagem('Não foi possível conectar ao servidor.', 'erro');
  }
}

// ===== PARTE 4: BUSCA E PAGINAÇÃO =====
document.getElementById('botao-buscar').addEventListener('click', function () {
  paginaAtual = 1;
  carregarMissoes();
});

document.getElementById('botao-anterior').addEventListener('click', function () {
  paginaAtual = paginaAtual - 1;
  carregarMissoes();
});

document.getElementById('botao-proxima').addEventListener('click', function () {
  paginaAtual = paginaAtual + 1;
  carregarMissoes();
});
