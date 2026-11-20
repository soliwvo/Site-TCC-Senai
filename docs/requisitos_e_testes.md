# 📋 Especificação de Requisitos, Modelagem e Relatório de Testes — Nexa Play

**Projeto:** Nexa Play — EcoQuest  
**Instituição:** SENAI — Trabalho de Conclusão de Curso (TCC)  
**Banco de Dados:** `nexa_quest` (MySQL / TiDB Cloud Serverless)  
**Ambiente de Produção:** Vercel (Node.js + Express + Sequelize ORM)  

---

## 1. Arquitetura do Sistema

A aplicação segue o padrão arquitetural **MVC (Model-View-Controller)** desacoplado, operando com comunicação RESTful em formato JSON:

* **Camada de Apresentação (`public/`):** Interface web desenvolvida em HTML5, CSS3 e JavaScript puro, consumindo os endpoints da API via `fetch`.
* **Camada de Aplicação (`src/`):** Servidor Node.js com Express dividido em rotas (`routes/`), intermediários de autenticação (`middlewares/`), regras de negócio (`controllers/`) e mapeamento objeto-relacional (`models/`).
* **Camada de Persistência (`src/config/database.js`):** Gerenciada pelo **Sequelize ORM**, conectando-se localmente ao MySQL em desenvolvimento e ao cluster **TiDB Cloud (AWS)** via protocolo criptografado **SSL/TLS** em produção.

---

## 2. Requisitos Funcionais (RF)

| Código | Requisito | Descrição | Prioridade |
| :--- | :--- | :--- | :--- |
| **RF01** | Cadastro de Usuário | O sistema deve permitir que novos usuários criem uma conta informando nome, e-mail único e senha. | Alta |
| **RF02** | Autenticação de Usuário | O sistema deve validar e-mail e senha no login e retornar um token de acesso **JWT** para sessões autenticadas. | Alta |
| **RF03** | Consulta de Perfil | O sistema deve exibir os dados do usuário autenticado, incluindo sua pontuação acumulada e nível/progresso. | Média |
| **RF04** | Listagem de Missões | O sistema deve listar todas as missões ambientais disponíveis, exibindo título, descrição e pontuação de recompensa. | Alta |
| **RF05** | Registro e Conclusão de Missões | O sistema deve permitir que o usuário inicie ou conclua uma missão, registrando o progresso e somando os pontos ao seu perfil. | Alta |
| **RF06** | Gerenciamento de Conquistas | O sistema deve exibir as conquistas (*badges*) disponíveis e desbloqueá-las conforme o usuário atinge os critérios de pontuação ou missões concluídas. | Média |
| **RF07** | Envio e Listagem de Mensagens | O sistema deve permitir o registro e a visualização de mensagens/interações vinculadas aos usuários na plataforma. | Baixa |
| **RF08** | Carga Inicial Automática (*Seed*) | O sistema deve verificar a existência de dados iniciais na inicialização e popular automaticamente missões e conquistas padrão caso o banco esteja vazio. | Média |

---

## 3. Requisitos Não Funcionais (RNF)

| Código | Categoria | Descrição |
| :--- | :--- | :--- |
| **RNF01** | Segurança (Autenticação) | As rotas protegidas devem exigir token **JWT** válido no cabeçalho da requisição, bloqueando acessos não autorizados (`HTTP 401/403`). |
| **RNF02** | Segurança (Transporte e Credenciais) | A comunicação com o banco de dados em nuvem deve utilizar criptografia **SSL** (`rejectUnauthorized: true`), e todas as chaves sensíveis devem ser isoladas em variáveis de ambiente (`.env` / Vercel). |
| **RNF03** | Disponibilidade e Escalabilidade | A aplicação deve operar em arquitetura *serverless* na Vercel integrada a banco de dados em nuvem (TiDB Cloud), garantindo acesso contínuo via web e dispositivos móveis. |
| **RNF04** | Manutenibilidade | O código-fonte deve seguir a separação de responsabilidades em camadas (`config`, `models`, `controllers`, `middlewares`, `routes`). |
| **RNF05** | Portabilidade de Banco de Dados | O uso do **Sequelize ORM** deve garantir compatibilidade transparente entre o MySQL local (`localhost:3306`) e o TiDB Cloud (`porta 4000`). |

---

## 4. Regras de Negócio (RN)

