if (pegarToken()) {
  window.location.href = 'conta.html';
}

const formLogin = document.getElementById('form-login');

formLogin.addEventListener('submit', async function (evento) {
  evento.preventDefault();

  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;

  try {
    const resposta = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha }),
    });

    const dados = await resposta.json();

    if (resposta.ok) {
      localStorage.setItem('token', dados.token);
      window.location.href = 'conta.html';
    } else {
      mostrarMensagem(dados.mensagem, 'msg-erro');
    }
  } catch (erro) {
    mostrarMensagem('Não foi possível conectar ao servidor.', 'msg-erro');
  }
});

// Atalho prático para login rápido de demonstração no botão "ENTRE COM O GOOGLE"
document.getElementById('btn-google-login').addEventListener('click', function () {
  document.getElementById('email').value = 'jogador@nexaplay.com';
  document.getElementById('senha').value = '123456';
  formLogin.dispatchEvent(new Event('submit'));
});
