# 🌱 Nexa Play — NexaQuest

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?style=for-the-badge&logo=express&logoColor=white)
![Sequelize](https://img.shields.io/badge/Sequelize-ORM-52B0E7?style=for-the-badge&logo=sequelize&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-TiDB_Cloud-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

Plataforma web gamificada de educação ambiental e engajamento sustentável, desenvolvida como Trabalho de Conclusão de Curso (TCC) no **SENAI**.

---

## 🌐 Acesso Online (Produção)

* **Aplicação hospedada na Vercel:** https://site-tcc-senai-c1ua.vercel.app/

### Conta de Demonstração (Para Avaliação)
Caso deseje testar o sistema sem realizar um novo cadastro, utilize as credenciais abaixo:
* **E-mail:** `[exemplo@nexaplay.com]`
* **Senha:** `[123456]`

---

## 🎯 Sobre o Projeto

O **Nexa Play** utiliza mecânicas de gamificação — como missões práticas, acúmulo de pontuação e desbloqueio de conquistas (*badges*) — para incentivar hábitos sustentáveis e a conscientização ecológica no dia a dia.

### Principais Funcionalidades
* **Autenticação e Controle de Acesso:** Cadastro de novos usuários e login protegido por tokens **JWT (JSON Web Token)**.
* **Sistema de Missões:** Listagem de desafios ambientais, acompanhamento de status e registro de conclusão.
* **Progresso e Conquistas:** Atualização dinâmica da evolução do usuário e desbloqueio automático de conquistas conforme o desempenho.
* **Interação e Mensagens:** Registro e exibição de mensagens na plataforma.
* **Inicialização Automática (*Seed*):** Sincronização automática das tabelas e carregamento de dados iniciais (missões e conquistas padrão) na primeira conexão com o banco.

---

## 🛠️ Tecnologias Utilizadas

* **Front-end:** HTML5, CSS3 e JavaScript (Vanilla) servidos de forma estática pelo Express.
* **Back-end:** Node.js com framework Express estruturado em arquitetura MVC.
* **Banco de Dados & ORM:** MySQL gerenciado via **Sequelize ORM**, hospedado em nuvem no **TiDB Cloud (Serverless)** com comunicação criptografada via **SSL**.
* **Segurança:** Autenticação baseada em `JWT` e isolamento de credenciais via variáveis de ambiente (`dotenv`).
* **Infraestrutura e Deploy:** Versionamento com Git/GitHub e hospedagem *serverless* na **Vercel**.

---

## 📁 Estrutura do Projeto

```text
nexa-play/
├── docs/
│   ├── nexa_quest.sql            # Script DDL/estrutura do banco de dados
│   └── requisitos_e_testes.md    # Especificação de requisitos e casos de teste
├── public/                       # Arquivos do Front-end (HTML, CSS, JS e imagens)
├── src/
│   ├── config/
│   │   ├── database.js           # Conexão Sequelize (suporte local e SSL em nuvem)
│   │   └── seed.js               # População automática de dados iniciais
│   ├── controllers/              # Regras de negócio e tratamento das requisições
│   ├── middlewares/              # Interceptadores de validação e autenticação JWT
│   ├── models/                   # Definição das entidades e relacionamentos do banco
│   ├── routes/                   # Definição dos endpoints da API REST
│   └── app.js                    # Ponto de entrada da aplicação Express
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
└── vercel.json                   # Configuração de rotas serverless para a Vercel
