*PESQUISA PETLOG*
https://docs.google.com/forms/d/e/1FAIpQLSdqN2_lq5C8mSnM0WKCCpdkMUx85_SaUGCEhcExmbdWFieyHw/viewform?usp=publish-editor


Pets API  
Esta é uma API back-end desenvolvida em Node.js e TypeScript para gerenciar um sistema de adoção, resgate e doação de animais. 
A API utiliza Express para o roteamento, Knex.js para interação com o banco de dados PostgreSQL e autenticação baseada em JWT.

Funcionalidades Principais:
- Gerenciamento de Usuários: Cadastro e login de usuários com autenticação via JWT (JSON Web Token).
- Gerenciamento de Pets: CRUD completo para animais disponíveis para adoção.
- Processo de Adoção: Usuários podem solicitar a adoção de um pet e as instituições podem atualizar o status dessa solicitação.
- Reporte de Resgates: Usuários podem reportar animais em situação de risco para que instituições possam resgatá-los.
- Registro de Doações: Usuários podem registrar doações (como ração, medicamentos, etc.) para instituições específicas.

Tecnologias Utilizadas:
- Back-end: Node.js
- Linguagem: TypeScript
- Framework: Express.js
- Banco de Dados: PostgreSQL
- Query Builder: Knex.js
- Autenticação: JSON Web Token (jsonwebtoken)
- Hash de Senhas: Bcrypt.js
- Testes: Jest e Supertest
- Variáveis de Ambiente: dotenv
- CORS: cors


Estrutura do Banco de Dados:
O banco de dados PostgreSQL é estruturado pelas seguintes tabelas principais:
- ENDERECOS: Armazena informações de endereço para usuários e instituições.
- USUARIOS: Gerencia os usuários finais da aplicação, incluindo dados de login.
- INSTITUICOES: Armazena dados das ONGs e abrigos.
- PETS: Tabela central dos animais, ligada a uma INSTITUICAO_ID.
- FOTOS_PET: Armazena URLs de fotos dos pets.
- PROCESSO_ADOCAO: Rastreia o status das solicitações de adoção feitas por USUARIOS para PETS.
- DOACOES: Registra doações feitas por USUARIOS para INSTITUICOES.
- REPORTES_RESGATE: Armazena reportes de animais necessitando resgate, feitos por usuários.
- STATUS_RESGATE: Rastreia o andamento de um REPORTE_RESGATE.


Variáveis de Ambiente
Configuração do Banco de Dados (Development)
  - DB_CLIENT=pg
  - DB_HOST=localhost
  - DB_PORT=5432
  - DB_USER=postgres
  - DB_PASSWORD=1234
  - DB_NAME=PETS_API

Configuração do Banco de Dados (Test)
  - DB_NAME_TEST=PETS_API_TEST

Configuração do Servidor
  - PORT=3003

 Segurança
  - JWT_SECRET=sua_chave_secreta_aqui

Instalação e Configuração:

 - Clone o repositório.
 - Instale as dependências:
   - npm install
     
 - Configure seu banco de dados PostgreSQL e crie os bancos de dados para desenvolvimento (PETS_API) e teste (PETS_API_TEST).
 - Configure o arquivo .env com suas credenciais do banco de dados.
 - Execute as migrações do Knex para criar as tabelas:
 - npx knex migrate:latest --env development

Executando a Aplicação
 Modo de Desenvolvimento
 Para rodar o servidor em modo de desenvolvimento com hot-reload:
        -npm run dev

Produção
Para compilar o projeto TypeScript para JavaScript e iniciar o servidor em modo de produção:
 - Compilar o projeto
     - npm run build
 - Iniciar o servidor
     - npm run start

Testes
Para executar a suíte de testes (utilizando o banco de dados de teste):
        - npm run test

Endpoints da API:
A API está estruturada com as seguintes rotas base:
- /usuarios
- /pets
- /adocoes
- /resgates
- /doacoes

Usuários (/usuarios):
- POST /: Cadastra um novo usuário.
- POST /login: Autentica um usuário e retorna um token JWT.
- GET /:id: Busca um usuário pelo ID.
- PATCH /:id: Atualiza nome ou email de um usuário.
- DELETE /:id: Exclui um usuário.

Pets (/pets):
- GET /: Lista todos os pets cadastrados.
- POST /: Cadastra um novo pet.
- GET /:id: Busca um pet específico pelo ID.
- PATCH /:id: Atualiza os dados de um pet.
- DELETE /:id: Remove um pet do sistema.

Adoções (/adocoes):
- POST /: Cria uma nova solicitação de adoção (usuário quer adotar um pet).
- PATCH /:id/status: Atualiza o status de uma adoção (ex: "aprovada", "recusada").
- GET /usuario/:id: Lista todas as solicitações de adoção de um usuário específico.

Doações (/doacoes):
- POST /: Registra uma nova doação de item (ex: ração, dinheiro) para uma instituição.
- GET /instituicao/:id: Lista todas as doações recebidas por uma instituição específica.

Resgates (/resgates):
- POST /reportar: Cria um novo reporte de animal que precisa ser resgatado.
  






















