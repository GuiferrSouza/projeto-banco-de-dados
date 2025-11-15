# Marketplace de Modas - Fashion Store

**Aluno:** Guilherme Ferreira de Souza  
**RA:** 22.122.061-9

## 1. Visão Geral

Este projeto consiste em um marketplace de modas, onde usuários podem listar e consultar produtos como roupas, bolsas, acessórios e perfumes.

O objetivo principal é integrar três bancos de dados diferentes:

- **SQL Server (relacional)** → Usuários / Clientes
- **ScyllaDB (não relacional)** → Pedidos
- **MongoDB (não relacional)** → Produtos

Todos os bancos são executados dentro de containers Docker. Quando o servidor Node.js é iniciado, os bancos de dados, keyspaces, coleções e tabelas são automaticamente criados e inicializados, garantindo que o projeto funcione sem configuração manual prévia.

## 2. Tecnologias Utilizadas

- **Node.js** (Back-end e API REST)
- **Express.js** (Framework de rotas)
- **SQL Server** (relacional, usuários/clientes)
- **ScyllaDB** (NoSQL colunar, pedidos)
- **MongoDB** (NoSQL documento, produtos)
- **Docker / Docker Compose** (Ambiente containerizado)
- **JavaScript** (Lógica da aplicação)

## 3. Pré-requisitos para Rodar o Projeto

Antes de iniciar o projeto localmente, é necessário ter:

1. Docker e Docker Compose instalados
2. Node.js (versão 18 ou superior)
3. NPM ou Yarn (gerenciador de pacotes)

## 4. Configuração Inicial

### 4.1. Clonar o repositório:

```bash
git clone <URL_DO_REPOSITORIO>
cd <PASTA_DO_PROJETO>
```

### 4.2. Instalar dependências do Node.js:

```bash
npm install
```

ou

```bash
yarn install
```

### 4.3. Subir os containers Docker:

```bash
docker-compose up -d
```

Isso irá iniciar automaticamente:

- **SQL Server** → banco de dados `myapp` e tabela `Customers` criados via `sqlserver-init.js`
- **ScyllaDB** → keyspace `myapp` e tabelas `orders`, `orders_by_customer`, `request_logs` criados via `schema.cql`
- **MongoDB** → banco `myapp` e collections `products` e `request_logs` criados via `mongo-init.js`

**Não é necessário criar bancos ou tabelas manualmente, a inicialização é automática.**

## 5. Executando o Projeto

1. Certifique-se que os containers estão rodando (`docker ps`).
2. Execute o servidor Node.js:

```bash
npm start
```

ou

```bash
node server.js
```

## 6. Acesse a API via navegador ou Postman

### 6.1 Clientes (SQL Server)

|Base: `/api/customers`|
|----------------------|

| Método | Rota           | Descrição |
|--------|----------------|-----------|
| POST   | `/`            | Cadastrar um novo cliente. Campos obrigatórios: `name`, `email`, `password`. |
| POST   | `/login`       | Login de cliente. Campos obrigatórios: `email`, `password`. |
| GET    | `/`            | Listar todos os clientes (sem senha). |
| GET    | `/:id`         | Buscar um cliente pelo ID (sem senha). |
| PUT    | `/:id`         | Atualizar nome e telefone de um cliente existente. |
| DELETE | `/:id`         | Remover cliente pelo ID. |

---

### 6.2 Pedidos (ScyllaDB)

|Base: `/api/orders`|
|-------------------|

| Método | Rota                        | Descrição |
|--------|-----------------------------|-----------|
| POST   | `/`                         | Criar um novo pedido. Campos obrigatórios: `customerId`, `items`. |
| GET    | `/customer/:customerId`     | Buscar todos os pedidos de um cliente específico, ordenados do mais recente ao mais antigo. |
| GET    | `/:id`                      | Buscar um pedido pelo ID. |
| PATCH  | `/:id/status`               | Atualizar o status de um pedido. Status válidos: `pending`, `processing`, `shipped`, `delivered`, `cancelled`. |
| GET    | `/logs/requests`            | Buscar os últimos 100 logs de requisições feitas à API. |

> Todas as requisições feitas à API de pedidos são automaticamente logadas em `logsTable`.

---

### 6.3 Produtos (MongoDB)
| Base: `/api/products` |
|-----------------------|

| Método | Rota                     | Descrição |
|--------|--------------------------|-----------|
| POST   | `/`                      | Cadastrar um novo produto. Campos obrigatórios: `name`, `description`, `category`, `price`, `brand`. |
| GET    | `/`                      | Listar todos os produtos, com filtros opcionais: `category`, `brand`, `minPrice`, `maxPrice`. Ordenados do mais recente ao mais antigo. |
| GET    | `/:id`                   | Buscar um produto pelo ID. |
| PUT    | `/:id`                   | Atualizar produto existente pelo ID. |
| DELETE | `/:id`                   | Remover produto pelo ID. |
| GET    | `/meta/categories`       | Listar todas as categorias de produtos cadastradas. |
