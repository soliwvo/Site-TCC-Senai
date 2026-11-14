function pegarToken() {
  return localStorage.getItem('token');
}

function protegerPagina() {
  if (!pegarToken()) {
    window.location.href = 'acesso.html';
  }
}

function mostrarMensagem(texto, tipo) {
  const mensagem = document.getElementById('mensagem');
  if (!mensagem) return;
  mensagem.textContent = texto;
  mensagem.className = 'msg-feedback ' + tipo;
}

function tratarSessaoExpirada(resposta) {
  if (resposta.status === 401) {
    localStorage.removeItem('token');
    alert('Sua sessão expirou. Faça login novamente.');
    window.location.href = 'acesso.html';
    return true;
  }
  return false;
}

function protegerTexto(texto) {
  const div = document.createElement('div');
  div.textContent = texto;
  return div.innerHTML;
}

// Alterna automaticamente "acesso" -> "conta" no menu igual aos frames Desktop 1/15, 2/14 e 5/16 do Figma
(function atualizarNavbarEstadoLogin() {
  const linkAcessoConta = document.getElementById('nav-Acesso-conta');
  if (!linkAcessoConta) return;

  if (pegarToken()) {
    linkAcessoConta.textContent = 'conta';
    linkAcessoConta.href = 'conta.html';
  } else {
    linkAcessoConta.textContent = 'Acesso';
    linkAcessoConta.href = 'acesso.html';
  }
})();
