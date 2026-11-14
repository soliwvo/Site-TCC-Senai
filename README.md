# Nexa Play — Plataforma Nexa Quest

Sistema full-stack desenvolvido no padrão arquitetural dos **Módulos 1 a 9 (SENAI - Desenvolvimento de Sistemas)** para o projeto **Nexa Quest** da startup **Nexa Play**.

## Estrutura de Pastas

```text
nexa-play/
├── docs/                       # Requisitos, Script SQL e Plano de Testes (Módulos 6 e 7)
├── public/                     # Front-end HTML, CSS e JS Vanilla (Módulos 8 e 9)
│   ├── css/
│   │   └── estilo.css
│   ├── js/
│   │   ├── comum.js
│   │   ├── login.js
│   │   ├── cadastro.js
│   │   ├── painel.js
│   │   ├── missoes.js
│   │   └── conquistas.js
│   ├── index.html              # Tela de Login
│   ├── cadastro.html           # Tela de Cadastro de Usuário
│   ├── painel.html             # Painel do Jogador / Administrador
│   ├── missoes.html            # Jornadas, Missões e Conclusão
│   └── conquistas.html         # Conquistas (Badges) e Histórico
├── src/                        # Back-end Node.js + Express + Sequelize (Módulos 1 a 5)
│   ├── config/
│   │   ├── database.js
│   │   └── seed.js
│   ├── controllers/
│   │   ├── usuarioController.js
│   │   ├── authController.js
│   │   ├── missaoController.js
│   │   ├── progressoController.js
│   │   └── conquistaController.js
│   ├── middlewares/
│   │   ├── auth.js
│   │   └── checkRole.js
│   ├── models/
│   │   ├── Usuario.js
│   │   ├── Missao.js
│   │   ├── ProgressoMissao.js
│   │   └── Conquista.js
│   ├── routes/
│   │   ├── usuarioRoutes.js
│   │   ├── authRoutes.js
│   │   ├── missaoRoutes.js
│   │   ├── progressoRoutes.js
│   │   └── conquistaRoutes.js
│   └── app.js
├── .env
├── .env.example
├── .gitignore
└── package.json
```

## Como Executar o Projeto (Passo a Passo)

1. **Desbloquear scripts no PowerShell (se estiver no Windows):**
   ```powershell
   Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
   ```

2. **Instalar as dependências:**
   ```bash
   npm install
   ```

3. **Criar o banco de dados no MySQL Workbench:**
   ```sql
   CREATE DATABASE nexa_quest;
   ```
   *(Opcional: você também pode executar o script completo em `docs/banco_de_dados.sql`).*

4. **Configurar o arquivo `.env`:**
   Edite o arquivo `.env` na raiz do projeto com o usuário, senha e porta do seu MySQL local.

5. **Iniciar o servidor:**
   ```bash
   node src/app.js
   ```

6. **Acessar no navegador:**
   Abra `http://localhost:3000`.

## Usuários de Teste Criados Automaticamente

Ao iniciar o servidor pela primeira vez com o banco vazio, o arquivo `src/config/seed.js` cria dados iniciais para facilitar seus testes:

- **Administrador:** `admin@nexaplay.com` | Senha: `123456`
- **Jogador:** `jogador@nexaplay.com` | Senha: `123456`
