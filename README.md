# qualle-task-backend

Backend da aplicação Qualle Task, construído com NestJS e TypeORM (PostgreSQL).

## Pré-requisitos

- Node.js 20+
- pnpm
- PostgreSQL
- make [https://developers.make.com/make-cli/make-cli/install-the-make-cli]

## Configuração

Copie o arquivo de exemplo e preencha as variáveis:

```bash
cp .env.example .env
```

## Migrations

O projeto usa TypeORM com `synchronize: false`, ou seja, todas as mudanças de schema são feitas via migrations.

Os arquivos ficam em `src/database/migrations/` e são gerados em TypeScript.

### Criar migration vazia

Para escrever SQL manualmente:

```bash
make migration-create name=NomeDaMigration
```

### Gerar migration automaticamente

Compara as entities com o estado atual do banco e gera o SQL de diferença:

```bash
make migration-generate name=NomeDaMigration
```

### Rodar migrations pendentes

```bash
make migration-run
```

### Reverter a última migration

```bash
make migration-revert
```

### Ver status das migrations

Mostra quais migrations já foram executadas e quais estão pendentes:

```bash
make migration-show
```

## GraphQL Playground

Com o servidor rodando em modo desenvolvimento (`NODE_ENV=development`), o playground interativo fica disponível em:

```
http://localhost:3000/graphql
```

### Rotas públicas

#### `register` — Cadastro de usuário

```graphql
mutation {
  register(input: {
    name: "Test"
    email: "test@test.com"
    password: "12345678"
  })
}
```

Retorna `true` em caso de sucesso.

#### `login` — Autenticação de usuário

```graphql
mutation {
  login(input: { email: "test@test.com", password: "12345678" }) {
    accessToken
    refreshToken
  }
}
```

Retorna `accessToken` e `refreshToken` em caso de sucesso.

### Rotas protegidas

Todas as rotas abaixo exigem autenticação via JWT. Passe o `accessToken` no header:

```
Authorization: Bearer <accessToken>
```

#### `me` — Perfil do usuário logado

```graphql
query {
  me {
    id
    name
    email
    createdAt
    updatedAt
  }
}
```

#### `users` — Listagem paginada de usuários

Suporta paginação e filtro opcional por `name` (busca parcial).

```graphql
query {
  users(input: { page: 1, limit: 10, name: "João" }) {
    total
    page
    limit
    data {
      id
      name
      email
      createdAt
    }
  }
}
```

#### `tasks` — Listagem paginada de tarefas

Suporta paginação e filtros opcionais por `status`, `priority` e `overDueDate`.

Valores de `status`: `TODO`, `IN_PROGRESS`, `DONE`, `CANCELLED`  
Valores de `priority`: `LOW`, `MEDIUM`, `HIGH`

```graphql
query {
  tasks(input: { page: 1, limit: 10, status: TODO, priority: HIGH }) {
    total
    page
    limit
    data {
      id
      title
      status
      priority
      overDueDate
      creator { id name }
      assignees { id name }
      comments { id content userId }
    }
  }
}
```

#### `task` — Detalhes de uma tarefa

```graphql
query {
  task(taskId: "uuid-da-tarefa") {
    id
    title
    description
    status
    priority
    overDueDate
    creator { id name email }
    assignees { id name email }
    comments { id content userId createdAt }
    createdAt
    updatedAt
  }
}
```

#### `createTask` — Criar tarefa

```graphql
mutation {
  createTask(input: {
    title: "Implementar feature X"
    description: "Descrição opcional"
    status: TODO
    priority: HIGH
    overDueDate: "2026-07-01T00:00:00.000Z"
  }) {
    id
    title
    status
    priority
  }
}
```

#### `updateTask` — Atualizar tarefa

Todos os campos exceto `taskId` são opcionais.

```graphql
mutation {
  updateTask(input: {
    taskId: "uuid-da-tarefa"
    title: "Novo título"
    status: IN_PROGRESS
  }) {
    id
    title
    status
    updatedAt
  }
}
```

#### `deleteTask` — Excluir tarefa

```graphql
mutation {
  deleteTask(input: { taskId: "uuid-da-tarefa" })
}
```

Retorna `true` em caso de sucesso.

#### `assignTask` — Atribuir usuários à tarefa

```graphql
mutation {
  assignTask(input: {
    taskId: "uuid-da-tarefa"
    assigneeIds: ["uuid-do-usuario-1", "uuid-do-usuario-2"]
  }) {
    id
    assignees { id name email }
  }
}
```

#### `addComment` — Adicionar comentário à tarefa

```graphql
mutation {
  addComment(input: {
    taskId: "uuid-da-tarefa"
    content: "Comentário aqui."
  }) {
    id
    comments { id content userId createdAt }
  }
}
```
