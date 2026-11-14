let fotoBase64 = '';

function irParaPasso(numero) {
  document.querySelectorAll('.etapa-step').forEach((el) => el.classList.remove('ativa'));
  document.getElementById('passo-' + numero).classList.add('ativa');
  mostrarMensagem('', '');
}

// Passo 1 -> Passo 2 (Desktop - 4 para Desktop - 6)
document.getElementById('btn-ir-passo-2').addEventListener('click', function () {
  const nome = document.getElementById('cad-nome').value.trim();
  if (!nome) {
    mostrarMensagem('Por favor, preencha seu nome.', 'msg-erro');
    return;
  }
  irParaPasso(2);
});

// Passo 2 -> Passo 3 (Desktop - 6 para Desktop - 9)
document.getElementById('btn-ir-passo-3').addEventListener('click', function () {
  const email = document.getElementById('cad-email').value.trim();
  const senha = document.getElementById('cad-senha').value;
  const confirma = document.getElementById('cad-confirma-senha').value;

  if (!email || !senha) {
    mostrarMensagem('Preencha o e-mail e a senha.', 'msg-erro');
    return;
  }
  if (senha !== confirma) {
    mostrarMensagem('As senhas digitadas não conferem.', 'msg-erro');
    return;
  }
  irParaPasso(3);
});

// Upload e preview de foto no Passo 3 (Desktop - 9)
const inputFoto = document.getElementById('input-foto-cadastro');
document.getElementById('btn-escolher-foto').addEventListener('click', function () {
  inputFoto.click();
});

inputFoto.addEventListener('change', function (evento) {
  const arquivo = evento.target.files[0];
  if (!arquivo) return;

  const leitor = new FileReader();
  leitor.onload = function (e) {
    fotoBase64 = e.target.result;
    const img = document.getElementById('preview-foto-cadastro');
    img.src = fotoBase64;
    img.style.display = 'block';
    document.getElementById('icone-avatar-padrao').style.display = 'none';
  };
  leitor.readAsDataURL(arquivo);
});

// Passo 3 -> Passo 4 (Desktop - 9 para Desktop - 10)
document.getElementById('btn-ir-passo-4').addEventListener('click', function () {
  irParaPasso(4);
});

// Finalizar Cadastro no Passo 4 (POST /usuarios)
document.getElementById('btn-finalizar-cadastro').addEventListener('click', async function () {
  const nomeCompleto = document.getElementById('cad-nome').value.trim();
  const nickname = document.getElementById('cad-nickname').value.trim();
  const nomeFinal = nickname || nomeCompleto;
  const email = document.getElementById('cad-email').value.trim();
  const senha = document.getElementById('cad-senha').value;

  const dadosExtra = {
    dia: document.getElementById('cad-dia').value || '10',
    mes: document.getElementById('cad-mes').value || '05',
    ano: document.getElementById('cad-ano').value || '2006',
    foto: fotoBase64,
  };

  try {
    const resposta = await fetch('/usuarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: nomeFinal,
        email,
        senha,
        tipo: 'jogador',
      }),
    });

    const dados = await resposta.json();

    if (resposta.ok) {
      localStorage.setItem('nexa_perfil_extra_' + email, JSON.stringify(dadosExtra));
      mostrarMensagem('Conta criada com sucesso! Redirecionando para o acesso...', 'msg-sucesso');
      setTimeout(function () {
        window.location.href = 'acesso.html';
      }, 1400);
    } else {
      mostrarMensagem(dados.mensagem || dados.erro, 'msg-erro');
    }
  } catch (erro) {
    mostrarMensagem('Não foi possível conectar ao servidor.', 'msg-erro');
  }
});
