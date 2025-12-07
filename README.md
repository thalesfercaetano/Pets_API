# 🐾 Pets API

API RESTful desenvolvida em Node.js e TypeScript para gerenciar um ecossistema completo de adoção de animais. O sistema conecta usuários, instituições e pets, permitindo adoções, doações, resgates e um sistema de "match" entre adotantes e animais.

---

## Tecnologias Utilizadas

- **Node.js**
- **TypeScript**
- **Express.js**
- **PostgreSQL**
- **Knex.js**
- **JWT (Autenticação)**
- **Bcrypt.js**
- **Jest + Supertest**

---

## Funcionalidades

- ** Usuários:** cadastro, login, edição e remoção.
- ** Instituições:** CRUD completo com validações.
- ** Pets:** cadastro, listagem, atualização e remoção.
- ** Matches estilo Tinder:** likes e passes entre usuários e pets/instituições.
- ** Adoções:** solicitação, aprovação e gerenciamento.
- ** Resgates:** reporte e acompanhamento de animais abandonados.
- ** Doações:** registro e controle de doações para instituições.
- ** Endereços:** gerenciamento padronizado de endereços no sistema.

---

## Instalação e Configuração

### ✔ Pré-requisitos
- Node.js 16+
- PostgreSQL instalado e rodando
- NPM ou Yarn

### 1. Clone o repositório

```bash
git clone https://github.com/thalesfercaetano/Pets_API.git
cd Pets_API
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o arquivo `.env`

Crie um `.env` na raiz baseado no `.env.example`:

```ini
# Banco principal
DB_CLIENT=pg
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=SUASENHA
DB_NAME=PETS_API

# Banco de testes
DB_HOST_TEST=localhost
DB_PORT_TEST=5432
DB_USER_TEST=postgres
DB_PASSWORD_TEST=SUASENHA
DB_NAME_TEST=PETS_API_TEST

PORT=3003
JWT_SECRET=minha_chave_secreta
```

### 4. Execute as migrações

```bash
npx knex migrate:latest
```

### 5. Execute a aplicação

**Modo desenvolvimento:**

```bash
npm run dev
```

**Produção:**

```bash
npm run build
npm start
```

**Rodar testes:**

```bash
npm test
```

---

## 🔗 Endpoints da API

### 👤 Usuários (`/usuarios`)
- `POST /usuarios`
- `POST /usuarios/login`
- `GET /usuarios/:id`
- `PATCH /usuarios/:id`
- `DELETE /usuarios/:id`

### 🏢 Instituições (`/instituicoes`)
- `GET /instituicoes`
- `POST /instituicoes`
- `GET /instituicoes/:id`
- `PATCH /instituicoes/:id`
- `DELETE /instituicoes/:id`

### 🐶 Pets (`/pets`)
- `GET /pets`
- `POST /pets`
- `GET /pets/:id`
- `PATCH /pets/:id`
- `DELETE /pets/:id`

### 🔥 Matches (`/matches`)
- `GET /matches/discover/pets?usuario_id=X`
- `GET /matches/discover/usuarios?instituicao_id=X&pet_id=Y`
- `POST /matches/swipe/usuario`
- `POST /matches/swipe/instituicao`
- `GET /matches/usuario/:id`
- `GET /matches/instituicao/:id`

### 🏠 Adoções (`/adocoes`)
- `POST /adocoes`
- `GET /adocoes/usuario/:id`
- `PATCH /adocoes/:id/status`

### 🆘 Resgates (`/resgates`)
- `POST /resgates/reportar`

### 📦 Doações (`/doacoes`)
- `POST /doacoes`
- `GET /doacoes/instituicao/:id`

### 📍 Endereços (`/enderecos`)
- `GET /enderecos`
- `POST /enderecos`
- `GET /enderecos/:id`

---

## 🗄️ Modelo de Banco

O sistema utiliza tabelas como:

- **USUARIOS**
- **INSTITUICOES**
- **ENDERECOS**
- **PETS**
- **PROCESSO_ADOCAO**
- **MATCHES**
- **SWIPES**
- **REPORTES_RESGATE**
- **DOACOES**
- **TIPOS_DOACAO**

---

## 🧪 Como Testar (Postman/Insomnia)

Para testar a API, certifique-se de que o servidor esteja rodando:

```bash
npm run dev
```

A URL base padrão é:

```
http://localhost:3003
```

Sempre envie as requisições com:

```
Content-Type: application/json
```

---

## 1. 📍 Endereços

Crie um endereço primeiro (pois usuários e instituições podem depender dele).

### **POST** `/enderecos`

```json
{
  "rua": "Av. Paulista",
  "numero": "1000",
  "complemento": "Apto 10",
  "bairro": "Bela Vista",
  "cidade": "São Paulo",
  "estado": "SP",
  "cep": "01310100",
  "latitude": -23.561684,
  "longitude": -46.655981
}
```

---

## 2. 👤 Usuários

### **POST** `/usuarios` — Criar Usuário

```json
{
  "name": "João da Silva",
  "email": "joao@email.com",
  "password": "senhaSegura123"
}
```

### **POST** `/usuarios/login` — Login

```json
{
  "email": "joao@email.com",
  "password": "senhaSegura123"
}
```

---

## 3. 🏢 Instituições

### **POST** `/instituicoes`

```json
{
  "nome": "ONG Amigos de Patas",
  "email": "contato@amigosdepatas.com.br",
  "cnpj": "12345678000199",
  "telefone": "11988887777",
  "link_site": "https://amigosdepatas.com.br",
  "descricao": "Resgatamos animais de rua.",
  "endereco_id": 1
}
```

---

## 4. 🐶 Pets

### **POST** `/pets`

```json
{
  "name": "Thor",
  "type": "Cachorro",
  "owner_id": 1,
  "vacinado": true,
  "castrado": true,
  "cor": "Marrom"
}
```

### **PATCH** `/pets/:id`

```json
{
  "name": "Thor - Adotado",
  "ativo": false
}
```

---

## 5. ❤️ Sistema de Matches (Tinder Pet)

### **POST** `/matches/swipe/usuario`

```json
{
  "usuario_id": 1,
  "pet_id": 1,
  "tipo": "like"
}
```

### **POST** `/matches/swipe/instituicao`

```json
{
  "instituicao_id": 1,
  "usuario_id": 1,
  "pet_id": 1,
  "tipo": "like"
}
```

### **GET** `/matches/discover/pets?usuario_id=1`
Listar pets para o usuário dar like/pass.

---

## 6. 🏠 Adoções

### **POST** `/adocoes`

```json
{
  "usuario_id": 1,
  "pet_id": 1
}
```

### **PATCH** `/adocoes/:id/status`

```json
{
  "status": "aprovada"
}
```

_Status possíveis: `pendente`, `aprovada`, `recusada`_

---

## 7. 🆘 Resgates

### **POST** `/resgates/reportar`

```json
{
  "descricao": "Cachorro abandonado próximo ao mercado",
  "localizacao": "Rua das Flores, 123",
  "status": "ferido"
}
```

---

## 8. 📦 Doações

### **POST** `/doacoes`

```json
{
  "usuario_id": 1,
  "instituicao_id": 1,
  "tipo_doacao_id": 1,
  "quantidade": 10.5,
  "status_entrega": "pendente"
}
```

---
