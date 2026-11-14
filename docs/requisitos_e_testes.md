# Documentação de Requisitos e Plano de Testes — Nexa Quest

## 1. Requisitos Funcionais (RF), Não Funcionais (RNF) e Regras de Negócio (RN)

| Código | Tipo | Descrição | Camada / Arquivo |
| :--- | :--- | :--- | :--- |
| **RF01** | Funcional | O sistema deve permitir o cadastro de novos usuários com perfil (`jogador` ou `administrador`). | `POST /usuarios` (`usuarioController.js`) |
| **RF02** | Funcional | O sistema deve permitir a autenticação de usuários via e-mail e senha retornando token JWT. | `POST /login` (`authController.js`) |
| **RF03** | Funcional | O sistema deve permitir que administradores cadastrem novas missões nas jornadas. | `POST /missoes` (`missaoController.js`) |
| **RF04** | Funcional | O sistema deve listar missões com paginação e filtro por título/jornada. | `GET /missoes` (`missaoController.js`) |
| **RF05** | Funcional | O sistema deve permitir que administradores excluam missões. | `DELETE /missoes/:id` (`missaoController.js`) |
| **RF06** | Funcional | O sistema deve permitir que o jogador conclua uma missão, ganhando XP e evoluindo de nível. | `POST /progressos` (`progressoController.js`) |
| **RF07** | Funcional | O sistema deve exibir o histórico de missões concluídas e as conquistas (badges) desbloqueadas. | `GET /progressos` e `GET /conquistas` |
| **RNF01** | Não Funcional | As senhas devem ser armazenadas criptografadas com hash `bcrypt`. | `usuarioController.js` |
| **RNF02** | Não Funcional | Todas as rotas internas devem exigir token JWT válido no cabeçalho `Authorization`. | `middlewares/auth.js` |
| **RNF03** | Não Funcional | Interface responsiva compatível com desktop, tablet e mobile (`max-width: 600px`). | `public/css/estilo.css` |
| **RN01** | Regra de Negócio | Apenas usuários com perfil `administrador` podem cadastrar ou excluir missões. | `middlewares/checkRole.js` |
| **RN02** | Regra de Negócio | Um jogador não pode concluir a mesma missão mais de uma vez para acumular XP duplicado. | `progressoController.js` |
| **RN03** | Regra de Negócio | A cada 500 pontos de XP acumulados, o jogador avança 1 nível automaticamente. | `progressoController.js` |

## 2. Casos de Teste (Módulo 7)

| ID | Req. | Cenário | Entrada | Resultado Esperado |
| :--- | :--- | :--- | :--- | :--- |
| **CT01** | RF02 | Login com credenciais válidas | `admin@nexaplay.com` / `123456` | Status `200` e retorno de `token` JWT |
| **CT02** | RF02 | Login com senha incorreta | `admin@nexaplay.com` / `errada` | Status `401` e mensagem `"Email ou senha inválidos"` |
| **CT03** | RNF02 | Acessar missões sem token | `GET /missoes` sem header `Authorization` | Status `401` e mensagem `"Token não enviado"` |
| **CT04** | RN01 | Jogador tenta cadastrar missão | Token de `jogador` + `POST /missoes` | Status `403` e mensagem `"Sem permissão para essa ação"` |
| **CT05** | RF03 | Administrador cadastra missão | Token de `administrador` + dados válidos | Status `201` e missão criada no banco |
| **CT06** | RF06 | Jogador conclui missão | Token de `jogador` + `POST /progressos` | Status `201`, XP somado e nível recalculado |
| **CT07** | RN02 | Jogador tenta concluir missão repetida | Mesmo `missao_id` já concluído | Status `400` e mensagem `"Você já concluiu esta missão!"` |
| **CT08** | RF05 | Administrador exclui missão | Token de `administrador` + `DELETE /missoes/:id` | Status `200` e mensagem `"Missão removida com sucesso"` |
