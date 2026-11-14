protegerPagina();

let missoes = [];

async function carregarConquistas() {
  try {
    const resposta = await fetch('/conquistas', {
      headers: { 'Authorization': 'Bearer ' + pegarToken() },
    });

    if (tratarSessaoExpirada(resposta)) return;

    const dados = await resposta.json();

    if (!resposta.ok) {
      mostrarMensagem(dados.mensagem || dados.erro, 'erro');
      return;
    }

    const grade = document.getElementById('grade-conquistas');
    grade.innerHTML = '';

    dados.forEach(function (conquista) {
      const classeExtra = conquista.desbloqueada ? '' : 'card-bloqueado';
      const statusTexto = conquista.desbloqueada
        ? 'Desbloqueada!'
        : `Requer ${conquista.xp_necessario} XP`;

      grade.innerHTML += `
        <div class="cartao card-atalho ${classeExtra}">
          <div class="icone">${protegerTexto(conquista.icone)}</div>
          <h2>${protegerTexto(conquista.titulo)}</h2>
          <p>${protegerTexto(conquista.descricao)}</p>
          <p style="margin-top: 8px; font-weight: 600;">${statusTexto}</p>
        </div>
      `;
    });
  } catch (erro) {
    mostrarMensagem('Não foi possível conectar ao servidor.', 'erro');
  }
}

async function carregarMissoesParaHistorico() {
  try {
    const resposta = await fetch('/missoes?limite=100', {
      headers: { 'Authorization': 'Bearer ' + pegarToken() },
    });
    if (resposta.ok) {
      missoes = await resposta.json();
    }
  } catch (erro) {
    // Silencioso; o histórico exibirá o ID caso falhe
  }
}

async function carregarHistorico() {
  try {
    const resposta = await fetch('/progressos', {
      headers: { 'Authorization': 'Bearer ' + pegarToken() },
    });

    if (tratarSessaoExpirada(resposta)) return;

    const dados = await resposta.json();

    if (!resposta.ok) {
      mostrarMensagem(dados.mensagem || dados.erro, 'erro');
      return;
    }

    const tabela = document.getElementById('lista-historico');
    tabela.innerHTML = '';

    if (dados.length === 0) {
      tabela.innerHTML = '<tr><td colspan="4">Nenhuma missão concluída ainda.</td></tr>';
      return;
    }

    dados.forEach(function (item) {
      const missaoEncontrada = missoes.find(function (m) {
        return m.id === item.missao_id;
      });

      const tituloMissao = missaoEncontrada
        ? missaoEncontrada.titulo
        : 'Missão nº ' + item.missao_id;

      const data = new Date(item.createdAt).toLocaleDateString('pt-BR');

      tabela.innerHTML += `
        <tr>
          <td>${data}</td>
          <td>${protegerTexto(tituloMissao)}</td>
          <td><span class="etiqueta concluida">Concluída</span></td>
          <td>+${item.pontos_ganhos} XP</td>
        </tr>
      `;
    });
  } catch (erro) {
    mostrarMensagem('Não foi possível conectar ao servidor.', 'erro');
  }
}

async function iniciar() {
  await carregarConquistas();
  await carregarMissoesParaHistorico();
  await carregarHistorico();
}

iniciar();
