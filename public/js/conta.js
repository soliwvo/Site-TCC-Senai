protegerPagina();

async function carregarConta() {
  try {
    const resposta = await fetch('/usuarios/perfil', {
      headers: { 'Authorization': 'Bearer ' + pegarToken() },
    });

    if (tratarSessaoExpirada(resposta)) return;

    const dados = await resposta.json();

    if (!resposta.ok) {
      mostrarMensagem(dados.mensagem || dados.erro, 'msg-erro');
      return;
    }

    document.getElementById('conta-nome').value = dados.nome;
    document.getElementById('conta-stats-xp').textContent =
      `Nível ${dados.nivel} • ${dados.pontos_xp} XP acumulados • Perfil: ${dados.tipo}`;

    const extraSalvo = localStorage.getItem('nexa_perfil_extra_' + dados.email);
    if (extraSalvo) {
      const extra = JSON.parse(extraSalvo);
      if (extra.dia) document.getElementById('conta-dia').value = extra.dia;
      if (extra.mes) document.getElementById('conta-mes').value = extra.mes;
      if (extra.ano) document.getElementById('conta-ano').value = extra.ano;
      if (extra.foto) {
        const img = document.getElementById('conta-foto-img');
        img.src = extra.foto;
        img.style.display = 'block';
        document.getElementById('conta-avatar-svg').style.display = 'none';
      }
    }
  } catch (erro) {
    mostrarMensagem('Não foi possível conectar ao servidor.', 'msg-erro');
  }
}

// Trocar foto direto na tela Conta (Desktop - 13)
const inputFotoConta = document.getElementById('input-foto-conta');
document.getElementById('btn-trocar-foto-conta').addEventListener('click', function () {
  inputFotoConta.click();
});

inputFotoConta.addEventListener('change', function (evento) {
  const arquivo = evento.target.files[0];
  if (!arquivo) return;
  const leitor = new FileReader();
  leitor.onload = function (e) {
    const img = document.getElementById('conta-foto-img');
    img.src = e.target.result;
    img.style.display = 'block';
    document.getElementById('conta-avatar-svg').style.display = 'none';
  };
  leitor.readAsDataURL(arquivo);
});

document.getElementById('btn-sair-conta').addEventListener('click', function () {
  localStorage.removeItem('token');
  window.location.href = 'index.html';
});

carregarConta();