* **RN01 — Unicidade de E-mail:** Não é permitido cadastrar dois usuários com o mesmo endereço de e-mail.
* **RN02 — Acúmulo de Pontuação:** Cada missão concluída pelo usuário incrementa sua pontuação total com o valor de pontos definido na respectiva missão.
* **RN03 — Prevenção de Duplicidade na Conclusão:** Uma mesma missão concluída não deve gerar pontuação infinita de forma indevida fora das regras estabelecidas pela aplicação.
* **RN04 — Desbloqueio de Conquistas:** As conquistas são vinculadas ao desempenho do usuário (pontuação mínima ou quantidade de missões finalizadas).

---

## 5. Modelagem e Dicionário de Dados (`nexa_quest`)

### 5.1. Resumo das Entidades e Relacionamentos (DER)
* **`USUARIO` (1) $\rightarrow$ (N) `PROGRESSO` $\leftarrow$ (1) `MISSAO`:** Relacionamento associativo que registra quais missões cada usuário iniciou ou concluiu.
* **`USUARIO` (1) $\rightarrow$ (N) `CONQUISTA` (ou tabela associativa):** Relacionamento que identifica as medalhas/insígnias obtidas pelo usuário.
* **`USUARIO` (1) $\rightarrow$ (N) `MENSAGEM`:** Um usuário pode enviar várias mensagens na plataforma.

### 5.2. Dicionário de Dados

#### Tabela: `USUARIO`
| Campo | Tipo | Chave | Nulo | Descrição |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `INT` (Auto Increment) | **PK** | Não | Identificador único do usuário. |
| `nome` | `VARCHAR(100)` | — | Não | Nome completo ou apelido do usuário. |
| `email` | `VARCHAR(150)` | **UK** | Não | E-mail de acesso (único no sistema). |
| `senha` | `VARCHAR(255)` | — | Não | Senha do usuário armazenada de forma segura. |
| `pontos` | `INT` | — | Não | Saldo total de pontos acumulados (padrão: `0`). |
| `createdAt` | `DATETIME` | — | Não | Data e hora de criação do registro (Sequelize). |
| `updatedAt` | `DATETIME` | — | Não | Data e hora da última atualização (Sequelize). |

#### Tabela: `MISSAO`
| Campo | Tipo | Chave | Nulo | Descrição |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `INT` (Auto Increment) | **PK** | Não | Identificador único da missão ecológica. |
| `titulo` | `VARCHAR(120)` | — | Não | Título curto da missão. |
| `descricao` | `TEXT` | — | Não | Instruções detalhadas da ação sustentável. |
| `pontos` | `INT` | — | Não | Quantidade de pontos concedida ao concluir. |
| `categoria` | `VARCHAR(60)` | — | Sim | Tema ambiental (ex.: Reciclagem, Água, Energia). |
| `createdAt` | `DATETIME` | — | Não | Data e hora de criação do registro. |
| `updatedAt` | `DATETIME` | — | Não | Data e hora da última atualização. |

#### Tabela: `CONQUISTA`
| Campo | Tipo | Chave | Nulo | Descrição |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `INT` (Auto Increment) | **PK** | Não | Identificador único da conquista. |
| `nome` | `VARCHAR(100)` | — | Não | Nome da medalha/insígnia. |
| `descricao` | `TEXT` | — | Não | Critério necessário para desbloqueio. |
| `pontos_necessarios` | `INT` | — | Não | Pontuação mínima exigida para liberar a conquista. |
| `icone` | `VARCHAR(100)` | — | Sim | Referência visual ou ícone da conquista. |
| `createdAt` | `DATETIME` | — | Não | Data e hora de criação do registro. |
| `updatedAt` | `DATETIME` | — | Não | Data e hora da última atualização. |

#### Tabela: `PROGRESSO`
| Campo | Tipo | Chave | Nulo | Descrição |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `INT` (Auto Increment) | **PK** | Não | Identificador único do registro de progresso. |
| `usuario_id` | `INT` | **FK** | Não | Referência ao `id` da tabela `USUARIO`. |
| `missao_id` | `INT` | **FK** | Não | Referência ao `id` da tabela `MISSAO`. |
| `status` | `VARCHAR(30)` | — | Não | Estado da missão (`em_andamento`, `concluida`). |
| `data_conclusao` | `DATETIME` | — | Sim | Data e hora em que a missão foi finalizada. |
| `createdAt` | `DATETIME` | — | Não | Data e hora de início do progresso. |
| `updatedAt` | `DATETIME` | — | Não | Data e hora da última atualização. |

