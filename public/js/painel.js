protegerPagina();

async function carregarPainel() {
  try {
    const resposta = await fetch('/usuarios/perfil', {
      headers: { 'Authorization': 'Bearer ' + pegarToken() },
    });

    if (tratarSessaoExpirada(resposta)) return;

    const dados = await resposta.json();

    if (!resposta.ok) {
      mostrarMensagem(dados.mensagem || dados.erro, 'erro');
      return;
    }

    document.getElementById('boas-vindas').textContent = `Olá, ${dados.nome}!`;
    document.getElementById('usuario-nivel').textContent = dados.nivel;
    document.getElementById('usuario-xp').textContent = dados.pontos_xp;
    document.getElementById('usuario-tipo').textContent = dados.tipo;

    const xpNoNivelAtual = dados.pontos_xp % 500;
    const porcentagem = (xpNoNivelAtual / 500) * 100;
    const faltam = 500 - xpNoNivelAtual;

    document.getElementById('barra-xp').style.width = `${porcentagem}%`;
    document.getElementById('texto-proximo-nivel').textContent =
      `Faltam ${faltam} XP para alcançar o Nível ${dados.nivel + 1}!`;
  } catch (erro) {
    mostrarMensagem('Não foi possível conectar ao servidor.', 'erro');
  }
}

carregarPainel();