#### Tabela: `MENSAGEM`
| Campo | Tipo | Chave | Nulo | Descrição |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `INT` (Auto Increment) | **PK** | Não | Identificador único da mensagem. |
| `usuario_id` | `INT` | **FK** | Não | Referência ao `id` do autor na tabela `USUARIO`. |
| `conteudo` | `TEXT` | — | Não | Texto da mensagem publicada. |
| `createdAt` | `DATETIME` | — | Não | Data e hora do envio. |
| `updatedAt` | `DATETIME` | — | Não | Data e hora da última edição. |

---

## 6. Relatório de Testes de Software

Os testes abaixo foram executados inicialmente em ambiente local (`localhost:3000`) e validados novamente em ambiente de produção (**Vercel + TiDB Cloud**).

| ID | Caso de Teste | Pré-condição | Passos Executados | Resultado Esperado | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **CT01** | Inicialização do Banco e *Seed* | Banco `nexa_quest` criado no TiDB Cloud e variáveis configuradas na Vercel. | 1. Acessar a URL da aplicação.<br>2. Verificar carregamento das missões iniciais. | Conexão SSL estabelecida com sucesso; tabelas sincronizadas e missões iniciais carregadas. | ✅ **Aprovado** |
| **CT02** | Cadastro de Novo Usuário | Usuário ainda não cadastrado no banco. | 1. Acessar tela de cadastro.<br>2. Preencher nome, e-mail válido e senha.<br>3. Submeter formulário. | Registro gravado na tabela `USUARIO` do TiDB Cloud e retorno de sucesso ao front-end. | ✅ **Aprovado** |
| **CT03** | Bloqueio de E-mail Duplicado | Conta já cadastrada no CT02. | 1. Tentar realizar novo cadastro informando o mesmo e-mail. | Sistema rejeita o cadastro e exibe mensagem informando que o e-mail já está em uso. | ✅ **Aprovado** |
| **CT04** | Login e Geração de Token JWT | Usuário previamente cadastrado. | 1. Informar e-mail e senha corretos na tela de login.<br>2. Clicar em Entrar. | Autenticação aprovada, token JWT gerado e redirecionamento para o painel do usuário. | ✅ **Aprovado** |
| **CT05** | Acesso com Credenciais Inválidas | Usuário na tela de login. | 1. Informar e-mail cadastrado com senha incorreta. | Acesso negado (`HTTP 401`) com alerta de credenciais inválidas. | ✅ **Aprovado** |
| **CT06** | Conclusão de Missão e Pontuação | Usuário autenticado no sistema. | 1. Selecionar uma missão disponível.<br>2. Marcar como concluída. | Progresso salvo na nuvem e pontuação do usuário atualizada na interface. | ✅ **Aprovado** |
| **CT07** | Desbloqueio de Conquistas | Usuário atingir pontuação necessária. | 1. Concluir missões até atingir o requisito da conquista.<br>2. Acessar aba de conquistas. | Conquista exibida como desbloqueada no perfil do usuário. | ✅ **Aprovado** |
| **CT08** | Persistência em Nuvem Multi-dispositivo | Dados salvos nos testes anteriores. | 1. Recarregar a página (`F5`).<br>2. Acessar o link da Vercel pelo navegador do smartphone. | Usuário, pontos e missões concluídas permanecem salvos no TiDB Cloud. | ✅ **Aprovado** |




flowchart LR
    Visitante["👤 Visitante"]
    Usuario["👤 Usuário Autenticado"]
    Sistema["⚙️ Sistema (Seed)"]

    subgraph NexaPlay["Sistema Nexa Play — EcoQuest"]
        UC1(["UC01: Realizar Cadastro"])
        UC2(["UC02: Realizar Login"])
        UC3(["UC03: Consultar Perfil e Pontos"])
        UC4(["UC04: Listar Missões"])
        UC5(["UC05: Concluir Missão"])
        UC6(["UC06: Atualizar Pontuação e Progresso"])
        UC7(["UC07: Desbloquear Conquista"])
        UC8(["UC08: Visualizar Conquistas"])
        UC9(["UC09: Enviar e Ler Mensagens"])
        UC10(["UC10: Popular Dados Iniciais"])
    end

    Visitante --> UC1
    Visitante --> UC2

    Usuario --> UC3
    Usuario --> UC4
    Usuario --> UC5
    Usuario --> UC8
    Usuario --> UC9

    Sistema --> UC10

    UC5 -. "<<include>>" .-> UC6
    UC7 -. "<<extend>>" .-> UC6

    